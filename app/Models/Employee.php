<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $table = 'employee';
    protected $fillable = ['*'];

    public static function dashboardInfo($auth)
    {
        $model = self::select("id")->where("is_deleted", 0);
        if ($auth->client_id > 0) {
            $model = $model->where('client_id', $auth->client_id);
        }
        $model = $model->count();
        $response["total"]      = $model;
        $response["active"]     = 0;
        $response["inactive"]   = 0;
        $response["offline"]    = $model;
        return ['staff' => $response];
    }
}
