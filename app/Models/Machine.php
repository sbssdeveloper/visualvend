<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Machine extends Model
{
    protected $table = 'machine';
    protected $fillable = ['*'];

    public static function personal($machines)
    {
        $array =  self::select("id")->whereRaw(\DB::raw("FIND_IN_SET(id,\"$machines\")", '!=', null))->where("is_deleted", 0)->get();
        $collection = collect($array);

        $parse = $collection->map(function ($item, $key) {
            return $item->id;
        });

        return $parse->all();
    }

    // public static function personal_info($machines, $client_id)
    // {
    //     $list =  self::select(['id, machine_name, machine_client_id'])->whereRaw(\DB::raw("FIND_IN_SET(id,\"$machines\")", '!=', null))->where("is_deleted", 0)->get();

    //     $collection = collect($list);

    //     $ids = $collection->map(function ($item, $key) {
    //         return $item->id;
    //     })->all();

    //     return compact('list', 'ids');
    // }
}
