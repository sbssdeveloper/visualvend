<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Sale;

class MachineProductMap extends Model
{
    protected $table = 'machine_product_map';
    protected $fillable = ['*'];

    public static function stocks($params)
    {
        extract($params);
        $model = self::selectRaw("SUM(IF(product_quantity=0 AND product_max_quantity>0,1,0)) as out_of_stock,SUM(IF(product_quantity>0 AND product_max_quantity>0,1,0)) as in_stock, SUM(product_max_quantity) as total_quantity,SUM(product_quantity) as remaining_quantity");
        $slowSell = Sale::select("COUNT(*) as count");
        SELECT COUNT(*) as count, product_id FROM `sale_report` GROUP BY product_id,client_id HAVING count<=CEIL(count/10);
        if ($auth->client_id > 0) {
            $model = $model->whereIn("machine_id", $machine_ids)->where("client_id", $auth->client_id);
            $slowSell = $slowSell->whereIn("machine_id", $machine_ids)->where("client_id", $auth->client_id);
        }
        $slowSell = $slowSell->groupBy("product_id,client_id")->havingRaw(DB::raw('count <= CEIL(count/10)'))->get()->count();
        $model = $model->get()->first();
        dd($slowSell);
        if ($model) {
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
