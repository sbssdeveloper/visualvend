<?php

namespace App\Models;

use Encrypt;
use XlsxReader;
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
        $model = self::where("category_id", $request->category_id)->where("client_id", $request->client_id ?? $request->auth->client_id)->first();
        if ($model) {
            $model->category_name = $request->category_name;
            $model->save();
            return true;
        }
        return false;
    }

    public function upload($request)
    {
        $path = storage_path("uploads");

        if (!file_exists($path)) {
            mkdir($path, $mode = 0777, true);
        }
        $model = self::where("category_id", $request->category_id)->where("client_id", $request->client_id ?? $request->auth->client_id)->first();
        if (!$model) {
            return false;
        }
        if ($model->category_image && file_exists($model->category_image)) {
            unlink($model->category_image);
        }

        $category_image  = Encrypt::uuid() . '.' . $request->image->extension();
        $request->image->move($path . "/category", $category_image);
        $model->category_image = "uploads/category/" . $category_image;
        $model->category_image_thumbnail = "uploads/category/" . $category_image;
        $model->save();
        return true;
    }

    public function uploadList($request, $controller)
    {
        $client_id = $request->client_id ?? $request->auth->client_id;
        $path = storage_path("uploads");

        if (!file_exists($path)) {
            mkdir($path, $mode = 0777, true);
        }
        try {
            $file = Encrypt::uuid() . '.xlsx';
            $request->file->move($path, $file);
            $reader = new XlsxReader();
            $spreadsheet = $reader->load($path . "/" . $file);
            $sheets  = $spreadsheet->getActiveSheet(0)->toArray();
            if (file_exists($path . "/" . $file)) {
                unlink($path . "/" . $file);
            }
            if (
                strtolower($sheets[0][0]) != 'category id' || strtolower($sheets[0][1]) != 'category name'
            ) {
                return $controller->sendError("Wrong format.");
            } else {
                $errors = $uploaded = 0;
                $error_text = "";
                $array = [];
                array_shift($sheets);
                if (count($sheets) > 0) {
                    foreach ($sheets as $key => $value) {
                        if (empty($value[0])) {
                            $error_text .= 'Row : ' . ($key + 1) . 'Category ID can\'\t be empty';
                            $errors++;
                        } else if (empty($value[1])) {
                            $error_text .= 'Row : ' . ($key + 1) . 'Category Name can\'\t be empty';
                            $errors++;
                        }
                        $exists = self::where("client_id", $client_id)->where("category_id", $value[0])->exists();
                        if (!$exists) {
                            $array[] = [
                                'category_id'              => $value[0],
                                'category_name'            => $value[1],
                                'client_id'                => $client_id,
                                'category_image'           => "uploads/category/default_category.png",
                                'category_image_thumbnail' => "uploads/category/default_category.png",
                            ];
                            $uploaded++;
                        } else {
                            $error_text .= 'Row : ' . ($key + 1) . ' Category ID : ' . $value[0] . ' already exists;';
                            $errors++;
                        }
                    }
                    if (count($array) > 0) {
                        self::insert($array);
                        return $controller->sendResponse("Categories uploaded successfully.", ["errors" => $errors, "error_text" => $error_text]);
                    } else {
                        return $controller->sendResponse("No data available.", ["errors" => $errors, "error_text" => $error_text, "uploaded" => 0]);
                    }
                } else {
                    return $controller->sendError("No data available.");
                }
            }
        } catch (\Throwable $th) {
            return $controller->sendError($th->getMessage());
        }
    }
}
