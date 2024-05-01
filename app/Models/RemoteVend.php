<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Transaction;
use stdClass;

class RemoteVend extends Model
{
    protected $table = 'remote_vend_log';
    protected $fillable = ['*'];

    public function transaction()
    {
        return $this->hasOne(Transaction::class, 'vend_uuid', 'vend_id');
    }

    public static function recentVend($params)
    {
        extract($params);
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;
        $product_id = $request->product_id;
        $search     = $request->search;
        $model      =  self::selectRaw("COUNT(*) as vended_items, SUM(IF(remote_vend_log.pay_method='	
        pay_to_card',transactions.amount,0)) as card_sales, SUM(IF(remote_vend_log.pay_method IN('apple_pay','pay_to_card','google_pay','paypal'), transactions.amount, 0)) as mobile_payments, SUM(transactions.amount) as total_sales")->leftJoin("transactions", "transactions.transaction_id", '=', "remote_vend_log.transaction_id")->where("remote_vend_log.status", "2")->where('is_deleted', '0');

        if ($machine_id) {
            $model =  $model->where('machine_id', $machine_id);
        } else if ($product_id) {
            $model =  $model->where('product_id', $product_id);
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
        $model =  $model->get()->first();
        if (!$model) {
            $model                  = new stdClass();
            $model->vended_items    = 0;
            $model->card_sales      = 0;
            $model->mobile_payments = 0;
            $model->total_sales     = 0;
        }
        $model->card_sales = number_format($model->card_sales, 2);
        $model->mobile_payments = number_format($model->mobile_payments, 2);
        $model->total_sales = number_format($model->total_sales, 2);
        // 
        return $model;
    }

    public static function vendRun($params)
    {
        extract($params);
        $model =  self::select(["vend_id", "product_name", "machine_id", "product_id"])->whereIn("status", ["0", "1", "11"])->where('is_deleted', '0')->whereRaw("product_id != '0'");

        if ($request->machine_id > 0) {
            $model =  $model->where('machine_id', $request->machine_id);
        } else if (!empty($request->product_id)) {
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
