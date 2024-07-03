<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GiftReport extends Model
{
    protected $table = 'gift_report';
    protected $fillable = ['*'];
    public  $timestamps = false;
}
