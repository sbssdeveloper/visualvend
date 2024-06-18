<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Rules\ProductClientRule;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Encrypt;

class ProductController extends BaseController
{

    /**
     * @OA\Post(
     *     path="/api/product/list",
     *     summary="Products List",
     *     tags={"Quizee"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="search", type="string"),
     *             @OA\Property(property="length", type="integer", example=50),
     *             @OA\Property(property="page", type="integer", example=1)
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

    public function list(Request $request)
    {
        $client_id  = $request->auth->client_id;
        $products   = Product::withCategories()->where("is_deleted", 0);

        if ($client_id != 1) {
            $products->where("product.client_id", $client_id);
        }

        if (!empty($request->search)) {
            $products->where(function ($query) use ($request) {
                $query->where("product.product_id", "LIKE", $request->search . "%")->orWhere("product_name", "LIKE", $request->search . "%");
            });
        }
        return $this->sendResponse($products->paginate($request->length ?? 10), 'Products retrieved successfully');
    }

    /**
     * @OA\Post(
     *     path="/api/product/create",
     *     summary="Products Create",
     *     tags={"Quizee"},
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

    public function create(Request $request, ProductClientRule $rule)
    {
        set_time_limit(60);
        $client_id                      = $request->auth->client_id;
        $rules = [
            'product_name'              => 'required|string',
            'product_id'                => ['required', $rule],
            'product_price'             => 'required|numeric',
            'discount_price'            => 'required|numeric',
            'product_description'       => 'required|string|max:255',
            'product_image'             => 'required|file|max:2048|mimes:jpg,png,jpeg',
            'product_more_info_image'   => 'required|file|max:2048|mimes:jpg,png,jpeg'
        ];
        if ($request->auth->client_id <= 0) {
            $rules["client_id"]   = 'required|exists:client,id';
        }
        $this->validate($request, $rules);
        $array                              = $request->all();
        $path = storage_path("uploads");

        if (!file_exists($path)) {
            mkdir($path, $mode = 0777, true);
        }
        $product_image      = Encrypt::uuid() . '.' . $request->product_image->extension();
        $request->product_image->move($path . "/images", $product_image);

        $product_more_info  = Encrypt::uuid() . '.' . $request->product_more_info_image->extension();
        $request->product_more_info_image->move($path . "/images", $product_more_info);

        $array['uuid']                      = (string) Str::uuid();
        $array['product_image']             = "uploads/images/" . $product_image;
        $array['product_more_info_image']   = "uploads/images/" . $product_more_info;

        try {
            Product::insert($array);
            return $this->sendResponse([], 'Product created successfully');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
            //throw $th;
        }
    }

    /**
     * @OA\Post(
     *     path="/api/product/update",
     *     summary="Products Update",
     *     tags={"Quizee"},
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

    public function update(Request $request)
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
        try {
            Product::insert($array);
            return $this->sendResponse([], 'Product updated successfully');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
            //throw $th;
        }
    }

    /**
     * @OA\Post(
     *     path="/api/product/delete",
     *     summary="Product Delete",
     *     tags={"Quizee"},
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

    public function delete(Request $request, Product $model)
    {
        $this->validate($request, ["uuid" => "required|exists:product,uuid"]);
        try {
            $model->deleteSingle($request);
            return $this->sendResponse("", "Product deleted successfully.");
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
}
