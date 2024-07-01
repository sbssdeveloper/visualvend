<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeGroup extends Model
{
    protected $table = 'employee_group';
    protected $fillable = ['*'];

    public function machines()
    {
        return $this->hasMany(EmployeeGroupMachines::class, 'uuid', "uuid");
    }
}
