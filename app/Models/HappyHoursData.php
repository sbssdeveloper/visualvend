<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HappyHoursData extends Model
{
    protected $table = "happy_hours_data";
    protected $fillable = ['*'];
    protected $hidden = ['id'];

    public function happy_hours()
    {
        return $this->belongsTo(HappyHours::class, "uuid", "plano_uuid");
    }
}
