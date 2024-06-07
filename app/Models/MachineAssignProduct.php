<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MachineAssignProduct extends Model
{
    protected $table = 'machine_assign_product';
    protected $fillable = ['*'];
    public $timestamps = false;
}
