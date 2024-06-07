<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class StockReset extends Model
{
    protected $table = 'stock_reset';
    protected $fillable = ['*'];

    public function reset($request)
    {
        $model = MachineProductMap::select("product_location", "product_id", "product_name", "product_quantity")->whereIn("product_location", $request->aisles)->where("machine_id", $request->machine_id)->get()->toArray();

        $mapped = [];

        foreach ($model as $value) {
            extract($value);
            $mapped[$value["product_location"]] = ["product_id" => $product_id, "product_name" => $product_name, "product_quantity" => $product_quantity];
        }

        $machine_name = Machine::find($request->machine_id)->first()->machine_name;

        $array = [];

        foreach ($request->aisles as $value) {
            $array[] = [
                "uuid"              => (string) Str::uuid(),
                "aisle"             => $value,
                "client_id"         => $request->auth->client_id,
                "client_name"       => $request->auth->client_name ?? "",
                "product_id"        => isset($mapped[$value]) ? $mapped[$value]["product_id"] : "no-product",
                "product_name"      => isset($mapped[$value]) ? $mapped[$value]["product_name"] : "no-Product",
                "machine_id"        => $request->machine_id,
                "machine_name"      => $machine_name ?? "",
                "original_amount"   => isset($mapped[$value]) ? $mapped[$value]["product_quantity"] : 0,
            ];
        }

        DB::beginTransaction();
        try {
            self::insert($array);
            MachineProductMap::whereIn("product_location", $request->aisles)->where("machine_id", $request->machine_id)->update([
                "product_quantity" => 0
            ]);
            MachineAssignProduct::whereIn("product_location", $request->aisles)->where("machine_id", $request->machine_id)->update([
                "product_quantity" => 0
            ]);
            DB::commit();
            return ["response" => "success"];
        } catch (\Exception $e) {
            DB::rollBack();
            return ["response" => "error", "message" => $e->getMessage()];
        }
    }
}
