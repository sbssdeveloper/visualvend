<?php

namespace App\Models;

use Encrypt;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'category';
    protected $fillable = ['*'];
    protected $hidden = ['id'];
    public $timestamps = false;

    public function dropdownList($request, $cid)
    {
        $model = self::select("category_id", "category_name")->whereNotNull("category_name");
        if ($request->auth->client_id > 0) {
            $model = $model->where("client_id", $request->auth->client_id);
        } else if ($request->has("cid") || $cid > 0) {
            $cid    = $request->has("cid") ? $request->cid : $cid;
            $model = $model->where("client_id", $cid);
        }
        $model = $model->get();
        return $model;
    }

    public function list($request)
    {
        $model = self::select("category_id", "category_name", "category_image", "client_id")->whereNotNull("category_name");
        if ($request->auth->client_id > 0) {
            $model = $model->where("client_id", $request->auth->client_id);
        }
        if ($request->has("search") && !empty($request->search)) {
            $model = $model->where(function ($query) use ($request) {
                $query->where("category_name", "LIKE", "{$request->search}%");
                $query->orWhere("category_id", "LIKE", "{$request->search}%");
            });
        }
        if ($request->has("sort") && !empty($request->sort)) {
            if ($request->sort == "recent") {
                $model = $model->orderBy("id", "desc");
            } else {
                $model = $model->orderBy("category_name", "ASC");
            }
        }
        $model = $model->paginate($request->length);
        return $model;
    }

    public function create($request)
    {
        $path = storage_path("uploads");

        if (!file_exists($path)) {
            mkdir($path, $mode = 0777, true);
        }

        $category_image  = Encrypt::uuid() . '.' . $request->image->extension();
        $request->image->move($path . "/category", $category_image);
        return self::insert([
            "category_id" => $request->category_id,
            "category_name" => $request->category_name,
            "client_id" => $request->client_id ?? $request->auth->client_id,
            "category_image" => "uploads/category/" . $category_image,
            "category_image_thumbnail" => "uploads/category/" . $category_image
        ]);
    }

    public function updateCategory($request)
    {
        return self::where("id", $request->id)->where("client_id", $request->client_id ?? $request->auth->client_id)->update([
            "category_name" => $request->category_name
        ]);
    }

    public function upload($request)
    {
        $path = storage_path("uploads");

        if (!file_exists($path)) {
            mkdir($path, $mode = 0777, true);
        }
        $model = self::find($request->id)->first();
        if ($model->category_image && file_exists($model->category_image)) {
            unlink($model->category_image);
        }

        $category_image  = Encrypt::uuid() . '.' . $request->image->extension();
        $request->image->move($path . "/category", $category_image);
        return self::where("id", $request->id)->update([
            "category_image" => "uploads/category/" . $category_image,
            "category_image_thumbnail" => "uploads/category/" . $category_image
        ]);
    }
}
