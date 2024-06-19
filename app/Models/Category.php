<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'category';
    protected $fillable = ['*'];
    protected $hidden = ['id'];

    public function dropdownList($request,  $cid = null)
    {
        $model = self::select("category_id", "category_name")->whereNotNull("category_name");
        if ($request->auth->client_id > 0) {
            $model = $model->where("client_id", $request->auth->client_id);
        }else{
            $model = $model->where("client_id", $cid);
        }
        $model = $model->get();
        return $model;
    }

    public function list($request)
    {
        $model = self::select("category_id", "category_name")->whereNotNull("category_name");
        if ($request->auth->client_id > 0) {
            $model = $model->where("client_id", $request->auth->client_id);
        }
        $model = $model->paginate($request->length);
        return $model;
    }
}
