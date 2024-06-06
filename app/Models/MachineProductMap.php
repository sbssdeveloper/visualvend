<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Sale;
use DB;

class MachineProductMap extends Model
{
    protected $table = 'machine_product_map';
    protected $fillable = ['*'];

    public function products()
    {
        return $this->belongsTo(Product::class, "product_id", "product_id")->where('client_id', 'client_id');;
    }

    public static function stocks($params)
    {
        extract($params);
        $machine_id = $request->machine_id;
        $model = self::selectRaw("SUM(IF(product_quantity=0 AND product_max_quantity>0,1,0)) as out_of_stock,SUM(IF(product_quantity>0 AND product_max_quantity>0,1,0)) as in_stock, SUM(product_max_quantity) as total_quantity,SUM(product_quantity) as remaining_quantity");
        $slowSell = Sale::selectRaw("COUNT(*) as count");
        if ($machine_id > 0) {
            $model = $model->where("machine_id", $machine_id);
            $slowSell = $slowSell->where("machine_id", $machine_id);
        } else if ($auth->client_id > 0) {
            $model = $model->whereIn("machine_id", $machine_ids)->where("client_id", $auth->client_id);
            $slowSell = $slowSell->whereIn("machine_id", $machine_ids)->where("client_id", $auth->client_id);
        }
        $slowSell = $slowSell->groupBy(["product_id", "client_id"])->havingRaw(DB::raw('count <= CEIL(count/10)'))->get()->count();
        $model = $model->get()->first();
        if ($model) {
            $model->slow_sell = $slowSell ?? 0;
            if ($model->total_quantity == 0) {
                $model->required_quantity = "0%";
            } else {
                $required_quantity = ($model->remaining_quantity * 100) / $model->total_quantity;
                $model->required_quantity = number_format((float)$required_quantity, 1, '.', '') . "%";
            }
        }

        return $model;
    }

    public static function refillRequire($params)
    {
        extract($params);
        $model = self::selectRaw("machine_id,machine_name, product_id, (product_max_quantity) as total,(product_quantity) as remaining, ((product_max_quantity)-(product_quantity)) as refill, product_name")->leftJoin("machine", "machine.id", "=", "machine_product_map.machine_id");
        if ($auth->client_id > 0) {
            $model = $model->whereIn("machine_id", $machine_ids)->where("client_id", $auth->client_id);
        }
        $model = $model->havingRaw("refill>0")->limit(20)->get();
        return $model;
    }
}
