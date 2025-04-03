<?php

namespace App\Http\Controllers\Rest;

use Encrypt;
use DB;
use App\Http\Controllers\Controller;
use App\Http\Helpers\RequestHelper;
use App\Models\Product;
use App\Models\SurchargeFee;
use App\Models\ProductSurcharge;
use App\Models\ProductAssignCategory;
use App\Models\ProductImage;
use App\Models\Admin;
use App\Models\Category;
use App\Models\MachineProductMap;
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

    public function create(Request $request, ProductClientRule $rule, RequestHelper $requestHelper)
    {
        $rules = [
            'product_name'              => 'required|string',
            'product_id'                => ['required', $rule],
            'product_price'             => 'required|numeric',
            'product_description'       => 'required|string|max:255',
            'product_image'             => 'required|string|max:45',
            'product_more_info_image'   => 'required|string|max:45'
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
            if (isset($product_surcharges) && count($product_surcharges) > 0) {
                ProductSurcharge::insert($product_surcharges);
            }

            if ($request->auth->client_id <= 0) {
                SurchargeFee::where("product_id", $request->product_id)->delete();
                if (isset($surcharge_fees) && count($surcharge_fees) > 0) {
                    SurchargeFee::insert($surcharge_fees);
                }
            }
            DB::commit();
            return $this->sendSuccess("Product created successfully.");
        } catch (\Exception $e) {
            DB::rollback();
            return $this->sendError($e->getMessage());
        }
    }

    public function update(Request $request, RequestHelper $requestHelper)
    {
        $client_id                      = $request->auth->client_id;

        $rules = [
            'uuid'                      => 'required|exists:product,uuid',
            'product_name'              => 'required|string',
            'product_price'             => 'required|numeric',
            'product_description'       => 'required|string|max:255'
        ];

        $this->validate($request, $rules);
        extract($requestHelper->productUpdateRequest($request));
        DB::beginTransaction();
        try {
            Product::where("uuid", $request->uuid)->update($product);
            ProductAssignCategory::where("uuid", $request->uuid)->delete();
            ProductSurcharge::where("product_id", $request->product_id)->delete();
            if (isset($product_assign_category) && count($product_assign_category) > 0) {
                ProductAssignCategory::insert($product_assign_category);
            }
            if (isset($product_surcharges) && count($product_surcharges) > 0) {
                ProductSurcharge::insert($product_surcharges);
            }

            if ($client_id <= 0) {
                SurchargeFee::where("product_id", $request->product_id)->delete();
                if (isset($surcharge_fees) && count($surcharge_fees) > 0) {
                    SurchargeFee::insert($surcharge_fees);
                }
            }

            ProductImage::where("uuid", $request->uuid)->delete();
            if (isset($product_images) && count($product_images) > 0) {
                ProductImage::insert($product_images);
            }
            DB::commit();
            return $this->sendSuccess('Product updated successfully');
        } catch (\Throwable $th) {
            DB::rollback();
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
        $product =  Product::with("images", "assigned_categories", "product_surcharges", "Surcharge_fees")->where("uuid", $request->uuid)->first();


        if (!$product->product_surcharges) {
            $product->setRelation('product_surcharges', (object) [
                'product_id' => $product->product_id,
                'client_id' => $client_id,
                'surcharge_value' => '',
                'surcharge_type' => ''
            ]);
        }
        
        // Append product_surcharges to the product object
        $product->product_surcharges = $product->product_surcharges;
     

        return $this->sendResponse('Success', $product);
    }

    /**
     * @OA\Post(
     *     path="/v1/product/upload/image",
     *     summary="Products Image update",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *          @OA\JsonContent(
     *             required={"image", "uuid", "type"},
     *             @OA\Property(property="image", type="string"),
     *             @OA\Property(property="uuid", type="string"),
     *             @OA\Property(property="type", type="string"),
     *             @OA\Property(property="image_id", type="string")
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
            'image'                     => 'required|string|max:2048'
        ];

        $this->validate($request, $rules);

        if ($request->type != "more_product_images") {
            $model          = Product::where("uuid", $request->uuid)->first();
            $type           = $request->type;
            $model->$type   = $request->image;
            $model->save();
            return $this->sendResponse('Image updated successfully', ["path" => $model->$type]);
        } else {
            if ($request->image_id > 0) {
                $model = ProductImage::where("id", $request->image_id)->first();
                $model->image  = $request->image;
                $model->save();
            } else {
                ProductImage::insert([
                    "uuid" => $request->uuid,
                    "image" => $request->image
                ]);
            }
            return $this->sendSuccess('Image updated successfully');
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
     *             @OA\Property(property="search", type="date", example=""),
     *             @OA\Property(property="length", type="integer", example=100),
     *             @OA\Property(property="page", type="integer", example="1"),
     *             @OA\Property(property="sort", type="string", example="product"),
     *             @OA\Property(property="category_id", type="string", example=""),
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

    /**
     * @OA\Get(
     *     path="/v1/product/list",
     *     summary="Products Dropdown list",
     *     tags={"V1"},
     * *    @OA\Parameter(
     *         name="client_id",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="number"),
     *         description="Client ID"
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

    public function productsListDropdown(Request $request, $client_id = null)
    {
        if ($request->auth->client_id <= 0) {
            if ($client_id) {
                $request->merge(['client_id' => $client_id]);
            }
            $this->validate($request, ['client_id' => 'required']);
        }
        $product = new Product();
        return $this->sendResponse('Image updated successfully', $product->productsListDropdown($request));
    }

    public function getAllProductDataEditClient(Request $request)
    {
        $adminId = $request->auth->id;
        $machineId = $request->machine_id;
        $admin = Admin::find($adminId);
        if (!$admin) {
            return response()->json(['code' => 404, 'msg' => "Admin not found"], 404);
        }

        $machineIdArray = explode(',', $admin->machines);

        $productArray = MachineProductMap::whereIn('machine_id', $machineIdArray)
            ->groupBy('product_id')
            ->pluck('product_id')
            ->toArray();

        $productIdArray = $productArray;

        $assignedProduct = [];
        $unAssignedProduct = [];

        $arrData = Product::where('client_id', $request->input('client_id'))
            ->where('is_deleted', '0')
            ->get();

        foreach ($arrData as $product) {
            $product->product_category_id = '';
            $product->product_category_name = '';

            $assignCategoryInfo = ProductAssignCategory::where('product_id', $product->product_id)->first();
            if ($assignCategoryInfo) {
                $product->product_category_id = $assignCategoryInfo->category_id;
                $categoryInfo = Category::find($assignCategoryInfo->category_id);
                if ($categoryInfo) {
                    $product->product_category_name = $categoryInfo->category_name;
                }
            }

            $product->client_code = '';
            $product->client_name = '';

            if (in_array($product->product_id, $productIdArray)) {
                $assignedProduct[] = $product;
            } else {
                $unAssignedProduct[] = $product;
            }
        }
        $aisles = MachineProductMap::select('product_location', 'id', 'product_id')
        ->where('product_id', '<>', '')
        ->where('machine_id', $machineId)
        ->orderByRaw('CAST(product_location AS UNSIGNED) ASC')
        ->get();

        $data = [];
        $products = [];

        foreach ($aisles as $value) {
            $data[$value->product_location] = $value->id;

            if (isset($products[$value->product_id])) {
                $products[$value->product_id][] = $value->product_location;
            } else {
                $products[$value->product_id] = [$value->product_location];
            }
        }


        if ($adminId == -1) {
            $response = ['code' => 200, 'products' => $arrData,'mapped_aisles'=>$products];
        } else {
            $response = ['code' => 200, 'products' => $assignedProduct, 'products_unassigned' => $unAssignedProduct, 'mapped_aisles'=>$products];
        }

        return response()->json($response);
    }
    
}
