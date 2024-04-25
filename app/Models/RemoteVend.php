<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RemoteVend extends Model
{
    protected $table = 'remote_vend_log';
    protected $fillable = ['*'];

    public static function vendRun($params)
    {
        extract($params);
        $model =  self::select(["vend_id", "product_name", "machine_id", "product_id"])->whereIn("status", ["0", "1", "11"])->where('is_deleted', '0')->where('product_id !=', '0');

        if ($request->machine_id) {
            $model =  $model->where('machine_id', $request->machine_id);
        } else if ($request->product_id) {
            $model =  $model->where('product_id', $request->product_id);
        }
        if ($auth->client_id > 0) {
            $model =  $model->where('client_id', $auth->client_id);
            if (count($machine_ids) > 0) {
                $model =  $model->whereIn("machine_id", $machine_ids);
            } else {
                $model =  $model->whereIn("machine_id", ["no_machine"]);
            }
        }

        if (!empty($search)) {
            $model =  $model->whereRaw("machine_name like '%$request->search%'");
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->whereRaw("updated_at>='$start_date'");
            $model  = $model->whereRaw("updated_at<='$end_date'");
        }

        $model =  $model->get();
        return $model;
    }
}
