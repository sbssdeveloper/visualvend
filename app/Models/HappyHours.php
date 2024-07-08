<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HappyHours extends Model
{
    protected $table = "happy_hours";
    protected $fillable = ['*'];

    public function machine()
    {
        return $this->belongsTo(Machine::class, "machine_id", "id");
    }

    public function happy_hours_data()
    {
        return $this->hasMany(HappyHoursData::class, "plano_uuid", "uuid");
    }
}
