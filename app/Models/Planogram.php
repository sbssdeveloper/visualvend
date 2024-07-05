<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Planogram extends Model
{
    protected $table = "planogram";
    protected $fillable = ['*'];
    protected $hidden = ['id'];

    public function machine()
    {
        return $this->belongsTo(Machine::class, "id", "machine_id");
    }
}
