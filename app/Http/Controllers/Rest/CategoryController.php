<?php

namespace App\Http\Controllers\Rest;

use App\Models\Category;
use App\Rules\UniqueCategoryRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CategoryController extends BaseController
{
    public $admin_logged_in;

    public function __construct(Type $var = null)
    {
        $this->admin_logged_in = $request->auth->admin ?? "client";
    }

    /**
     * @OA\Get(
     *     path="/v1/category/list",
     *     summary="Category List For Dropdown",
     *     tags={"V1"},
     *      @OA\Parameter(
     *         name="cid",
     *         in="query",
     *         required=false,
     *         @OA\Schema(
     *             type="integer"
     *         ),
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

    public function dropdownList($cid = null, Request $request, Category $category)
    {
        return $this->sendResponse("Success", $category->dropdownList($request, $cid));
    }

    /**
     * @OA\Post(
     *     path="/v1/category/list",
     *     summary="Category List",
     *     tags={"V1"},
     *      @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              @OA\Property(property="search", type="string"),
     *             @OA\Property(property="length", type="integer"),
     *             @OA\Property(property="sort", type="string"),
     *          )
     *      ),
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

    public function list(Request $request, Category $category)
    {
        $response = Cache::remember("category-listing:$this->admin_logged_in", env('LISTING_TIME_LIMIT', 300), function () use ($request, $category) {
            return $category->list($request);
        });
        return $this->sendResponse("Success", $response);
    }

    /**
     * @OA\Post(
     *     path="/v1/category/create",
     *     summary="Category Create",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                type="object",
     *                  required={"image", "category_id", "category_name"},
     *                 @OA\Property(property="image", type="string", format="binary"),
     *                 @OA\Property(property="category_id", type="string"),
     *                 @OA\Property(property="category_name", type="string"),
     *                 @OA\Property(property="client_id", type="string"),
     *             )
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxODc4NTMyNiwiZXhwIjoxNzIzOTY5MzI2fQ.k5JBAi5K4p3FDzp6HIs4whNrffllIFid7VOk40Sdkkc",
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function create(Request $request, Category $category, UniqueCategoryRule $rule)
    {
        $rules = [
            'image'                         => 'required|file|max:2048|mimes:jpg,png,jpeg',
            'category_id'                   => ['required', $rule],
            'category_name'                 => 'required|max:50'
        ];
        
        if ($request->auth->client_id <= 0) {
            $rules['client_id'] = "required";
        }

        $this->validate($request, $rules);

        try {
            $category->create($request);
            return $this->sendSuccess("Category created successfully.");
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
}
