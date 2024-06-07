<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class RefillHistory extends Model
{
    protected $table = 'refill_history';
    protected $fillable = ['*'];

    public function refill($request)
    {
        $model = MachineProductMap::select("product_location", "product_id", "product_name", "product_quantity", "product_max_quantity", "category_id")->with(["category" => function ($query) {
            $query->select("category_id", "category_name");
        }])->whereIn("product_location", $request->aisles)->where("machine_id", $request->machine_id)->get()->toArray();

        $mapped = [];

        foreach ($model as $value) {
            extract($value);
            $mapped[$value["product_location"]] = ["product_id" => $product_id, "product_name" => $product_name, "product_quantity" => $product_quantity, "product_max_quantity" => $product_max_quantity, "category_id" => $category_id, "category_name" => isset($value["category"]["category_name"]) ? $value["category"]["category_name"] : "No Category"];
        }

        $machine_name = Machine::find($request->machine_id)->first()->machine_name;

        $array = [];

        foreach ($request->aisles as $value) {
            $array[] = [
                "aisle_number"      => $value,
                "client_id"         => $request->auth->client_id,
                "product_id"        => isset($mapped[$value]) ? $mapped[$value]["product_id"] : "no-product",
                "product_name"      => isset($mapped[$value]) ? $mapped[$value]["product_name"] : "no-Product",
                "machine_id"        => $request->machine_id,
                "machine_name"      => $machine_name ?? "",
                "category_id"       => isset($mapped[$value]) ? $mapped[$value]["category_id"] : "no_category",
                "category_name"     => isset($mapped[$value]) ? $mapped[$value]["category_name"] : "No Category",
                "refill_amount"     => isset($mapped[$value]) && (int) $mapped[$value]["product_max_quantity"] - (int)$mapped[$value]["product_quantity"] >= 0 ? (int) $mapped[$value]["product_max_quantity"] - (int)$mapped[$value]["product_quantity"] : 0,
                "origin_amount"     => isset($mapped[$value]) ? (int)$mapped[$value]["product_quantity"] : 0,
                "delete_user_id"    => 0
            ];
        }

        DB::beginTransaction();
        try {
            self::insert($array);
            MachineProductMap::whereIn("product_location", $request->aisles)->where("machine_id", $request->machine_id)->update([
                "product_quantity" => DB::raw('product_max_quantity')
            ]);
            MachineAssignProduct::whereIn("product_location", $request->aisles)->where("machine_id", $request->machine_id)->update([
                "product_quantity" => DB::raw('product_max_quantity')
            ]);
            DB::commit();
            return ["response" => "success"];
        } catch (\Exception $e) {
            DB::rollBack();
            return ["response" => "error", "message" => $e->getMessage()];
        }
    }
}
