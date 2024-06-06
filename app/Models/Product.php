<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    protected $table = 'product';
    protected $fillable = ['*'];

    public function images()
    {
        return $this->hasMany(ProductImage::class, "uuid", "uuid");
    }

    public function assigned($auth, $select = ["product.*"], $type = "count")
    {
        $model = self::select($select)->leftJoin("machine_product_map", function ($leftJoin) {
            $leftJoin->on("machine_product_map.client_id", "=", "product.client_id")
                ->on("machine_product_map.product_id", "=", "product.product_id");
        })->where("is_deleted", 0);
        if ($auth->client_id > 0) {
            $model = $model->where("product.client_id", $auth->client_id)->whereRaw(\DB::raw("FIND_IN_SET(machine_id,\"$auth->machines\")", '!=', null));
        }
        $model = $model->groupBy('product.id');
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

    public static function totalProducts($client_id)
    {
        $count = self::where('is_deleted', 0);
        if ($client_id > 0) {
            $count = $count->where('client_id', $client_id);
        }
        $count = $count->count();
        return $count;
    }

    public static function dashboardInfo($auth)
    {
        $model = self::leftJoin('machine_product_map', "machine_product_map.product_id", "=", "product.product_id")->where('product.is_deleted', 0);
        if ($auth->client_id > 0) {
            $model = $model->where('product.client_id', $auth->client_id);
        }
        $model = $model->groupBy("product.product_id")->get()->count();
        $response["assigned"]   = $model;
        $response["total"]      = self::totalProducts($auth->client_id);
        $response["unassigned"] = $response["total"] - $response["assigned"];
        return ['products' => $response];
    }

    public function scopeWithMappedJoin(Builder $query)
    {
        $query;
    }

    public function assignedList($request)
    {
        $model = self::select("product.*", "product.uuid")->leftJoin("machine_product_map", function ($join) {
            $join->on('machine_product_map.product_id', '=', 'product.product_id');
            $join->on('machine_product_map.client_id', '=', 'product.client_id');
        })->where("machine_product_map.id", ">", 0)->where("is_deleted", 0);

        if ($request->auth->client_id > 0) {
            $model = $model->where("client_id", $request->auth->client_id);
        }

        if (!empty($request->search)) {
            $search = $request->search;
            $model = $model->where(function ($query) use ($search) {
                $query->where("product.product_name", "like", $search . "%")->orWhere("product.product_id", "like", $search . "%");
            });
        }

        $model = $model->with(['images' => function ($query) {
            $query->select('image', 'uuid');
        }])->paginate($request->length ?? 100);
        return $model;
    }

    public function unAssignedList($request)
    {
        $model = self::select("product.*", "product.uuid")->leftJoin("machine_product_map", function ($join) {
            $join->on('machine_product_map.product_id', '=', 'product.product_id');
            $join->on('machine_product_map.client_id', '=', 'product.client_id');
        })->whereNull("machine_product_map.id")->where("is_deleted", 0);

        if ($request->auth->client_id > 0) {
            $model = $model->where("client_id", $request->auth->client_id);
        }

        if (!empty($request->search)) {
            $search = $request->search;
            $model = $model->where(function ($query) use ($search) {
                $query->where("product.product_name", "like", $search . "%")->orWhere("product.product_id", "like", $search . "%");
            });
        }

        $model = $model->with(['images' => function ($query) {
            $query->select('image', 'uuid');
        }])->paginate($request->length ?? 100);
        return $model;
    }
}
