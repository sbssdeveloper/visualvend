<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Encrypt;

class Customer extends Model
{
    protected $table = 'customers';
    protected $fillable = ['*'];
    public $timestamps = false;

    protected static function boot()
    {
        parent::boot();

        // Before creating a new model, generate a UUID
        static::creating(function ($model) {
            // Check if uuid is not already set (to avoid overriding in cases like seeding)
            if (empty($model->uuid)) {
                $model->uuid = (string) Encrypt::uuid(); // Or use: Str::orderedUuid() for a time-ordered UUID
            }
            if (!empty($model->password)) {
                $model->password = $this->encryptPassword($model->password);
            }
        });

        static::updating(function ($model) {
            if (!empty($model->password)) {
                $model->password = $this->encryptPassword($model->password);
            }
        });
    }

    public function encryptPassword($password)
    {
        return Hash::make($password);
    }

    public function verifyPassword($password, $hashedPassword)
    {
        return Hash::check($password, $hashedPassword) ? true : false;
    }
}
