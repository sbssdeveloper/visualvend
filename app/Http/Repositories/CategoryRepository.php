<?php

namespace App\Http\Repositories;

use App\Http\Controllers\Rest\BaseController;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryRepository
{
    public $request;
    public $controller;

    public function __construct(Request $request, BaseController $controller)
    {
        $this->request      = $request;
        $this->controller   = $controller;
    }

    /**
     * @OA\Get(
     *     path="/v1/category/info",
     *     summary="Category Info",
     *     tags={"V1"},
     *     @OA\Parameter(
     *         name="cid",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="string"),
     *         description="Category ID"
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
     *         description="Success."
     *     )
     * )
     */

    public function info()
    {
        $id = $this->request->cid;
        $category = Category::where("id", $id)->first();
        return $this->controller->sendResponse("OK", $category);
    }
}
