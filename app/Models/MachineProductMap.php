<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MachineProductMap extends Model
{
    protected $table = 'machine_product_map';
    protected $fillable = ['*'];

    public static function stocks($params)
    {
        extract($params);
        $model = self::selectRaw("SUM(product_max_quantity) as total_quantity,SUM(product_quantity) as remaining_quantity");
        if ($auth->client_id > 0) {
            $model = $model->whereIn("machine_id", $machine_ids)->where("client_id", $auth->client_id);
        }
        $model = $model->get()->first();
        return $model;
    }

    public static function refillRequire($params)
    {
        extract($params);
        $model = self::selectRaw("product_id, SUM(product_max_quantity) as total_quantity,SUM(product_quantity) as remaining_quantity, SUM(product_max_quantity)-SUM(product_quantity) as refill, product_name");
        if ($auth->client_id > 0) {
            $model = $model->whereIn("machine_id", $machine_ids)->where("client_id", $auth->client_id);
        }
        $model = $model->groupBy("machine_id")->orderBy("refill","DESC")->get()->first();
        return $model;
    }
}
