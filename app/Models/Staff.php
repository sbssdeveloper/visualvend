<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    protected $table = 'employee';
    protected $fillable = ['*'];
    protected $primaryKey = "id";
}
