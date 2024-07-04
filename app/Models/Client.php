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

    public function portal_users()
    {
        return $this->hasMany(Admin::class, "client_id", "id");
    }

    public function machine_users()
    {
        return $this->hasMany(User::class, "client_id", "id");
    }
}
