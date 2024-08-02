<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Apk extends Model
{
    protected $table = 'machine_apk';
    protected $fillable = ['*'];
    protected $primaryKey = "id";
}
