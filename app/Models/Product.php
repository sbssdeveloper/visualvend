<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Encrypt;
use XlsxReader;

class Product extends Model
{
    use SoftDeletes;

    protected $table = 'product';
    protected $fillable = ['*'];
    protected $hidden = ['id'];
    protected $format = ["product code", "product name", "product price", "product description"];

    public function images()
    {
        return $this->hasMany(ProductImage::class, "uuid", "uuid");
    }

    public function scopeWithCategories()
    {
        return $this->leftJoin("product_assign_category", function ($join) {
            $join->on('product_assign_category.product_id', '=', 'product.product_id');
            $join->on('product_assign_category.client_id', '=', 'product.client_id');
        })->select('product.*', 'product_assign_category.category_id');
    }

    public function assigned($auth, $select = ["product.*"], $type = "count")
    {
        $model = self::select($select)->leftJoin("machine_product_map", function ($leftJoin) {
            $leftJoin->on("machine_product_map.client_id", "=", "product.client_id")
                ->on("machine_product_map.product_id", "=", "product.product_id");
        })->where("is_deleted", 0);
        if ($auth->client_id > 0) {
            $model = $model->where("product.client_id", $auth->client_id)->whereRaw(\DB::raw("FIND_IN_SET(machine_id,\"$auth->machines\")", '!=', null));
        }
        $model = $model->groupBy('product.id');
        if ($type === "count") {
            $model = $model->count();
        } else {
            $model = $model->get();
        }
        return $model;
    }

    public function total($auth, $select = ["product.*"], $type = "count")
    {
        $model = self::select($select)->where("is_deleted", 0);
        if ($auth->client_id > 0) {
            $model = $model->where("product.client_id", $auth->client_id);
        }
        if ($type === "count") {
            $model = $model->count();
        } else {
            $model = $model->get();
        }
        return $model;
    }

    public static function totalProducts($client_id)
    {
        $count = self::where('is_deleted', 0);
        if ($client_id > 0) {
            $count = $count->where('client_id', $client_id);
        }
        $count = $count->count();
        return $count;
    }

    public static function dashboardInfo($auth)
    {
        $model = self::leftJoin('machine_product_map', "machine_product_map.product_id", "=", "product.product_id")->where('product.is_deleted', 0);
        if ($auth->client_id > 0) {
            $model = $model->where('product.client_id', $auth->client_id);
        }
        $model = $model->groupBy("product.product_id")->get()->count();
        $response["assigned"]   = $model;
        $response["total"]      = self::totalProducts($auth->client_id);
        $response["unassigned"] = $response["total"] - $response["assigned"];
        return ['products' => $response];
    }

    public function assignedList($request)
    {
        $model = self::select("product.*", "product.uuid")->leftJoin("machine_product_map", function ($join) {
            $join->on('machine_product_map.product_id', '=', 'product.product_id');
            $join->on('machine_product_map.client_id', '=', 'product.client_id');
        })->where("machine_product_map.id", ">", 0)->where("is_deleted", 0);

        if ($request->auth->client_id > 0) {
            $model = $model->where("client_id", $request->auth->client_id);
        }

        if (!empty($request->search)) {
            $search = $request->search;
            $model = $model->where(function ($query) use ($search) {
                $query->where("product.product_name", "like", $search . "%")->orWhere("product.product_id", "like", $search . "%");
            });
        }

        $model = $model->with(['images' => function ($query) {
            $query->select('image', 'uuid');
        }])->paginate($request->length ?? 100);
        return $model;
    }

    public function unAssignedList($request)
    {
        $model = self::select("product.*", "product.uuid")->leftJoin("machine_product_map", function ($join) {
            $join->on('machine_product_map.product_id', '=', 'product.product_id');
            $join->on('machine_product_map.client_id', '=', 'product.client_id');
        })->whereNull("machine_product_map.id")->where("is_deleted", 0);

        if ($request->auth->client_id > 0) {
            $model = $model->where("client_id", $request->auth->client_id);
        }

        if (!empty($request->search)) {
            $search = $request->search;
            $model = $model->where(function ($query) use ($search) {
                $query->where("product.product_name", "like", $search . "%")->orWhere("product.product_id", "like", $search . "%");
            });
        }

        $model = $model->with(['images' => function ($query) {
            $query->select('image', 'uuid');
        }])->paginate($request->length ?? 100);
        return $model;
    }

    public function archive($request)
    {
        $model = self::select("product_image", "product_name", "product_id", "product_price")->with(['images' => function ($query) {
            $query->select('image', 'uuid');
        }])->onlyTrashed();

        if ($request->auth->client_id > 0) {
            $model = $model->where("client_id", $request->auth->client_id);
        }

        if (!empty($request->search)) {
            $search = $request->search;
            $model = $model->where(function ($query) use ($search) {
                $query->where("product_name", "like", $search . "%")->orWhere("product_id", "like", $search . "%");
            });
        }

        if ($request->sort == "name") {
            $model = $model->orderBy("product_name", "ASC");
        } else {
            $model = $model->orderBy("deleted_at", "DESC");
        }
        return ($model = $model->paginate($request->length ?? 100));
    }

