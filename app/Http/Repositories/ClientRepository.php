<?php

namespace App\Http\Repositories;

use App\Http\Controllers\Rest\BaseController;
use App\Models\Client;

class ClientRepository
{
    public $controller;

    public function __construct(BaseController $controller)
    {
        $this->controller = $controller;
    }

    /**
     * @OA\Post(
     *     path="/v1/client/list",
     *     summary="Clients List",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="search", type="string", example=""),
     *             @OA\Property(property="length", type="integer", example=100),
     *             @OA\Property(property="type", type="string", example="active")
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

    public function listing($request)
    {
        $model = Client::withCount("portal_users", "machine_users");

        if ($request->type === "active") {
            $model->where("status", 'A');
        } else {
            $model->where("status", "!=", 'D');
        }

        if (!empty($request->search)) {
            $model->where(function ($query) use ($request) {
                $query->where("client_code", "like", $request->search . "%");
                $query->orWhere("client_name", "like", $request->search . "%");
                $query->orWhere("client_username", "like", $request->search . "%");
                $query->orWhere("client_phone", "like", $request->search . "%");
                $query->orWhere("client_email", "like", $request->search . "%");
            });
        }

        $model->orderBy("updated_at", "DESC");

        $model = $model->paginate($request->length ?? 100);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/client/info",
     *     summary="Clients Info",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="client_id", type="integer", example="")
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

    public function info($request)
    {
        $model = Client::where("id", $request->client_id)->first();
        return $this->controller->sendResponse("Success", $model);
    }

    /**
     * @OA\Post(
     *     path="/v1/client/update",
     *     summary="Clients Update",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="client_id", type="integer", example=""),
     *             @OA\Property(property="client_name", type="string", example=""),
     *             @OA\Property(property="business_registration_number", type="string", example=""),
     *             @OA\Property(property="client_address", type="string", example="")
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

    public function update($request)
    {
        $fields = $request->except("client_id");
        try {
            Client::find($request->client_id)->update($fields);
            return $this->controller->sendSuccess("Client updated successfully.");
        } catch (\Throwable $th) {
            return $this->controller->sendError($th->getMessage());
        }
    }
}
