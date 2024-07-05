<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Planogram extends Model
{
    protected $table="planograms";
    protected $fillable = ['*'];
    protected $hidden = ['id'];
}
