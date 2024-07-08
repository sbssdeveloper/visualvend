<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanogramData extends Model
{
    protected $table = "planogram_data";
    protected $fillable = ['*'];
    protected $hidden = ['id'];

    public function planogram()
    {
        return $this->belongsTo(Planogram::class, "uuid", "plano_uuid");
    }
}
