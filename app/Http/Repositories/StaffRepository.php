<?php

namespace App\Http\Repositories;

use App\Http\Controllers\Rest\BaseController;
use App\Models\Employee;
use Illuminate\Http\Request;

class StaffRepository
{
    public $controller = null;
    public $request = null;

    public function __construct(BaseController $controller, Request $request)
    {
        $this->controller = $controller;
        $this->request = $request;
    }

    /**
     * @OA\Post(
     *     path="/v1/staff/list",
     *     summary="Staff List",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",            
     *              @OA\Property(property="search", type="string", example=""),
     *              @OA\Property(property="sort", type="string", example=""),
     *              @OA\Property(property="machine_id", type="integer", example="")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOjE2MSwiYWRtaW5faWQiOjE1OX0sImlhdCI6MTcxODk2ODA3OSwiZXhwIjoxNzI0MTUyMDc5fQ.LuLaN2o66G1CYxBRa0uheC-ETKD2IiOv3sxEq8QPg7g"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function list()
    {
        $search         = $this->request->search;
        $sort           = $this->request->sort;
        $machine_id     = $this->request->machine_id;

        $model          = Employee::with("employee_machines");

        if ($this->request->auth->client_id > 0) {
            $model->where('client_id', $this->request->auth->client_id);
        }

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->whereRaw("CONCAT(firstname,' ',lastname) LIKE $search%");
                $query->orWhere("group_name", "LIKE", "$search%");
            });
        }

        if ($machine_id > 0) {
            $model->whereHas('employee_machines', function ($query) use ($machine_id) {
                $query->where('machine_id', $machine_id);
            });
        }

        if ($sort === "name") {
            $model->orderBy("first_name", "ASC");
        } else if ($sort === "last_created") {
            $model->orderBy("created_at", "DESC");
        } else {
            $model->orderBy("id", "DESC");
        }
        $model = $model->paginate($this->request->length ?? 50);
        return $this->controller->sendResponseWithPagination($model);
    }
}
