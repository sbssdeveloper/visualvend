<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportEmail extends Model
{
    protected $table = 'report_email';
    protected $fillable = ['*'];
    public $timestamps = false;
}
