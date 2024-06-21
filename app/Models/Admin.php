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
        print_r(self::find($auth->id)->select("machines")->first()->toArray());
        return self::find($auth->id)->select(["machines"])->first();
    }
}
