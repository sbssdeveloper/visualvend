<?php

namespace App\Http\Repositories;

use App\Http\Controllers\Rest\BaseController;
use App\Models\Admin;
use Illuminate\Http\Request;

class AdminRepository
{
    public $request = null;
    public $controller = null;

    public function __construct(Request $request, BaseController $controller)
    {
        $this->request = $request;
        $this->controller = $controller;
    }
    /**
     * @OA\Post(
     *     path="/v1/admin/list",
     *     summary="Admin List",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"name","path"},              
     *              @OA\Property(property="search", type="string", example=""),
     *              @OA\Property(property="status", type="string", enum={0, 1, 2}),
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

    public function list()
    {
        $search = $this->request->search;
        $status = $this->request->status;
        $model = Admin::select("*");

        if ($this->request->client_id > 0) {
            $model->where('client_id', $this->request->client_id);
        }

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->whereRaw("CONCAT(firstname,' ',lastname) LIKE %$search%");
                $query->orWhere("emailid", "LIKE", "$search%");
                $query->orWhere("mobilenumber", "LIKE", "$search%");
            });
        }

        if (!empty($status)) {
            $model->where('is_activated', $status);
        }

        $model = $model->paginate($this->request->length ?? 50);
        return $this->controller->sendResponse("Success", $model);
    }
}
