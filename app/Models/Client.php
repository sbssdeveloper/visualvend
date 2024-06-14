<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = 'client';
    protected $fillable = ['*'];

    public function dropdownList()
    {
        return self::select("id", "client_name")->where("status", "A")->get();
    }
}
