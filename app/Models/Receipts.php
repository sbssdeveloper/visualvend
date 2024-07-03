<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipts extends Model
{
    protected $table = 'receipts';
    protected $fillable = ['*'];
    public $timestamps = false;
}
