<?php

namespace App\Http\Controllers\Rest;

use App\Models\Category;
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
     *     summary="Category List",
     *     tags={"V1"},
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

    public function dropdownList(Request $request, Category $category)
    {
        $response = Cache::remember("category-listing:$this->admin_logged_in", env('LISTING_TIME_LIMIT', 300), function () use ($request, $category) {
            return $category->dropdownList($request);
        });
        return $this->sendResponse($response, "Success");
    }
}
