<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeConfig extends Model
{
    protected $table = 'home_config';
    protected $fillable = ['*'];
    protected $hidden = ['id'];
}
