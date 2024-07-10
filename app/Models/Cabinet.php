<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cabinet extends Model
{
    protected $table = 'cabinet';
    protected $fillable = ['*'];
    public $timestamps = false;
}
