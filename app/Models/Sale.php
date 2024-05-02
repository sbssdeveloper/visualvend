<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $table = 'sale_report';
    protected $fillable = ['*'];

    public static function recentVend($params)
    {
        extract($params);
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;
        $product_id = $request->product_id;
        $search     = $request->search;

        $model =  self::selectRaw("SUM(CAST(product_price AS DECIMAL(10,2))) as total_sales")->where('is_deleted', '0');
        $today = self::selectRaw("COUNT(*) as vended_items, SUM(CAST(product_price AS DECIMAL(10,2))) as total_sales")->where('is_deleted', '0')->whereDate("timestamp", date("Y-m-d"));
        if ($machine_id) {
            $model =  $model->where('machine_id', $machine_id);
            $today =  $today->where('machine_id', $machine_id);
        } else if ($product_id) {
            $model =  $model->where('product_id', $product_id);
            $today =  $today->where('product_id', $product_id);
        }
        if ($auth->client_id > 0) {
            $model =  $model->where('client_id', $auth->client_id);
            $today =  $today->where('client_id', $auth->client_id);
            if (count($machine_ids) > 0) {
                $model =  $model->whereIn("machine_id", $machine_ids);
                $today =  $today->whereIn("machine_id", $machine_ids);
            } else {
                $model =  $model->whereIn("machine_id", ["no_machine"]);
                $today =  $today->whereIn("machine_id", ["no_machine"]);
            }
        }

        if (!empty($search)) {
            $model =  $model->whereRaw("machine_name like '%$request->search%'");
            $today =  $today->whereRaw("machine_name like '%$request->search%'");
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->whereRaw("sale_report.timestamp>='$start_date'");
            $model  = $model->whereRaw("sale_report.timestamp<='$end_date'");
        }
        $model =  $model->get()->first();
        $model->today_sales = $today->total_sales ?? "0.00";
        return $model;
    }
}
