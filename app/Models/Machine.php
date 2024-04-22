<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Machine extends Model
{
    protected $table = 'machine';
    protected $fillable = ['*'];

    public static function personal($machines){
        $array =  self::select("id")->whereRaw(\DB::raw("FIND_IN_SET(id,"$machines")", '!=', null))->where("is_deleted",0)->get();
        return collect($array);
    }
}
