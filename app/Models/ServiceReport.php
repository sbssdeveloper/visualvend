<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceReport extends Model
{
    protected $table = 'service_reports';
    protected $fillable = ['*'];
    public  $timestamps = false;
}
