<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAssignCategory extends Model
{
    protected $table = 'product_assign_category';
    protected $fillable = ['*'];

    // public function product(){
    //     return $this->belongsToMany(Product,"product_id","product_id");
    // }
}
