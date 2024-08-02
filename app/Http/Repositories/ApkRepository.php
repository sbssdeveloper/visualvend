<?php

namespace App\Http\Repositories;

use App\Http\Controllers\Rest\BaseController;
use App\Models\Apk;
use Illuminate\Http\Request;

class ApkRepository
{
    public $request;
    public $controller;

    public function __construct(Request $request, BaseController $controller)
    {
        $this->request      = $request;
        $this->controller   = $controller;
    }

    /**
     * @OA\Post(
     *     path="/v1/apk/list",
     *     summary="Apk List",
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

    public function list()
    {
        $model = Apk::select("id", "created_at", "updated_at", "name", "path", "version")
            ->whereNotNull("name")
            ->get();
        return $model;
    }
}
