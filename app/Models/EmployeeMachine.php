<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeMachine extends Model
{
    protected $table = 'employee_machines';
    protected $fillable = ['*'];
    public  $timestamps = false;

    public function employees()
    {
        return $this->belongsTo(Employee::class, 'uuid', "uuid");
    }
}
