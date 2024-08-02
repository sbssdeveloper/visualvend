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

    /**
     * @OA\Post(
     *     path="/v1/apk/update",
     *     summary="Apk Update",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"name","path"},              
     *              @OA\Property(property="name", type="string", example=""),
     *              @OA\Property(property="path", type="string", example=""),
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

    public function update()
    {
        try {
            $updated = Apk::where('name', $this->request->name)->update(['path' => $this->request->path]);
            if ($updated) {
                return $this->controller->sendSuccess("APK updated successfully.");
            } else {
                return $this->controller->sendSuccess("Failed to update apk!");
            }
        } catch (\Throwable $th) {
            return $this->controller->sendError($th->getMessage());
        }
    }
}
