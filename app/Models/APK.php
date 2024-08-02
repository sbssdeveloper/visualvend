<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class APK extends Model
{
    protected $table = 'machine_apk';
    protected $fillable = ['*'];
    protected $primaryKey = "id";

    public function list($request)
    {
        $model = self::select("id", "created_at", "updated_at", "name", "path", "version")
            ->whereNotNull("name")
            ->get();
        return $model;
    }
}
