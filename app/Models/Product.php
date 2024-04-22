<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'product';
    protected $fillable = ['*'];

    public function assigned($auth, $select = ["product.*"], $type = "count")
    {
        $model = self::select($select)->leftJoin("machine_product_map", function ($leftJoin) {
            $leftJoin->on("machine_product_map.client_id", "=", "product.client_id")
                ->on("machine_product_map.product_id", "=", "product.product_id");
        })->where("is_deleted", 0);
        if ($auth->client_id > 0) {
            $model = $model->where("product.client_id", $auth->client_id)->whereRaw(\DB::raw("FIND_IN_SET(machine_id,\"$auth->machines\")", '!=', null));
        }
        $model = $model->groupby('product.id');
        if ($type === "count") {
            $model = $model->count();
        } else {
            $model = $model->get();
        }
        return $model;
    }

    public function total($auth, $select = ["product.*"], $type = "count")
    {
        $model = self::select($select)->where("is_deleted", 0);
        if ($auth->client_id > 0) {
            $model = $model->where("product.client_id", $auth->client_id);
        }
        if ($type === "count") {
            $model = $model->count();
        } else {
            $model = $model->get();
        }
        return $model;
    }
}
