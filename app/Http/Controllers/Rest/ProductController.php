<?php

namespace App\Http\Controllers\Rest;

use App\Http\Controllers\Controller;
use App\Models\Product;
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
        $required_if = $request->auth->client_id > 0?1:0;
        $this->validate($request, ['file' => 'required|mimes:xlsx,xls|max:10240', "client_id" => "required_if:$required_if,1"]);
        return $product->upload($request, $controller);
    }
}
