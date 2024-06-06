<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MachineUser extends Model
{
    protected $table = 'user';
    protected $fillable = ['*'];

    public static function dashboardInfo($auth, $machines)
    {
        $model = self::select('user.status', 'user.activated_on')->where("is_deactivated", 0);
        if ($auth->client_id > 0) {
            $model  = $model->leftJoin("machine", "machine.machine_username", "=", "user.username")->where_in("machine.id", $machines);
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
