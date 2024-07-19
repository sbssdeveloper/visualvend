<?php

namespace App\Http\Repositories;

use DB;
use App\Http\Controllers\Rest\BaseController;
use App\Models\EmployeeTransaction;
use App\Models\Feedback;
use App\Models\GiftReport;
use App\Models\LocationNonFunctional;
use App\Models\Machine;
use App\Models\MachineProductMap;
use App\Models\Receipts;
use App\Models\RemoteVend;
use App\Models\ReportEmail;
use App\Models\Sale;
use App\Models\ServiceReport;
use App\Models\Transaction;
use Illuminate\Http\Request;

class LatestReportsRepository
{
    public const _VEND_ERRORS = ["Motor Error", "Out of Stock", "Vend Drop Error", "not correctly vending", "Price Mismatch", "Invalid Aisle", "Stock Mismatch", "Vend Failed", "Sold out", "Controller Error", "Need Service"];

    public $request = null;
    public $controller = null;
    public $repo_helper = null;
    public function __construct(Request $request, BaseController $controller, ReportsRepository $repo_helper)
    {
        ini_set('memory_limit', '-1');
        $this->request      = $request;
        $this->controller   = $controller;
        $this->role         = $request->auth->role;
        $this->client_id    = $request->auth->client_id;
        $this->admin_id     = $request->auth->admin_id;
        $this->repo_helper  = $repo_helper;
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/sales",
     *     summary="Mobile Reports Sale",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=196),
     *              @OA\Property(property="type", type="string", example=""),
     *              @OA\Property(property="search", type="string", example="")
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

    public function sales($machines)
    {
        $where              = $allIds = $pairedIds = $saleMachines =  [];
        $search             = $this->request->search;

        $total              = Sale::where("is_deleted", 0);
        $select             = "";
        switch ($this->request->type) {
            case 'pickup_or_return':
                $select = "IF(pickup_or_return IN (-1,1),'Pickup','Return') as pickup_or_return";
                break;
            case 'product':
                $select = "product_id, product_name";
                break;
            case 'employee':
                $select = "employee_id, employee_name";
                break;
            default:
                $select = "machine_id, machine_name";
                break;
        }
        $model              = Sale::selectRaw($select)->where("is_deleted", 0);

        if ($this->client_id > 0) {
            $total->where("client_id", $this->client_id);
            $model->where("client_id", $this->client_id);
        }

        if ($this->client_id > 0 && !in_array($this->role, ["Super Admin", "Full Access"])) {
            $model->where("id NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$this->admin_id)");
            $total->where("id NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$this->admin_id)");
        }

        if (!empty($search)) {
            switch ($this->request->type) {
                case 'machine':
                    $model->where('machine_name', "LIKE", "$search%");
                    break;
                case 'product':
                    $model->where('product_name', "LIKE", "$search%");
                    break;
                case 'employee':
                    $model->where('employee_name', "LIKE", "$search%");
                    break;
                default:
                    break;
            }

            $total->where(function ($query) use ($search) {
                $query->where("product_name", "LIKE", "$search%")->orWhere("machine_name", "LIKE", "$search%")->orWhere("employee_name", "LIKE", "$search%");
            });
        }

        if (!empty($this->request->machine_id)) {
            $model->where("machine_id", $this->request->machine_id);
            $total->where("machine_id", $this->request->machine_id);
        } elseif ($this->client_id > 0) {
            $model->whereIn("machine_id", $machines);
            $total->whereIn("machine_id", $machines);
        }

        if (!empty($this->request->start_date) && !empty($this->request->end_date)) {
            $model->whereDate('timestamp', '>=', $this->request->start_date)->whereDate('timestamp', '<=', $this->request->end_date);
            $total->whereDate('timestamp', '>=', $this->request->start_date)->whereDate('timestamp', '<=', $this->request->end_date);
        }

        $groupBy            = "";
        if ($this->request->type === "machine") {
            $model          = $model->orderBy('machine_name', "ASC");
            $groupBy        = "machine_id";
        } else if ($this->request->type === "employee") {
            $model          = $model->orderBy("employee_name", "DESC");
            $groupBy        = "employee_id";
        } else if ($this->request->type === "product") {
            $model          = $model->orderBy("product_name", "ASC");
            $groupBy        = "product_id";
        } else if ($this->request->type === "pickup_or_return") {
            $model          = $model->orderBy('pickup_or_return', "ASC");
            $groupBy        = "pickup_or_return";
        } else {
            $model          = $model->orderBy('machine_name', "ASC");
            $groupBy        = "machine_id";
        }
        $model              = $model->groupBy("id", $groupBy)->paginate($this->request->length ?? 10);
        $total              = $total->sum("product_price");
        $extra              = [
            "total_sales" => number_format($total, 2),
            "top_selling" => $this->repo_helper->top_selling($machines),
        ];

        if (count($extra["top_selling"]) > 0) {
            $extra["least_selling"] = $this->repo_helper->least_selling($machines, end($extra["top_selling"])["count"] ?? 0);
        } else {
            $extra["least_selling"] = [];
        }
        $data               = $this->controller->sendResponseWithPagination($model, "Success", $extra);
        return $data;
    }
}
