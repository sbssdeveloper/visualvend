<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeTransaction extends Model
{
    protected $table = "employee_transaction";
    protected $fillable = ['*'];
    public $timestamps = false;
    public $hidden = ["product_sku"];
    public function client()
    {
        return $this->hasOne(Client::class, "id", "client_id");
    }
}
