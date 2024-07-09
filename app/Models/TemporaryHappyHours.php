<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemporaryHappyHours extends Model
{
    protected $table = 'temporary_happy_hours';
    protected $fillable = ['*'];
    public $timestamps = false;
}
