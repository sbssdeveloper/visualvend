<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feed extends Model
{
    protected $table = 'feed';
    protected $fillable = ['*'];

    public static function dashboardInfo($request, $machines)
    {
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;
        $client_id  = $request->auth->client_id;

        $model =  self::select("feed.*", "machine.machine_name")->leftJoin("machine", "machine.id", "=", "feed.machine_id");

        if ($client_id > 0) {
            $model =  $model->where('feed.client_id', $client_id);
        }

        if ($machine_id) {
            $model =  $model->where('feed.machine_id', $machine_id);
            if (count($machines) > 0) {
                $model =  $model->whereIn("feed.machine_id", $machines);
            } else {
                $model =  $model->whereIn("feed.machine_id", ["no_machine"]);
            }
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->where('feed.created_on', ">=", $start_date);
            $model  = $model->where('feed.created_on', "<=", $end_date);
        }

        $model =  $model->orderBy('feed.id', 'DESC')->limit(20)->get();
        return ['recent_feed' => $model];
    }
}
