<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocationNonFunctional extends Model
{
    protected $table = 'location_non_functional';
    protected $fillable = ['*'];
    protected $hidden = ['id'];

    public static function dashboardInfo($request, $machines)
    {
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;
        $product_id = $request->product_id;
        $search     = $request->search;
        $client_id  = $request->auth->client_id;

        $model =  self::select("location_non_functional.*", "client.client_name")->leftJoin("machine", "machine.id", "=", "location_non_functional.machine_id")->leftJoin("client", "client.id", "=", "machine.machine_client_id")->where('location_non_functional.is_deleted', '0');

        if ($client_id > 0) {
            $model =  $model->where('machine.machine_client_id', $client_id);
            if (count($machines) > 0) {
                $model =  $model->whereIn("location_non_functional.machine_id", $machines);
            } else {
                $model =  $model->whereIn("location_non_functional.machine_id", ["no_machine"]);
            }
        }

        if ($machine_id) {
            $model =  $model->where('location_non_functional.machine_id', $machine_id);
        }

        if (!empty($search)) {
            $model =  $model->where(function ($query) use ($search) {
                $query->where("location_non_functional.machine_name", "LIKE", "$search%")
                    ->orWhere('location_non_functional.product_name', "LIKE", "$search%");
            });
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->where('location_non_functional.timestamp', ">=", $start_date);
            $model  = $model->where('location_non_functional.timestamp', "<=", $end_date);
        }

        $model =  $model->orderBy('location_non_functional.id', 'DESC')->limit(5)->get();
        return ['recent_vend_error' => $model];
    }
}