    public function deleteSingle($request)
    {
        $model = Product::where('uuid', $request->uuid);
        $model->update([
            "is_deleted" => 1,
            "delete_user_id" => $request->auth->client_id
        ]);
        return $model->delete();
    }

    public function deleteMultiple($request)
    {
        $model = Product::whereIn("uuid", $request->uuids);
        $model->update([
            "is_deleted" => 1,
            "delete_user_id" => $request->auth->client_id
        ]);
        return $model->delete();
    }

    public function upload($request, $controller)
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
                strtolower($sheets[0][0]) != 'product code' ||
                strtolower($sheets[0][1]) != 'product name' ||
                strtolower($sheets[0][2]) != 'product price' ||
                strtolower($sheets[0][3]) != 'product description'
            ) {
                return $controller->sendError("Wrong format.");
            } else {
                $errors = 0;
                $error_text = 0;
                $array = [];
                array_shift($sheets);
                if (count($sheets) > 0) {
                    foreach ($sheets as $key => $value) {
                        if (empty($value[0])) {
                            $error_text .= 'Row : ' . ($key + 1) . 'Product Code can\'\t be empty';
                            $errors++;
                        } else if (empty($value[1])) {
                            $error_text .= 'Row : ' . ($key + 1) . 'Product Name can\'\t be empty';
                            $errors++;
                        }
                        $exists = self::where("client_id", $client_id)->where("product_id", $value[0])->exists();
                        if (!$exists) {
                            $array[] = [
                                'uuid'                              => Encrypt::uuid(),
                                'product_id'                        => $value[0],
                                'product_name'                      => $value[1],
                                'product_price'                     => $value[2] ?? "0.00",
                                'product_description'               => $value[3],
                                'more_info_text'                    => $value[4],
                                'product_image'                     => $value[5] ?? "default_product.png",
                                'product_image_thumbnail'           => $value[6] ?? "default_product.png",
                                'product_more_info_image'           => $value[7] ?? "default_product.png",
                                'product_more_info_image_thumbnail' => $value[8] ?? "default_product.png",
                                'product_sku'                       => $value[9] ?? "",
                            ];
                        } else {
                            $error_text .= 'Row : ' . ($key + 1) . ' Product ID : ' . $value[0] . ' already exists;';
                            $errors++;
                        }
                    }
                    if (count($array) > 0) {
                        self::insert($array);
                        return $controller->sendResponse("Product uploaded successfully.", ["errors" => $errors, "error_text" => $error_text]);
                    } else {
                        return $controller->sendError("No data available.", ["errors" => $errors, "error_text" => $error_text]);
                    }
                } else {
                    return $controller->sendError("No data available.");
                }
            }
        } catch (\Throwable $th) {
            return $controller->sendError($th->getMessage());
        }
    }

    public function bulkUpdate($request, $controller)
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
                strtolower($sheets[0][0]) != 'product code' ||
                strtolower($sheets[0][1]) != 'product name' ||
                strtolower($sheets[0][2]) != 'product price' ||
                strtolower($sheets[0][3]) != 'product description'
            ) {
                return $controller->sendError("Wrong format.");
            } else {
                $errors = 0;
                $error_text = 0;
                $array = [];
                array_shift($sheets);
                if (count($sheets) > 0) {
                    foreach ($sheets as $key => $value) {
                        if (empty($value[0])) {
                            $error_text .= 'Row : ' . ($key + 1) . 'Product Code can\'\t be empty';
                            $errors++;
                        } else if (empty($value[1])) {
                            $error_text .= 'Row : ' . ($key + 1) . 'Product Name can\'\t be empty';
                            $errors++;
                        }
                        $exists = self::where("client_id", $client_id)->where("product_id", $value[0])->first();
                        if ($exists) {
                            $array[] = [
                                'product_name'                      => $value[1],
                                'product_price'                     => $value[2] ?? "0.00",
                                'product_description'               => $value[3],
                                'more_info_text'                    => $value[4],
                                'product_image'                     => $value[5] ?? "default_product.png",
                                'product_image_thumbnail'           => $value[6] ?? "default_product.png",
                                'product_more_info_image'           => $value[7] ?? "default_product.png",
                                'product_more_info_image_thumbnail' => $value[8] ?? "default_product.png",
                                'product_sku'                       => $value[9] ?? "",
                                'is_deleted'                        => 0,
                                'delete_user_id'                    => null,
                                'deleted_at'                        => null,
                            ];
                            self::where("client_id", $client_id)->where("product_id", $value[0])->update($array);
                        } else {
                            $error_text .= 'Row : ' . ($key + 1) . ' Product ID : ' . $value[0] . ' already exists;';
                            $errors++;
                        }
                    }
                    if (count($array) > 0) {
                        return $controller->sendResponse("Product updated successfully.", ["errors" => $errors, "error_text" => $error_text]);
                    } else {
                        return $controller->sendError("No data available.", ["errors" => $errors, "error_text" => $error_text]);
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
