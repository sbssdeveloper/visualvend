<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Encrypt;

class Customer extends Model
{
    protected $table = 'customers';
    // protected $fillable = ['*'];
    protected $guarded = ['id'];
    public $timestamps = false;

    protected static function boot()
    {
        parent::boot();        
        // Before creating a new model, generate a UUID
        static::creating(function ($model) {
            print_r($model);
            die;
            $model->uuid = (string) Encrypt::uuid();
            if (!empty($model->password)) {
                $model->password = self::encryptPassword($model->password);
            }
        });

        static::updating(function ($model) {
            if (!empty($model->password)) {
                $model->password = self::encryptPassword($model->password);
            }
        });
    }

    public static function encryptPassword($password)
    {
        return Hash::make($password);
    }

    public static function verifyPassword($password, $hashedPassword)
    {
        return Hash::check($password, $hashedPassword) ? true : false;
    }
}
