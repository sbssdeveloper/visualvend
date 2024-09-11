<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MachineUser extends Model
{
    protected $table = 'user';
    protected $fillable = ['*'];
    public  $timestamps = false;

    protected $appends = ['name'];

    public function getNameAttribute()
    {
        return ucfirst($this->firstname) . ' ' . ucfirst($this->lastname);
    }

    public static function dashboardInfo($request, $machines)
    {
        $model = self::select('user.status', 'user.activated_on')->where("is_deactivated", 0);
        if ($request->auth->client_id > 0) {
            $model->leftJoin("machine", "machine.machine_username", "=", "user.username")->whereIn("machine.id", $machines);
        }
        if($request->machine_id>0){
            $model->where("machine.id", $request->machine_id);
        }
        $model      = $model->groupBy("user.id")->get();
        $response["total"]      = count($model);
        $response["active"]     = 0;
        $response["inactive"]   = 0;
        foreach ($model as $value) {
            $diff_time = strtotime(date("Y-m-d H:i:s")) - strtotime($value->activated_on);
            if ($diff_time > 1800) {
                $response['active'] += 1;
            } else {
                $response['inactive'] += 1;
            }
        }
        return ['machine_users' => $response];
    }
}
