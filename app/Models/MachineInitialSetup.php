<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MachineInitialSetup extends Model
{
    protected $table = "machine_initial_setup";
    protected $fillable = ['*'];
    public  $timestamps = false;
}
