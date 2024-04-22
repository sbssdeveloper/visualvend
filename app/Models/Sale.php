<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $table = 'sale_report';
    protected $fillable = ['*'];

    public static function recentVendCount($params)
    {
        extract($params);
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;
        $search     = $request->search;

        $model =  self::where('is_deleted', '0');

        if ($machine_id) {
            $model =  $model->where('machine_id', $machine_id);
        } else if ($auth->client_id > 0) {
            $model =  $model->where('client_id', $auth->client_id);
            if (count($machine_ids) > 0) {
                $model =  $model->whereIn("machine_id", $machine_ids);
            } else {
                $model =  $model->whereIn("machine_id", ["no_machine"]);
            }
        }



        if (!empty($search)) {
            $model =  $model->where("machine_name", 'like', '%' . $request->search . '%');
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->whereRaw("sale_report.timestamp>='$start_date'");
            $model  = $model->whereRaw("sale_report.timestamp<='$end_date'");
        }
        $model =  $model->count();
        return $model;
    }
}
