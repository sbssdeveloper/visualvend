<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedback';
    protected $fillable = ['*'];

    public static function dashboardInfo($request, $machines)
    {
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;
        $product_id = $request->product_id;
        $search     = $request->search;
        $client_id  = $request->auth->client_id;

        $model      = self::select("feedback.*", "client.client_name", "machine.machine_name")->leftJoin("client", "client.id", "=", "feedback.client_id")->leftJoin("machine", "feedback.machine_id", "=", "machine.id")->where('feedback.is_deleted', '0')->whereNotNull('feedback.product_id');

        if ($client_id > 0) {
            $model =  $model->where('feedback.client_id', $client_id);
            if (count($machines) > 0) {
                $model =  $model->whereIn("feedback.machine_id", $machines);
            } else {
                $model =  $model->whereIn("feedback.machine_id", ["no_machine"]);
            }
        }

        if ($machine_id) {
            $model =  $model->where('feedback.machine_id', $machine_id);
        } else if ($product_id) {
            $model =  $model->where('feedback.product_id', $product_id);
        }

        if (!empty($search)) {
            $model =  $model->where(function ($query) use ($search) {
                $query->where("machine.machine_name", "LIKE", "$search%")
                    ->orWhere('feedback.product_name', "LIKE", "$search%");
            });
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->where('feedback.timestamp', ">=", $start_date);
            $model  = $model->where('feedback.timestamp', "<=", $end_date);
        }

        $model =  $model->orderBy('feedback.feedback_id', 'DESC')->limit(5)->get()->toArray();
        return ['recent_feedback' => $model];
    }
}
