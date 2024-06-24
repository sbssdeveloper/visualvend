<?php

namespace App\Http\Controllers\Rest;

use Encrypt;
use DB;
use App\Http\Controllers\Controller;
use App\Http\Helpers\RequestHelper;
use App\Models\Product;
use App\Models\ProductAssignCategory;
use App\Models\ProductImage;
use App\Rules\ProductClientRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends LinkedMachineController
{
    /**
     * @OA\Post(
     *     path="/v1/product/assigned",
     *     summary="Product Assigned List",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="search", type="date", example="PEPSI"),
     *             @OA\Property(property="length", type="integer", example=100),
     *             @OA\Property(property="page", type="integer", example="1"),
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function assignedList(Request $request, Product $product)
    {
        $this->validate($request, ['sort' => 'required']);
        return $this->sendResponseWithPagination($product->assignedList($request), "Success");
    }

    /**
     * @OA\Post(
     *     path="/v1/product/unassigned",
     *     summary="Product Un-Assigned List",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="search", type="date", example="PEPSI"),
     *             @OA\Property(property="length", type="integer", example=100),
     *             @OA\Property(property="page", type="integer", example="1"),
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function unAssignedList(Request $request, Product $product)
    {
        $this->validate($request, ['sort' => 'required']);
        return $this->sendResponseWithPagination($product->unAssignedList($request), "Success");
    }

    /**
     * @OA\Post(
     *     path="/v1/product/archive",
     *     summary="Product Archived List",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="search", type="date", example="PEPSI"),
     *             @OA\Property(property="length", type="integer", example=100),
     *             @OA\Property(property="page", type="integer", example="1"),
     *             @OA\Property(property="sort", type="STRING", example="product"),
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function archivedList(Request $request, Product $product)
    {
        $this->validate($request, ['sort' => 'required']);
        return $this->sendResponseWithPagination($product->archive($request), "Success");
    }

    /**
     * @OA\Post(
     *     path="/v1/product/delete",
     *     summary="Product Delete",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="uuid", type="string", example="xxxxx-xxxx-xxxx-xxxxxx-xxxxxx")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function delete(Request $request, Product $product)
    {
        $this->validate($request, ["uuid" => "required|exists:product,uuid"]);
        try {
            $product->deleteSingle($request);
            return $this->sendSuccess("Product deleted successfully.");
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/product/delete/bulk",
     *     summary="Products Delete in Bulk",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="uuids", type="object", example="xxxxx-xxxx-xxxx-xxxxxx-xxxxxx")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function bulkDelete(Request $request, Product $product)
    {
        $this->validate($request, ["uuids" => "required|array"]);
        try {
            $product->deleteMultiple($request);
            return $this->sendSuccess("Products deleted successfully.");
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/product/upload",
     *     summary="Products Upload",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                type="object",
     *                @OA\Property(
     *                  property="file",
     *                  description="Product file",
     *                  type="file",
     *                  format="binary"
     *                )
     *             )
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function upload(Request $request, Product $product, BaseController $controller)
    {
        $rule = ['file' => 'required|mimes:xlsx,xls|max:10240'];
        if ($request->auth->client_id <= 0) {
            $rule["client_id"] =  "required|integer|min:1";
        }
        $this->validate($request, $rule);
        return $product->upload($request, $controller);
    }

    /**
     * @OA\Post(
     *     path="/v1/product/bulk/update",
     *     summary="Products Bulk Update",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                type="object",
     *                @OA\Property(
     *                  property="file",
     *                  description="Product file",
     *                  type="file",
     *                  format="binary"
     *                )
     *             )
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function bulkUpdate(Request $request, Product $product, BaseController $controller)
    {
        $required_if = $request->auth->client_id > 0 ? 1 : 0;
        $this->validate($request, ['file' => 'required|mimes:xlsx,xls|max:10240', "client_id" => "required_if:$required_if,1"]);
        return $product->bulkUpdate($request, $controller);
    }


    /**
     * @OA\Post(
     *     path="/v1/product/create",
     *     summary="Products Create",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                type="object",
     *                @OA\Property(property="product_name", type="string"),
     *             @OA\Property(property="product_id", type="string"),
     *             @OA\Property(property="product_price", type="float"),
     *             @OA\Property(property="discount_price", type="float"),
     *             @OA\Property(property="product_description", type="string"),
     *                @OA\Property(
     *                  property="product_image",
     *                  description="Product Image",
     *                  type="string",
     *                  format="binary"
     *                ),
     *                @OA\Property(
     *                  property="product_more_info_image",
     *                  description="Product More Image",
     *                  type="string",
     *                  format="binary"
     *                )
     *             )
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function create(Request $request, ProductClientRule $rule, RequestHelper $requestHelper)
    {
        $client_id                      = $request->auth->client_id;
        if ($requestHelper->isBase64($request->product_image)) {
            $request->product_image = $requestHelper->base64Decode($request->product_image);
        }
        print_r($request->product_image);
        die;
        if ($requestHelper->isBase64($request->product_more_info_image)) {
            $request->product_more_info_image = $requestHelper->base64Decode($request->product_more_info_image);
        }

        if ($requestHelper->isBase64($request->product_promo_image)) {
            $request->product_promo_image = $requestHelper->base64Decode($request->product_promo_image);
        }

        if ($requestHelper->isBase64($request->product_more_image_1)) {
            $request->product_more_image_1 = $requestHelper->base64Decode($request->product_more_image_1);
        }

        if ($requestHelper->isBase64($request->product_more_image_2)) {
            $request->product_more_image_2 = $requestHelper->base64Decode($request->product_more_image_2);
        }

        if ($requestHelper->isBase64($request->product_more_image_3)) {
            $request->product_more_image_3 = $requestHelper->base64Decode($request->product_more_image_3);
        }
        if ($requestHelper->isBase64($request->product_more_image_4)) {
            $request->product_more_image_4 = $requestHelper->base64Decode($request->product_more_image_4);
        }

        $rules = [
            'product_name'              => 'required|string',
            'product_id'                => ['required', $rule],
            'product_price'             => 'required|numeric',
            'discount_price'            => 'required|numeric',
            'product_description'       => 'required|string|max:255',
            'product_image'             => 'required|image|max:2048|mimes:jpg,png,jpeg',
            'product_more_info_image'   => 'required|image|max:2048|mimes:jpg,png,jpeg',
        ];

        if ($request->auth->client_id <= 0) {
            $rules["client_id"]         = 'required|exists:client,id';
        }
        $this->validate($request, $rules);
        extract($requestHelper->productRequest($request));

        DB::beginTransaction();
        try {
            Product::insert($product);
            ProductImage::insert($product_images);
            ProductAssignCategory::insert($product_assign_category);
            DB::commit();
            return $this->sendSuccess("Product created successfully.");
        } catch (\Exception $e) {
            DB::rollback();
            return $this->sendError($e->getMessage());
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/product/update",
     *     summary="Products Update",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *          @OA\JsonContent(
     *             @OA\Property(property="uuid", type="string"),
     *             @OA\Property(property="product_name", type="string"),
     *             @OA\Property(property="product_price", type="float"),
     *             @OA\Property(property="discount_price", type="float"),
     *             @OA\Property(property="product_description", type="string")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function update(Request $request, RequestHelper $requestHelper)
    {
        $client_id                      = $request->auth->client_id;
        $rules = [
            'uuid'                      => 'required|exists:product,uuid',
            'product_name'              => 'required|string',
            'product_price'             => 'required|numeric',
            'discount_price'            => 'required|numeric',
            'product_description'       => 'required|string|max:255'
        ];
        if ($request->auth->client_id <= 0) {
            $rules["client_id"]   = 'required|exists:client,id';
        }
        $this->validate($request, $rules);
        extract($requestHelper->productUpdateRequest($request));
        try {
            Product::where("uuid", $request->uuid)->update($product);
            ProductAssignCategory::where("uuid", $request->uuid)->delete();
            ProductAssignCategory::insert($product_assign_category);
            return $this->sendSuccess('Product updated successfully');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
            //throw $th;
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/product/info",
     *     summary="Products Info",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *          @OA\JsonContent(
     *             @OA\Property(property="uuid", type="string")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function info(Request $request)
    {
        $client_id                      = $request->auth->client_id;
        $rules = [
            'uuid'                      => 'required|exists:product,uuid'
        ];
        $this->validate($request, $rules);

        return $this->sendResponse('Success', Product::with("images", "assigned_categories")->where("uuid", $request->uuid)->first());
    }

    /**
     * @OA\Post(
     *     path="/v1/product/upload/image",
     *     summary="Products Image update",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                type="object",
     *                  required={"image", "uuid", "type"},
     *                 @OA\Property(property="image", type="string", format="binary"),
     *                 @OA\Property(property="uuid", type="string"),
     *                 @OA\Property(property="type", type="string"),
     *                 @OA\Property(property="image_id", type="string"),
     *             )
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function uploadImage(Request $request, RequestHelper $helper)
    {
        $client_id                      = $request->auth->client_id;

        $rules = [
            'uuid'                      => 'required|exists:product,uuid',
            'type'                      => 'required|in:product_image,product_more_info_image,product_promo_image,more_product_images',
            'image_id'                  => 'required_if:type,more_product_images',
            'image'                     => 'required|image|max:2048|mimes:jpg,png,jpeg'
        ];
        $path                           = storage_path("uploads");
        $this->validate($request, $rules);

        if ($request->type != "more_product_images") {
            $model = Product::where("uuid", $request->uuid)->first();
            $type = $request->type;
            if (file_exists($model->$type)) {
                unlink($model->$type);
            }
            $image              = Encrypt::uuid() . '.' . $helper->file_extension($request->image);
            $request->image->move($path . "/images", $image);
            $model->$type  = "uploads/images/" . $image;
            $model->save();
            return $this->sendResponse('Image updated successfully', ["path" => $model->$type]);
        } else {
            $imgPath = null;
            if ($request->image_id > 0) {
                $model = ProductImage::where("id", $request->image_id)->first();
                if (file_exists($model->image)) {
                    unlink($model->image);
                }
                $image              = Encrypt::uuid() . '.' . $request->image->extension();
                $request->image->move($path . "/images", $image);
                $model->image  = "uploads/images/" . $image;
                $model->save();
                $imgPath = $model->image;
            } else {
                $image              = Encrypt::uuid() . '.' . $request->image->extension();
                $request->image->move($path . "/images", $image);
                $imgPath = "uploads/images/" . $image;
                ProductImage::insert([
                    "uuid" => $request->uuid,
                    "image" => $imgPath
                ]);
            }
            return $this->sendResponse('Image updated successfully', ["path" => $imgPath]);
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/product/list",
     *     summary="Active Products List",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="search", type="date", example="PEPSI"),
     *             @OA\Property(property="length", type="integer", example=100),
     *             @OA\Property(property="page", type="integer", example="1"),
     *             @OA\Property(property="sort", type="STRING", example="product"),
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function allActiveProducts(Request $request, Product $product)
    {
        $this->validate($request, ['sort' => 'required']);
        return $this->sendResponseWithPagination($product->allActiveProducts($request), "Success");
    }
}
