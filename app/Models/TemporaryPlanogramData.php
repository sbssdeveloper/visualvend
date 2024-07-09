<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemporaryPlanogramData extends Model
{
    protected $table = 'temporary_planogram_data';
    protected $fillable = ['*'];
    public $timestamps = false;
}
