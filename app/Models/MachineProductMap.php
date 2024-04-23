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
        if ($model) {
            $required_quantity = (($model->total_quantity - $model->remaining_quantity) * 100) / $model->total_quantity;
            $model->required_quantity = number_format((float)$required_quantity, 1, '.', '');
        }
        return $model;
    }

    public static function refillRequire($params)
    {
        extract($params);
        $model = self::selectRaw("machine_id, product_id, (product_max_quantity) as total,(product_quantity) as remaining, ((product_max_quantity)-(product_quantity)) as refill, product_name");
        if ($auth->client_id > 0) {
            $model = $model->whereIn("machine_id", $machine_ids)->where("client_id", $auth->client_id);
        }
        $model = $model->havingRaw("refill>0")->limit(20)->get();
        return $model;
    }
}
