<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table    = 'admin';
    protected $fillable = ['*'];

    public static function linkedMachines($auth)
    {
        if ($auth->client_id == -1) {
            return "all";
        }
        $machines = self::where("id", $auth->id)->select(["machines"])->first();
        if ($machines) {
            $machines = explode(",", $machines->machines);
        }else{
            $machines = [];
        }
        return $machines;
    }
}
