<?php

namespace App\Http\Repositories;

use App\Http\Controllers\Rest\BaseController;
use App\Models\Staff;
use Illuminate\Http\Request;
use DB;

class StaffRepository
{
    public $request;
    public $controller;
    public $client_id;

    public function __construct(Request $request, BaseController $controller)
    {
        $this->request      = $request;
        $this->controller   = $controller;
        $this->client_id    = $request->auth->client_id;
    }

    /**
     * @OA\Post(
     *     path="/v1/staff/list",
     *     summary="Staff List",
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
        $search = $this->request->search;
        $order_by = $this->request->sort;
        $machine_id = $this->request->machine_id;
        $order_dir  = 'asc';

        if ($order_by === "name") {
            $order_by = "employee.first_name";
        } else if ($order_by === "last_created") {
            $order_by = "employee.created_at";
            $order_dir = "desc";
        } else {
            $order_by = "employee.id";
        }
    }
}
