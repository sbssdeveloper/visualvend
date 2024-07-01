<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeGroupMachines extends Model
{
    protected $table = 'employee_group_machines';
    protected $fillable = ['*'];

    public function group()
    {
        return $this->belongsTo(EmployeeGroup::class, 'uuid', 'uuid');
    }
}
