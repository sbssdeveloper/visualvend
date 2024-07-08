<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Planogram extends Model
{
    protected $table = "planogram";
    protected $fillable = ['*'];

    public function machine()
    {
        return $this->belongsTo(Machine::class, "machine_id", "id");
    }

    public function planogram_data()
    {
        return $this->hasMany(PlanogramData::class, "plano_uuid", "uuid");
    }
}
