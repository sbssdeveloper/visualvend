<?php

namespace App\Http\Controllers\Rest;

use Encrypt;
use App\Http\Controllers\Controller;
use App\Http\Helpers\RequestHelper;
use App\Models\Product;
use App\Rules\ProductClientRule;
use Illuminate\Http\Request;

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
            return $this->sendResponse("", "Product deleted successfully.");
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
            return $this->sendResponse("", "Products deleted successfully.");
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
        $required_if = $request->auth->client_id > 0 ? 1 : 0;
        $this->validate($request, ['file' => 'required|mimes:xlsx,xls|max:10240', "client_id" => "required_if:$required_if,1"]);
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
        $rules = [
            'product_name'              => 'required|string',
            'product_id'                => ['required', $rule],
            'product_price'             => 'required|numeric',
            'discount_price'            => 'required|numeric',
            'product_description'       => 'required|string|max:255',
            'product_image'             => 'required|file|max:2048|mimes:jpg,png,jpeg',
            'product_more_info_image'   => 'required|file|max:2048|mimes:jpg,png,jpeg',
        ];

        if ($request->auth->client_id <= 0) {
            $rules["client_id"]         = 'required|exists:client,id';
        }
        $this->validate($request, $rules);
        $array = $requestHelper->productRequest($request);

        $path                           = storage_path("uploads");

        if (!file_exists($path)) {
            mkdir($path, $mode = 0777, true);
        }
        $product_image              = Encrypt::uuid() . '.' . $request->product_image->extension();
        $request->product_image->move($path . "/images", $product_image);

        $product_more_info          = Encrypt::uuid() . '.' . $request->product_more_info_image->extension();
        $request->product_more_info_image->move($path . "/images", $product_more_info);

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
}
