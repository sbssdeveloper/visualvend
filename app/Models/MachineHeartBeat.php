<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MachineHeartBeat extends Model
{
    protected $table = 'machine_heart_beat';
    protected $fillable = ['*'];

    public function machine()
    {
        return $this->belongsTo(Machine::class, "id", "machine_id");
    }
}
