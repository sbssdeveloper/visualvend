<?php

namespace App\Http\Controllers\Rest;

use App\Http\Controllers\BaseController;
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
    public function dropdownList(Request $request, Category $category)
    {
        $response = Cache::remember("category-listing:$this->admin_logged_in", env('LISTING_TIME_LIMIT', 300), function () use ($request, $category) {
            return $category->dropdownList($request);
        });
        return $this->sendResponse($response, "Success");
    }
}
