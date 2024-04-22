<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Machine extends Model
{
    protected $table = 'machine';
    protected $fillable = ['*'];

    public static function personal($machines){
        return self::select("id")->whereRaw(\DB::raw("FIND_IN_SET(machine_id,$machines)", '!=', null))->get();
    }
}
