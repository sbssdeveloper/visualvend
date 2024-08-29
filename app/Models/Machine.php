<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Machine extends Model
{
    use SoftDeletes;
    protected $table = 'machine';
    protected $fillable = ['*'];

    public $timestamps = false;

    public function category()
    {
        return $this->hasOne(MachineAssignCategory::class, "machine_id", "id");
    }

    public function product_map()
    {
        return $this->hasMany(MachineProductMap::class, "machine_id", "id");
    }

    public function heart_beats()
    {
        return $this->hasOne(MachineHeartBeat::class, 'machine_id', "id");
    }

    public static function personal($request, $type = "count", $select = ["id"])
    {
        $auth = $request->auth;
        $array =  self::select($select);

        if ($auth->client_id > 0) {
            $array->whereRaw(\DB::raw("FIND_IN_SET(id,\"$auth->machines\")", '!=', null));
        }
        if ($request->machine_id > 0) {
            $array->where("id",$request->machine_id);
        }

        $array->where("is_deleted", 0);

        if ($type === "columns") {
            $columns = $array->get();
            return $columns;
        } else if ($type === "count") {
            $count = $array->count();
            return $count;
        }

        $collection = collect($array);

        $parse = $collection->map(function ($item, $key) {
            return $item->id;
        });

        return $parse->all();
    }

    public static function personal_info($machines, $client_id)
    {
        $list =  self::select(['id, machine_name, machine_client_id'])->whereRaw(\DB::raw("FIND_IN_SET(id,\"$machines\")", '!=', null))->where("is_deleted", 0)->get();

        $collection = collect($list);

        $ids = $collection->map(function ($item, $key) {
            return $item->id;
        })->all();

        return compact('list', 'ids');
    }

    public static function dashboardInfo($auth, $machines)
    {
        $model = self::with(['heart_beats'])->where("is_deleted", 0);

        if ($auth->client_id > 0) {
            $model  = $model->whereIn("id", $machines);
        }

        $model  = $model->select('id')->get();
        $response["total"]          = count($model);
        $response['connected']      = 0;
        $response['fluctuating']    = 0;
        $response['offline']        = 0;
        $response['not_connected']  = 0;
        foreach ($model as $value) {
            $data = $value->heart_beats;
            if ($data) {
                $diff_time = (strtotime(date("y-m-d H:i:s")) - strtotime($data->last_sync_time));
                if ($diff_time <= 1800) {
                    $response['connected'] += 1;
                } else if ($diff_time <= 4800) {
                    $response['fluctuating'] += 1;
                } else {
                    $response['offline'] += 1;
                }
            }
        }

        $response['not_connected']  = $response["total"] - ($response['offline'] + $response['connected'] + $response['fluctuating']);
        return ['machines' => $response];
    }
}
