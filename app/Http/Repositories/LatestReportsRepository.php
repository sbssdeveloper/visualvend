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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcyMTM4NDg4NSwiZXhwIjoxNzI2NTY4ODg1fQ.4EgnOxeP9oeFhFzNDz9bouJluUmmn1hV1z60ASB7cuU"
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
            $model->where("machine_name", "<>", "")->orderBy('machine_name', "ASC");
            $groupBy        = "machine_id";
        } else if ($this->request->type === "employee") {
            $model->where("employee_name", "<>", "")->orderBy("employee_name", "DESC");
            $groupBy        = "employee_id";
        } else if ($this->request->type === "product") {
            $model->where("product_name", "<>", "")->orderBy("product_name", "ASC");
            $groupBy        = "product_id";
        } else if ($this->request->type === "pickup_or_return") {
            $model->where("pickup_or_return", "<>", "")->orderBy('pickup_or_return', "ASC");
            $groupBy        = "pickup_or_return";
        } else {
            $model->where("machine_name", "<>", "")->orderBy('machine_name', "ASC");
            $groupBy        = "machine_id";
        }
        $model              = $model->groupBy("$groupBy")->paginate($this->request->length ?? 10);
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

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/sales/data",
     *     summary="Mobile Reports Sale Data",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date","client_id"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="type", type="string", example=""),
     *              @OA\Property(property="value", type="string", example=""),
     *              @OA\Property(property="search", type="string", example=""),
     *              @OA\Property(property="client_id", type="integer", example="")
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

    public function salesData($machines)
    {
        $whereKey = "";

        switch ($this->request->type) {
            case 'machine':
                $whereKey = 'machine_id';
                break;
            case 'product':
                $whereKey = 'product_id';
                break;
            case 'employee':
                $whereKey = 'employee_id';
                break;
            default:
                $whereKey = 'pickup_or_return';
                break;
        }

        $model              = Sale::select("*", DB::raw("IF(aisle_no IS NULL,'NA',aisle_no) as aisles"), DB::raw("FORMAT(product_price,2) as price"))->with("product");

        $model->where("is_deleted", 0)->where($whereKey, $this->request->value);


        if ($this->client_id > 0) {
            $model          = $model->whereIn("machine_id", $machines);
            if (!in_array($this->role, ["Super Admin", "Full Access"])) {
                $model          = $model->where("id NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$this->admin_id)");
            }
        }

        if (!empty($search)) {
            $model      = $model->where(function ($query) use ($search) {
                $query->where("product_name", "LIKE", "$search%")->orWhere("machine_name", "LIKE", "$search%")->orWhere("employee_name", "LIKE", "$search%");
            });
        }

        if (!empty($this->request->start_date) && !empty($this->request->end_date)) {
            $model          = $model->whereDate('timestamp', '>=', $this->request->start_date)->whereDate('timestamp', '<=', $this->request->end_date);
        }

        if ($this->request->type === "machine") {
            $model          = $model->orderBy('machine_name', "ASC");
        } else if ($this->request->type === "employee") {
            $model          = $model->orderBy("employee_name", "DESC");
        } else if ($this->request->type === "product") {
            $model          = $model->orderBy("product_name", "ASC");
        } else if ($this->request->type === "pickup_or_return") {
            $model          = $model->orderBy('pickup_or_return', "ASC");
        } else {
            $model          = $model->orderBy('machine_name', "ASC");
        }

        $model              = $model->paginate($this->request->length ?? 50);
        return $this->controller->sendResponseWithPagination($model, "Success");
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/refill",
     *     summary="Mobile Reports Refill",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date","type"},              
     *              @OA\Property(property="start_date", type="date", example="2020-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=""),
     *              @OA\Property(property="type", type="string", example=""),
     *              @OA\Property(property="search", type="string", example=""),
     *              @OA\Property(property="refill_type", type="string", example="sale")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function refill($my_machines)
    {
        $refills            =  $highest = 0;
        $model              = null;
        $product_loc_map = $refilling = $machine_product_map = $sell_quantity =  [];
        $machine_id         = $this->request->machine_id;
        $timestamp          = $this->request->timestamp;
        $start_date         = $this->request->start_date;
        $end_date           = $this->request->end_date;
        $refill_type        = $this->request->refill_type ?? "sale";
        $type               = $this->request->type;
        $search             = $this->request->search;

        if ($timestamp && $timestamp != "") {
            $start_date     = null;
            $end_date       = null;
            $start_date     = date("Y-m-d", strtotime($timestamp)) . " 00:00:00";
            $end_date       = date("Y-m-d", strtotime($timestamp)) . " 23:59:59";;
        } else {
            $start_date     = date("Y-m-d H:i:s", strtotime($start_date));
            $end_date       = date("Y-m-d H:i:s", strtotime($end_date));
        }

        $topLow             = MachineProductMap::select("machine_product_map.machine_id", "machine_product_map.updated_at as timestamp", "machine.machine_name", "machine_product_map.id", "machine_product_map.product_id", "machine_product_map.product_name", "machine_product_map.product_location", DB::raw("(machine_product_map.product_max_quantity - machine_product_map.product_quantity) as count"))->leftJoin("machine", "machine.id", "=", "machine_product_map.machine_id")->whereNotNull("product_id");

        $machines      = MachineProductMap::leftJoin("machine", "machine.id", "=", "machine_product_map.machine_id")->whereNotNull("product_id");

        $refill_qty             = MachineProductMap::selectRaw("SUM(`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`) as refill_qty")->leftJoin("machine", "machine.id", "=", "machine_product_map.machine_id")->whereNotNull("product_id");

        $vended_qty         = Sale::select(DB::raw("SUM(`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`) as refill_qty"))->leftJoin('machine_product_map', function ($join) {
            $join->on("machine_product_map.machine_id", "=", "sale_report.machine_id")
                ->on("machine_product_map.product_location", "=", "sale_report.aisle_no")
                ->on("machine_product_map.product_id", "=", "sale_report.product_id");
        })->whereNotNull("sale_report.product_id");

        $select = $groupBy = "";
        switch ($this->request->type) {
            case 'machine':
                if ($refill_type === "sale") {
                    $select     = "sale_report.machine_id, sale_report.machine_name";
                    $groupBy    = "sale_report.machine_id";
                } else {
                    $select     = "machine_product_map.machine_id, machine.machine_name";
                    $groupBy    = "machine_product_map.machine_id";
                }
                break;
            case 'product':
                if ($refill_type === "sale") {
                    $select     = "sale_report.product_id, sale_report.product_name";
                    $groupBy    = "sale_report.product_id, sale_report.machine_id";
                } else {
                    $select     = "machine_product_map.product_id, machine_product_map.product_name";
                    $groupBy    = "machine_product_map.product_id, machine_product_map.machine_id";
                }
                break;
            case 'aisle':
                $select     = $refill_type === "sale" ? "sale_report.aisle_no as aisle" : "machine_product_map.product_location as aisle";
                $groupBy    = $refill_type === "sale" ? "sale_report.aisle_no" : "machine_product_map.product_location";
                break;
            default:
                if ($refill_type === "sale") {
                    $select = "CASE WHEN aisle_remain_qty=0 THEN 'empty' WHEN aisle_remain_qty>0 THEN 'partial' WHEN product_max_quantity-aisle_remain_qty=0 THEN 'full' ELSE 'unknown' END as quantity";
                } else {
                    $select = "CASE WHEN product_quantity=0 THEN 'empty' WHEN product_quantity>0 THEN 'partial' WHEN product_max_quantity-product_quantity=0 THEN 'full' ELSE 'unknown' END as quantity";
                }
                $groupBy    = "quantity";
                break;
        }

        if ($refill_type === "sale") {
            $model          = Sale::selectRaw($select)->leftJoin('machine_product_map', function ($join) {
                $join->on("machine_product_map.machine_id", "=", "sale_report.machine_id")
                    ->on("machine_product_map.product_location", "=", "sale_report.aisle_no")
                    ->on("machine_product_map.product_id", "=", "sale_report.product_id");
            })->whereNotNull("sale_report.product_id");
        } else {
            $model          = MachineProductMap::selectRaw($select)->leftjoin("machine", "machine.id", "=", "machine_product_map.machine_id")->whereNotNull("product_id");
        }
        if ($this->client_id > 0) {
            $topLow         = $topLow->where("machine_product_map.client_id", $this->client_id);
            $refill_qty     = $refill_qty->where("machine_product_map.client_id", $this->client_id);
            $machines       = $machines->where("machine_product_map.client_id", $this->client_id);

            $vended_qty     = $vended_qty->where("sale_report.client_id", $this->client_id);
            if ($refill_type === "sale") {
                $model      = $model->where("sale_report.client_id", $this->client_id);
            } else {
                $model      = $model->where("machine_product_map.client_id", $this->client_id);
            }
        }
        if ($machine_id > 0) {
            $topLow         = $topLow->where("machine_product_map.machine_id", $machine_id);
            $refill_qty     = $refill_qty->where("machine_product_map.machine_id", $machine_id);
            $machines       = $machines->where("machine_product_map.machine_id", $machine_id);
            $vended_qty     = $vended_qty->where("sale_report.machine_id", $machine_id);
            if ($refill_type === "sale") {
                $model      = $model->where("sale_report.machine_id", $machine_id);
            } else {
                $model      = $model->where("machine_product_map.machine_id", $machine_id);
            }
        }

        $vended_qty      = $vended_qty->whereDate("sale_report.timestamp", ">=", $start_date);
        $vended_qty      = $vended_qty->whereDate("sale_report.timestamp", "<=", $end_date);

        if ($refill_type === "sale") {
            $model      = $model->whereDate("sale_report.timestamp", ">=", $start_date);
            $model      = $model->whereDate("sale_report.timestamp", "<=", $end_date);
        }

        if (!empty($search)) {

            $topLow         = $topLow->where(function ($query) {
                $query->where("machine_product_map.product_name", "LIKE", "%$search%");
                $query->orWhere("machine.machine_name", "LIKE", "%$search%");
            });

            $refill_qty     = $refill_qty->where(function ($query) {
                $query->where("machine_product_map.product_name", "LIKE", "%$search%");
                $query->orWhere("machine.machine_name", "LIKE", "%$search%");
            });

            $machines      = $machines->where(function ($query) {
                $query->where("machine_product_map.product_name", "LIKE", "%$search%");
                $query->orWhere("machine.machine_name", "LIKE", "%$search%");
            });

            $vended_qty    = $vended_qty->where(function ($query) {
                $query->where("sale_report.product_name", "LIKE", "%$search%");
                $query->orWhere("sale_report.machine_name", "LIKE", "%$search%");
            });

            if ($refill_type === "sale") {
                $model      = $model->where(function ($query) {
                    $query->where("sale_report.product_name", "LIKE", "%$search%");
                    $query->orWhere("sale_report.machine_name", "LIKE", "%$search%");
                });
            } else {
                $model      = $model->where(function ($query) {
                    $query->where("machine_product_map.product_name", "LIKE", "%$search%");
                    $query->orWhere("machine.machine_name", "LIKE", "%$search%");
                });
            }
        }

        if ($this->client_id > 0) {
            $topLow         = $topLow->whereIn("machine_product_map.machine_id", $my_machines);
            $refill_qty     = $refill_qty->whereIn("machine_product_map.machine_id", $my_machines);
            $machines       = $machines->whereIn("machine_product_map.machine_id", $my_machines);
            $vended_qty     = $vended_qty->whereIn("sale_report.machine_id", $my_machines);
            if ($refill_type === "sale") {
                $model      = $model->whereIn("sale_report.machine_id", $my_machines);
            } else {
                $model      = $model->whereIn("machine_product_map.machine_id", $my_machines);
            }
        }
        $machines          = $machines->groupBy("machine_product_map.machine_id")->get()->count();
        $vended_qty       = $vended_qty->groupBy("sale_report.machine_id", "sale_report.product_id", "sale_report.aisle_no")->get()->count();
        $refill_qty        = $refill_qty->first()->refill_qty;
        $vended_data       = [];
        $vended_new_qty    = 0;
        $topRefill         = $topLow->whereRaw("(`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>1")->orderBy("count", "DESC")->limit(5)->get()->toArray();

        $endCount          = isset(end($topRefill)["count"]) ? end($topRefill)["count"] : 2;

        $lowRefill         = $topLow->whereRaw("(`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>1")->whereRaw("(`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)<$endCount")->orderBy("count", "ASC")->limit(5)->get()->toArray();

        if ($refill_type == "sale") {
            $model         = $model->groupByRaw($groupBy)->orderBy("sale_report.id", "DESC");
        } else {
            $model         = $model->groupByRaw($groupBy)->orderBy("machine_product_map.id", "DESC");
        }
        $model                          = $model->paginate($this->request->length ?? 10);
        $extra                          = [];
        $extra["total_refills"]         = $refill_qty ?? 0;
        $extra["total_machines"]        = $machines;
        $extra["top_refilling"]         = $topRefill;
        $extra["vended_refills"]        = $vended_new_qty;
        $extra["least_refilling"]       = array_reverse($lowRefill);

        $data               = $this->controller->sendResponseWithPagination($model, "Success", $extra);
        return $data;
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/refill/data",
     *     summary="Mobile Reports Refill Data",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date","type"},              
     *              @OA\Property(property="start_date", type="date", example="2020-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=""),
     *              @OA\Property(property="type", type="string", example=""),
     *              @OA\Property(property="value", type="string", example=""),
     *              @OA\Property(property="search", type="string", example=""),
     *              @OA\Property(property="refill_type", type="string", example="sale")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function refillData($machines)
    {
        $refills            =  $highest = 0;
        $model              = null;
        $product_loc_map = $refilling = $machine_product_map = $sell_quantity =  [];
        $machine_id         = $this->request->machine_id;
        $timestamp          = $this->request->timestamp;
        $start_date         = $this->request->start_date;
        $end_date           = $this->request->end_date;
        $refill_type        = $this->request->refill_type ?? "sale";
        $type               = $this->request->type;
        $value              = $this->request->value;
        $search             = $this->request->search;

        if ($timestamp && $timestamp != "") {
            $start_date     = null;
            $end_date       = null;
            $start_date     = date("Y-m-d", strtotime($timestamp)) . " 00:00:00";
            $end_date       = date("Y-m-d", strtotime($timestamp)) . " 23:59:59";;
        } else {
            $start_date     = date("Y-m-d H:i:s", strtotime($start_date));
            $end_date       = date("Y-m-d H:i:s", strtotime($end_date));
        }

        if ($refill_type === "sale") {
            $model          = Sale::select("sale_report.*", DB::raw("(machine_product_map.product_max_quantity - sale_report.aisle_remain_qty) as refill_qty"))->leftJoin('machine_product_map', function ($join) {
                $join->on("machine_product_map.machine_id", "=", "sale_report.machine_id")
                    ->on("machine_product_map.product_location", "=", "sale_report.aisle_no")
                    ->on("machine_product_map.product_id", "=", "sale_report.product_id");
            })->whereNotNull("sale_report.product_id");
        } else {
            $model          = MachineProductMap::select("machine_product_map.machine_id", "machine_product_map.updated_at as timestamp", "machine.machine_name", "machine_product_map.id", "machine_product_map.product_id", "machine_product_map.product_name", "machine_product_map.product_location as aisle_no", "machine_product_map.product_max_quantity", "machine_product_map.product_quantity", DB::raw("(machine_product_map.product_max_quantity - machine_product_map.product_quantity) as refill_qty"))->leftjoin("machine", "machine.id", "=", "machine_product_map.machine_id")->whereNotNull("product_id");
        }
        if ($this->client_id > 0) {
            if ($refill_type === "sale") {
                $model->where("sale_report.client_id", $this->client_id);
            } else {
                $model->where("machine_product_map.client_id", $this->client_id);
            }
        }
        if ($machine_id > 0) {
            if ($refill_type === "sale") {
                $model->where("sale_report.machine_id", $machine_id);
            } else {
                $model->where("machine_product_map.machine_id", $machine_id);
            }
        }

        if ($refill_type === "sale") {
            $model->whereDate("sale_report.timestamp", ">=", $start_date);
            $model->whereDate("sale_report.timestamp", "<=", $end_date);
        }

        if (!empty($search)) {
            if ($refill_type === "sale") {
                $model->where(function ($query) {
                    $query->where("sale_report.product_name", "LIKE", "%$search%");
                    $query->orWhere("sale_report.machine_name", "LIKE", "%$search%");
                });
            } else {
                $model->where(function ($query) {
                    $query->where("machine_product_map.product_name", "LIKE", "%$search%");
                    $query->orWhere("machine.machine_name", "LIKE", "%$search%");
                });
            }
        }

        if ($this->client_id > 0) {
            if ($refill_type === "sale") {
                $model->whereIn("sale_report.machine_id", $my_machines);
            } else {
                $model->whereIn("machine_product_map.machine_id", $my_machines);
            }
        }

        if ($refill_type == "sale") {
            $model->orderBy("sale_report.id", "DESC");
        } else {
            $model->orderBy("machine_product_map.id", "DESC");
        }

        switch ($type) {
            case 'machine':
                if ($refill_type === "sale") {
                    $model->where("sale_report.machine_id", $value);
                } else {
                    $model->where("machine_product_map.machine_id", $value);
                }
                break;
            case 'product':
                if ($refill_type === "sale") {
                    $model->where("sale_report.product_id", $value);
                } else {
                    $model->where("machine_product_map.product_id", $value);
                }
                break;
            case 'aisle':
                if ($refill_type === "sale") {
                    $model->where("sale_report.aisle_no", $value);
                } else {
                    $model->where("machine_product_map.product_location", $value);
                }
                break;
            default:
                if ($refill_type === "sale") {
                    if ($value === "empty") {
                        $model->whereRaw("sale_report.aisle_remain_qty=0");
                    } else if ($value === "partial") {
                        $model->whereRaw("machine_product_map.product_max_quantity-sale_report.aisle_remain_qty>0");
                    } else {
                        $model->whereRaw("machine_product_map.product_max_quantity-sale_report.aisle_remain_qty=0");
                    }
                } else {
                    if ($value === "empty") {
                        $model->whereRaw("machine_product_map.product_quantity=0");
                    } else if ($value === "partial") {
                        $model->whereRaw("machine_product_map.product_max_quantity-machine_product_map.product_quantity>0");
                    } else {
                        $model->whereRaw("machine_product_map.product_max_quantity-machine_product_map.product_quantity=0");
                    }
                }
                break;
        }

        $model             = $model->paginate($this->request->length ?? 10);
        return $this->controller->sendResponseWithPagination($model, "Success");
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/stock",
     *     summary="Reports Stock Mobile",
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function stock($machines)
    {
        $client_id          = $this->client_id;
        $start_date         = $this->request->start_date;
        $end_date           = $this->request->end_date;
        $machine_id         = $this->request->machine_id;
        $type               = $this->request->type;
        $search             = $this->request->search;

        switch ($this->request->type) {
            case 'machine':
                $select     = "machine_product_map.machine_id, machine.machine_name";
                $groupBy    = "machine_product_map.machine_id";
                break;
            case 'product':
                $select     = "machine_product_map.product_id, machine_product_map.product_name";
                $groupBy    = "machine_product_map.product_id, machine_product_map.machine_id";
                break;
            case 'aisle':
                $select     = "machine_product_map.product_location as aisle";
                $groupBy    = "machine_product_map.product_location";
                break;
            default:
                $select = "CASE WHEN product_quantity=0 THEN 'empty' WHEN product_quantity>0 THEN 'partial' WHEN product_max_quantity-product_quantity=0 THEN 'full' ELSE 'unknown' END as quantity";
                $groupBy    = "quantity";
                break;
        }

        $model  = Machine::selectRaw($select)->leftJoin("machine_product_map", "machine_product_map.machine_id", "=", "machine.id")->leftJoin("refill_history", function ($join) {
            $join->on("refill_history.machine_id", "=", "machine_product_map.machine_id");
            $join->on("refill_history.aisle_number", "=", "machine_product_map.product_location");
        });
        $model->where("machine_product_map.product_id", "<>", "");
        $model->where(function ($query) {
            $query->whereNull("refill_history.is_deleted");
            $query->orWhere("refill_history.is_deleted", 0);
        });

        if ($client_id > 0) {
            $model  = $model->where("machine.machine_client_id", $client_id)->whereIn("machine.id", $machines);
        }

        if ($machine_id > 0) {
            $model  = $model->where("machine.id", $machine_id);
        }
        if (!empty($search)) {
            $model  = $model->where(function ($query) {
                $query->where("machine.machine_name", "LIKE", "$search%");
                $query->orWhere("machine_product_map.product_name", "LIKE", "$search%");
            });
        }

        if (!empty($start_date)) {
            $model  = $model->whereDate("refill_history.created_at", ">=", $start_date);
            $model  = $model->whereDate("refill_history.created_at", "<=", $end_date);
        }

        $model  = $model->groupByRaw($groupBy)->paginate($this->request->length ?? 10);
        return $this->controller->sendResponseWithPagination($model, "Success");
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/stock/data",
     *     summary="Reports Stock Data Mobile",
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
     *              @OA\Property(property="value", type="string", example=""),
     *              @OA\Property(property="search", type="string", example="")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function stockData($machines)
    {
        $client_id          = $this->client_id;
        $start_date         = $this->request->start_date;
        $end_date           = $this->request->end_date;
        $machine_id         = $this->request->machine_id;
        $type               = $this->request->type;
        $value              = $this->request->value;
        $search             = $this->request->search;

        $model  = Machine::select("machine_product_map.id AS id", "machine.id AS machine_id", "refill_history.aisle_number", "machine.machine_name", "machine_product_map.product_location", "machine_product_map.product_id", DB::raw("IF(machine_product_map.product_id = '', 'Empty', machine_product_map.product_name) AS product_name"), "machine_product_map.product_quantity", "machine_product_map.category_id", "machine_product_map.product_max_quantity", DB::raw("(machine_product_map.product_max_quantity - machine_product_map.product_quantity) AS need_refill_amount"), DB::raw("IF (machine_product_map.product_max_quantity <= 0, 0, FLOOR(machine_product_map.product_quantity / machine_product_map.product_max_quantity * 100)) AS stock_percentage"), DB::raw("SUBSTRING_INDEX(GROUP_CONCAT(refill_history.refill_amount ORDER BY refill_history.id DESC), ',', 1) AS last_refill_amount"), DB::raw("SUBSTRING_INDEX(GROUP_CONCAT(refill_history.created_at ORDER BY refill_history.id DESC), ',', 1) AS last_refill_date"), DB::raw("DATE(SUBSTRING_INDEX(GROUP_CONCAT(refill_history.created_at ORDER BY refill_history.id DESC), ',', 1)) AS last_refill_date_only"))->leftJoin("machine_product_map", "machine_product_map.machine_id", "=", "machine.id");

        $model->leftJoin("refill_history", function ($join) {
            $join->on("refill_history.machine_id", "=", "machine_product_map.machine_id");
            $join->on("refill_history.aisle_number", "=", "machine_product_map.product_location");
        });
        $model->where("machine_product_map.product_id", "<>", "");
        $model->where(function ($query) {
            $query->whereNull("refill_history.is_deleted");
            $query->orWhere("refill_history.is_deleted", 0);
        });

        if ($client_id > 0) {
            $model  = $model->where("machine.machine_client_id", $client_id)->whereIn("machine.id", $machines);
        }

        if ($machine_id > 0) {
            $model  = $model->where("machine.id", $machine_id);
        }

        if (!empty($search)) {
            $model  = $model->where(function ($query) {
                $query->where("machine.machine_name", "LIKE", "$search%");
                $query->orWhere("machine_product_map.product_name", "LIKE", "$search%");
            });
        }

        switch ($this->request->type) {
            case 'machine':
                $model->where("machine_product_map.machine_id", $value);
                break;
            case 'product':
                $model->where("machine_product_map.product_id", $value);
                break;
            case 'aisle':
                $model->where("machine_product_map.product_location", $value);
                break;
            default:
                if ($value === "empty") {
                    $model->where("machine_product_map.product_quantity", 0);
                } else if ($value === "partial") {
                    $model->where("machine_product_map.product_quantity", "<", "machine_product_map.product_max_quantity");
                } else {
                    $model->where("machine_product_map.product_quantity", "=", "machine_product_map.product_max_quantity");
                }
                break;
        }

        if (!empty($start_date)) {
            $model  = $model->whereDate("refill_history.created_at", ">=", $start_date);
            $model  = $model->whereDate("refill_history.created_at", "<=", $end_date);
        }

        $model  = $model->groupByRaw("IFNULL(refill_history.machine_id, machine_product_map.id), IFNULL(refill_history.aisle_number, machine_product_map.id) ORDER BY machine.id ASC")->paginate($this->request->length ?? 10);
        return $this->controller->sendResponseWithPagination($model, "Success");
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/vend/activity",
     *     summary="Reports Vend Activity",
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function vend_activity($machines)
    {
        $client_id          = $this->client_id;
        $start_date         = $this->request->start_date;
        $end_date           = $this->request->end_date;
        $machine_id         = $this->request->machine_id;
        $type               = $this->request->type;
        $search             = $this->request->search;
        $select             = $groupBy = "";
        switch ($this->request->type) {
            case 'machine':
                $select     = "sale_report.machine_id, sale_report.machine_name";
                $groupBy    = "sale_report.machine_id";
                break;
            case 'product':
                $select     = "sale_report.product_id, sale_report.product_name";
                $groupBy    = "sale_report.product_id, sale_report.machine_id";
                break;
            case 'employee':
                $select     = "sale_report.employee_id, sale_report.employee_name";
                $groupBy    = "sale_report.employee_id";
                break;
            default:
                $select = "IF(sale_report.pickup_or_return=-1,'Pickup','Return') AS pickup_or_return";
                $groupBy    = "CASE WHEN sale_report.pickup_or_return=-1 THEN 'Pickup' ELSE 'Return' END";
                break;
        }

        $model              = Sale::selectRaw($select)->leftJoin("machine_product_map", function ($join) {
            $join->on("sale_report.product_id", "=", "machine_product_map.product_id");
            $join->on("sale_report.machine_id", "=", "machine_product_map.machine_id");
            $join->on("sale_report.aisle_no", "=", "machine_product_map.product_location");
        })->where("sale_report.is_deleted", 0);

        $sales  = Sale::where("is_deleted", 0);

        $errors = LocationNonFunctional::selectRaw("COUNT(location_non_functional.id) as count, SUM(CASE WHEN LOCATE('Cancel', error_code) THEN 1 ELSE 0 END) AS cancelled")->leftJoin("machine", "machine.id", "=", "location_non_functional.machine_id");

        if ($client_id > 0) {
            $sales->whereIn("machine_id", $machines);
            $model->whereIn("sale_report.machine_id", $machines);
            $errors->whereIn("machine.id", $machines);
        }

        if (!empty($search)) {
            $sales->where(function ($query) use ($search) {
                $query->where("machine_name", "LIKE", "$search%");
                $query->orWhere("employee_name", "LIKE", "%$search%");
                $query->orWhere("product_name", "LIKE", "$search%");
            });

            $model->where(function ($query) use ($search) {
                $query->where("sale_report.machine_name", "LIKE", "$search%");
                $query->orWhere("sale_report.employee_name", "LIKE", "%$search%");
                $query->orWhere("sale_report.product_name", "LIKE", "$search%");
            });

            $errors->where(function ($query) use ($search) {
                $query->where("location_non_functional.machine_name", "LIKE", "$search%");
                $query->orWhere("location_non_functional.product_name", "LIKE", "$search%");
            });
        }

        if (!empty($machine_id)) {
            $sales->where("sale_report.machine_id", $machine_id);
            $model->where("sale_report.machine_id", $machine_id);
            $errors->where("location_non_functional.machine_id", $machine_id);
        }

        if ($start_date && !empty($start_date) && $end_date && !empty($end_date)) {
            $sales->whereDate("sale_report.timestamp", ">=", $start_date);
            $sales->whereDate("sale_report.timestamp", "<=", $end_date);
            $model->whereDate("sale_report.timestamp", ">=", $start_date);
            $model->whereDate("sale_report.timestamp", "<=", $end_date);
            $errors->whereDate("location_non_functional.timestamp", ">=", $start_date);
            $errors->whereDate("location_non_functional.timestamp", "<=", $end_date);
        }
        $errors     = $errors->first();

        if ($type === "machine") {
            $model->orderBy('sale_report.machine_name', "ASC");
        } else if ($type === "employee") {
            $model->orderBy("sale_report.employee_name", "DESC");
        } else if ($type === "product") {
            $model->orderBy("sale_report.product_name", "ASC");
        } else {
            $model->orderByRaw("CASE WHEN sale_report.pickup_or_return=-1 THEN 'Pickup' ELSE 'Return' END ASC");
        }
        $model->groupByRaw($groupBy);
        $response              = $model->paginate($this->request->length ?? 50);
        return $this->controller->sendResponseWithPagination($response, "Success", [
            "failed"        => $errors->count,
            "cancelled"     => $errors->cancelled,
            "sales"         => number_format($sales->sum("product_price"), 2)
        ]);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/vend/activity/data",
     *     summary="Reports Vend Activity Data",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2020-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=""),
     *              @OA\Property(property="type", type="string", example="machine"),
     *              @OA\Property(property="value", type="string", example=196),
     *              @OA\Property(property="search", type="string", example="")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function vend_activityData($machines)
    {
        $client_id          = $this->client_id;
        $start_date         = $this->request->start_date;
        $end_date           = $this->request->end_date;
        $machine_id         = $this->request->machine_id;
        $type               = $this->request->type;
        $value              = $this->request->value;
        $search             = $this->request->search;

        $model              = Sale::select("sale_report.employee_id", "sale_report.employee_name", "sale_report.id", "sale_report.timestamp", "sale_report.transaction_id", "sale_report.product_id", "sale_report.machine_id", "sale_report.product_name", "sale_report.machine_name", DB::raw("IF(sale_report.pickup_or_return=-1,'Pickup','Return') as vend_state"), DB::raw("IF(sale_report.transaction_status=2,'Vended Ok','Error') as errror_code"), DB::raw("IF(sale_report.transaction_status=2,'Paid - Vended','Error') as status"), DB::raw("IF(sale_report.aisle_no IS NULL,'NA',sale_report.aisle_no) as aisle_no"), DB::raw("FORMAT(sale_report.product_price,2) as price"), "machine_product_map.product_max_quantity", "machine_product_map.product_quantity")->leftJoin("machine_product_map", function ($join) {
            $join->on("sale_report.product_id", "=", "machine_product_map.product_id");
            $join->on("sale_report.machine_id", "=", "machine_product_map.machine_id");
            $join->on("sale_report.aisle_no", "=", "machine_product_map.product_location");
        })->where("sale_report.is_deleted", 0);

        if ($client_id > 0) {
            $model->whereIn("sale_report.machine_id", $machines);
        }

        if (!empty($search)) {
            $model  = $model->where(function ($query) use ($search) {
                $query->where("sale_report.machine_name", "LIKE", "$search%");
                $query->orWhere("sale_report.employee_name", "LIKE", "%$search%");
                $query->orWhere("sale_report.product_name", "LIKE", "$search%");
            });
        }

        if (!empty($machine_id)) {
            $model  = $model->where("sale_report.machine_id", $machine_id);
        }

        if ($start_date && !empty($start_date) && $end_date && !empty($end_date)) {
            $model  = $model->whereDate("sale_report.timestamp", ">=", $start_date);
            $model  = $model->whereDate("sale_report.timestamp", "<=", $end_date);
        }

        switch ($this->request->type) {
            case 'machine':
                $model->where("sale_report.machine_id", $value);
                break;
            case 'product':
                $model->where("sale_report.product_id", $value);
                break;
            case 'employee':
                $model->where("sale_report.employee_id", $value);
                break;
            default:
                $model->whereRaw("IF(sale_report.pickup_or_return=-1,'Pickup','Return')='$value'");
                break;
        }

        if ($type === "machine") {
            $model          = $model->orderBy('sale_report.machine_name', "ASC");
        } else if ($type === "employee") {
            $model          = $model->orderBy("sale_report.employee_name", "DESC");
        } else if ($type === "product") {
            $model          = $model->orderBy("sale_report.product_name", "ASC");
        } else {
            $model->orderBy("IF(sale_report.pickup_or_return=-1,'Pickup','Return') as pickup_or_return", "ASC");
        }
        $model              = $model->groupBy("sale_report.id")->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/expiry/products",
     *     summary="Reports Expiry Products Latest",
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function expiryProducts($machines)
    {
        $type           = $this->request->type;
        $machine_id     = $this->request->machine_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $search         = $this->request->search;

        switch ($this->request->type) {
            case 'machine':
                $select     = "machine_product_map.machine_id, machine.machine_name";
                $groupBy    = "machine_product_map.machine_id";
                break;
            case 'product':
                $select     = "machine_product_map.product_id, machine_product_map.product_name";
                $groupBy    = "machine_product_map.product_id";
                break;
            case 'expiry':
                $select     = "product.product_batch_expiray_date";
                $groupBy    = "product.product_batch_expiray_date";
                break;
            case 'category':
                $select     = "machine_product_map.category_id, machine_product_map.category_name";
                $groupBy    = "machine_product_map.category_id";
                break;
            case 'quantity':
                $select     = "machine_product_map.product_quantity";
                $groupBy    = "machine_product_map.product_quantity";
                break;
            default:
                $select     = "machine_product_map.machine_id, machine.machine_name";
                $groupBy    = "machine_product_map.machine_id";
                break;
        }

        $model          = MachineProductMap::selectRaw($select);

        $model->leftJoin("product", function ($join) {
            $join->on("machine_product_map.product_id", "=", "product.product_id");
            $join->on("machine_product_map.client_id", "=", "product.client_id");
        });

        $model->leftJoin("machine", "machine.id", "=", "machine_product_map.machine_id");

        $model->whereNotNull("product.product_batch_expiray_date");

        if (!empty($start_date) && !empty($end_date)) {
            $model->WhereDate("product.created_at", ">=", $start_date);
            $model->WhereDate("product.created_at", "<=", $end_date);
        }

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->where('machine_product_map.product_name', 'like', "$search%");
                $query->orWhere('machine.machine_name', 'like', "$search%");
            });
        }

        if ($machine_id > 0) {
            $model->where("machine_product_map.machine_id", $machine_id);
        }

        if ($this->client_id > 0) {
            $model->whereIn("machine_product_map.machine_id", $machines);
        }

        $model->groupBy($groupBy);

        $model->orderBy("machine_product_map.id", "DESC");

        $model = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/expiry/products/data",
     *     summary="Reports Expiry Products",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2020-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=196),
     *              @OA\Property(property="type", type="string", example=""),
     *              @OA\Property(property="value", type="string", example=""),
     *              @OA\Property(property="search", type="string", example="")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function expiryProductsData($machines)
    {
        $type           = $this->request->type;
        $value          = $this->request->value;
        $machine_id     = $this->request->machine_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $search         = $this->request->search;

        $model          = MachineProductMap::selectRaw("machine_product_map.id,machine_product_map.updated_at,machine_product_map.machine_id,  machine.machine_name, machine_product_map.product_id, machine_product_map.product_name, product.product_batch_no, machine_product_map.product_quantity, product.product_batch_expiray_date, GROUP_CONCAT(machine_product_map.product_location) as aisles, product.discount_price, product.product_discount_type, product.product_discount_code, machine_product_map.product_price, IF(TIMESTAMPDIFF(DAY,NOW(),product.product_batch_expiray_date)>0,CONCAT(TIMESTAMPDIFF(DAY,NOW(),product.product_batch_expiray_date),' Days'),'EXPIRED') as days_remaining");

        $model->leftJoin("product", function ($join) {
            $join->on("machine_product_map.product_id", "=", "product.product_id");
            $join->on("machine_product_map.client_id", "=", "product.client_id");
        });

        $model->leftJoin("machine", "machine.id", "=", "machine_product_map.machine_id");

        $model->whereNotNull("product.product_batch_expiray_date");

        if (!empty($start_date) && !empty($end_date)) {
            $model->WhereDate("product.created_at", ">=", $start_date);
            $model->WhereDate("product.created_at", "<=", $end_date);
        }

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->where('machine_product_map.product_name', 'like', "$search%");
                $query->orWhere('machine.machine_name', 'like', "$search%");
            });
        }

        if ($machine_id > 0) {
            $model->where("machine_product_map.machine_id", $machine_id);
        }

        if ($this->client_id > 0) {
            $model->whereIn("machine_product_map.machine_id", $machines);
        }

        switch ($this->request->type) {
            case 'machine':
                $model->where("machine_product_map.machine_id", $value);
                break;
            case 'product':
                $model->where("machine_product_map.product_id", $value);
                break;
            case 'expiry':
                $model->where("machine_product_map.product_batch_expiray_date", $value);
                break;
            case 'category':
                $model->where("machine_product_map.category_id", $value);
                break;
            case 'quantity':
                $model->where("machine_product_map.product_quantity", $value);
                break;
            default:
                $model->where("machine_product_map.machine_id", $value);
                break;
        }

        $model->groupBy("machine_product_map.machine_id", "machine_product_map.product_id");

        $model->orderBy("machine_product_map.id", "DESC");

        $model = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/vend/error",
     *     summary="Reports Vend Error",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function vend_error($machines)
    {
        $client_id          = $this->client_id;
        $start_date         = $this->request->start_date;
        $end_date           = $this->request->end_date;
        $machine_id         = $this->request->machine_id;
        $type               = $this->request->type;
        $search             = $this->request->search;

        $select = $groupBy = "";

        switch ($type) {
            case 'machine':
                $select     = "machine_id,machine_name";
                $groupBy    = "machine_id";
                break;
            case 'errors':
                $select = "error_code";
                $groupBy = "error_code";
                break;
            default:
                $select = "machine_id,machine_name";
                $groupBy = "error_code";
                break;
        }
        $model              = LocationNonFunctional::selectRaw($select);
        $model->where("location_non_functional.is_deleted", 0);

        if ($client_id > 0) {
            $model->whereIn("location_non_functional.machine_id", $machines);
        }

        if ($machine_id && $machine_id > 0) {
            $model->where("location_non_functional.id", $machine_id);
        }

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->where("location_non_functional.machine_name", "like", "$search%");
                $query->orWhere("location_non_functional.error_code", "like", "$search%");
            });
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model->whereDate("location_non_functional.timestamp", ">=", $start_date);
            $model->whereDate("location_non_functional.timestamp", "<=", $end_date);
        }

        if ($client_id > 0) {
            $model->whereIn('location_non_functional.machine_id', $machines);
        }

        $model->groupBy($groupBy);

        $model              = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/vend/error/data",
     *     summary="Reports Vend Error",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function vend_errorData($machines)
    {
        $client_id          = $this->client_id;
        $start_date         = $this->request->start_date;
        $end_date           = $this->request->end_date;
        $machine_id         = $this->request->machine_id;
        $type               = $this->request->type;
        $value              = $this->request->value;
        $search             = $this->request->search;

        $model              = LocationNonFunctional::select(DB::raw("location_non_functional.*"), "machine.machine_name");
        $model->leftJoin("machine", "machine.id","=","location_non_functional.machine_id");
        $model->where("location_non_functional.is_deleted", 0);

        if ($client_id > 0) {
            $model->whereIn("location_non_functional.machine_id", $machines);
        }

        if ($machine_id && $machine_id > 0) {
            $model->where("location_non_functional.id", $machine_id);
        }

        if (in_array($type, ["all_errors", "machine"]) && $search != "") {
            $model->where(function ($query) use ($search) {
                $query->where("location_non_functional.machine_name", "like", "$search%");
                $query->orWhere("location_non_functional.error_code", "like", "$search%");
            });
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model->whereDate("location_non_functional.timestamp", ">=", $start_date);
            $model->whereDate("location_non_functional.timestamp", "<=", $end_date);
        }

        switch ($type) {
            case 'machine':
                $model->where("location_non_functional.machine_id", $value);
                break;
            case 'errors':
                $model->where("location_non_functional.error_code", $value);
                break;
            default:
                $model->where("location_non_functional.machine_id", $value);
                break;
        }

        if ($client_id > 0) {
            $model          = $model->whereIn('location_non_functional.machine_id', $machines);
        }

        if ($type === "machine") {
            $model              = $model->orderBy("machine.machine_name", "ASC");
        } else {
            $model              = $model->orderBy("location_non_functional.error_code", "ASC");
        }

        $model              = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/feedback",
     *     summary="Reports Feedback Latest",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function feedback()
    {
        $client_id          = $this->client_id;
        $start_date         = $this->request->start_date;
        $end_date           = $this->request->end_date;
        $machine_id         = $this->request->machine_id;
        $type               = $this->request->type;
        $search             = $this->request->search;

        $select = $groupBy = "";

        switch ($type) {
            case 'machine':
                $select     = "feedback.machine_id,machine.machine_name";
                $groupBy    = "feedback.machine_id";
                break;
            case 'product':
                $select     = "feedback.product_id,feedback.product_name";
                $groupBy    = "feedback.product_id";
                break;
            case 'feedback_type':
                $select     = "feedback.complaint_type,feedback.complaint";
                $groupBy    = "feedback.complaint_type";
                break;
            case 'customer':
                $select     = "feedback.customer_name";
                $groupBy    = "feedback.customer_name";
                break;
            case 'location':
                $select     = "feedback.location";
                $groupBy    = "feedback.location";
                break;
            default:
                $select = "feedback.timestamp";
                $groupBy = "DATE(feedback.timestamp)";
                break;
        }

        $model              = Feedback::selectRaw($select);
        $model->leftJoin("product", "product.id", "=", "feedback.product_id");
        $model->leftJoin("machine", "machine.id", "=", "feedback.machine_id");
        $model->leftJoin("client", "client.id", "=", "feedback.client_id");
        $model->where("feedback.is_deleted", 0);
        $model->whereNotNull("feedback.transaction_id");

        if ($client_id > 0) {
            $model->where("feedback.client_id", $client_id);
        }

        if (!empty($search)) {
            $model->where(function ($query) use ($search, $type) {
                if ($type == "machine") {
                    $query->where('feedback.machine_name', 'like', $search . '%');
                } else if ($type == "product") {
                    $query->where('feedback.product_name', 'like', $search . '%');
                } else if ($type == "feedback_type") {
                    $query->where('feedback.complaint', 'like', $search . '%');
                } else {
                    $query->where('feedback.machine_name', 'like', $search . '%');
                    $query->orWhere('feedback.customer_name', 'like', $search . '%');
                }
            });
        }

        if ($machine_id && $machine_id > 0) {
            $model->where("feedback.machine_id", $machine_id);
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model->whereDate('feedback.timestamp', ">=", $start_date);
            $model->whereDate('feedback.timestamp', "<=", $end_date);
        }
        if ($this->client_id > 0) {
            $model->whereIn("feedback.machine_id", $machines);
        }
        $model->groupByRaw($groupBy);
        if ($type === "location") {
            $model->orderBy('machine.machine_address', "DESC");
        } else if ($type === "most_recent") {
            $model->orderBy('feedback.feedback_id', "DESC");
        } else if ($type === "time_past") {
            $model->orderBy('feedback.feedback_id', "ASC");
        } else if ($type === "customer") {
            $model->orderBy('feedback.customer_name', "DESC");
        } else if ($type === "feedback_type") {
            $model->orderBy('feedback.feedback', "DESC");
        } else if ($type === "machine") {
            $model->orderBy('feedback.machine_name', "DESC");
        } else if ($type === "product") {
            $model->orderBy('feedback.product_name', "DESC");
        }
        $model = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/feedback/data",
     *     summary="Latest Reports Feedback Data",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function feedbackData()
    {
        $client_id          = $this->client_id;
        $start_date         = $this->request->start_date;
        $end_date           = $this->request->end_date;
        $machine_id         = $this->request->machine_id;
        $type               = $this->request->type;
        $value              = $this->request->value;
        $search             = $this->request->search;

        $model              = Feedback::select("feedback.*", "machine.machine_address", "product.product_name as product_name", "machine.machine_name as machine_name", "client.client_name as client_name");
        $model->leftJoin("product", "product.id", "=", "feedback.product_id");
        $model->leftJoin("machine", "machine.id", "=", "feedback.machine_id");
        $model->leftJoin("client", "client.id", "=", "feedback.client_id");
        $model->where("feedback.is_deleted", 0);
        $model->whereNotNull("feedback.transaction_id");

        if ($client_id > 0) {
            $model->where("feedback.client_id", $client_id);
        }

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->where('feedback.machine_name', 'like', $search . '%');
                $query->orWhere('feedback.product_name', 'like', $search . '%');
                $query->orWhere('feedback.complaint', 'like', $search . '%');
                $query->orWhere('feedback.customer_name', 'like', $search . '%');
            });
        }

        if ($machine_id && $machine_id > 0) {
            $model->where("feedback.machine_id", $machine_id);
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model->whereDate('feedback.timestamp', ">=", $start_date);
            $model->whereDate('feedback.timestamp', "<=", $end_date);
        }
        if ($this->client_id > 0) {
            $model->whereIn("feedback.machine_id", $machines);
        }

        switch ($type) {
            case 'machine':
                $model->where("feedback.machine_id", $value);
                break;
            case 'product':
                $model->where("feedback.product_id", $value);
                break;
            case 'feedback_type':
                $model->where("feedback.complaint_type", $value);
                break;
            case 'customer':
                $model->where("feedback.customer_name", $value);
                break;
            case 'location':
                $model->where("feedback.location", $value);
                break;
            default:
                $model->whereRaw("DATE(feedback.timestamp) = '$value'");
                break;
        }

        if ($type === "location") {
            $model->orderBy('machine.machine_address', "DESC");
        } else if ($type === "most_recent") {
            $model->orderBy('feedback.feedback_id', "DESC");
        } else if ($type === "time_past") {
            $model->orderBy('feedback.feedback_id', "ASC");
        } else if ($type === "customer") {
            $model->orderBy('feedback.customer_name', "DESC");
        } else if ($type === "feedback_type") {
            $model->orderBy('feedback.feedback', "DESC");
        } else if ($type === "machine") {
            $model->orderBy('feedback.machine_name', "DESC");
        } else if ($type === "product") {
            $model->orderBy('feedback.product_name', "DESC");
        }
        $model = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/email",
     *     summary="Latest Reports Email",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function getEmail()
    {
        $client_id  = $this->client_id;
        $type       = $this->request->type;
        $search     = $this->request->search;
        $start_date = $this->request->start_date;
        $end_date   = $this->request->end_date;
        switch ($type) {
            case 'type':
                $select     = "type";
                $groupBy    = "type";
                break;
            case 'frequency':
                $select     = "frequency";
                $groupBy    = "frequency";
                break;
            default:
                $select = "timestamp";
                $groupBy = "DATE(timestamp)";
                break;
        }
        $model      = ReportEmail::selectRaw($select)->whereDate("timestamp", ">=", $start_date)->whereDate("timestamp", "<=", $end_date);

        if ($client_id > 0) {
            $model->where("client_id", $client_id);
        }

        if (!empty($search)) {
            $model->where("email", "like", "%$search%");
        }

        if (!empty($type)) {
            $model->where($type, $type);
        }

        $model->groupByRaw($groupBy);

        $model = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/email/data",
     *     summary="Latest Reports Email Data",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="type", type="string", example=""),
     *              @OA\Property(property="value", type="string", example=""),
     *              @OA\Property(property="search", type="string", example="")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function getEmailData()
    {
        $client_id  = $this->client_id;
        $type       = $this->request->type;
        $value      = $this->request->value;
        $search     = $this->request->search;
        $start_date = $this->request->start_date;
        $end_date   = $this->request->end_date;

        $model      = ReportEmail::whereDate("timestamp", ">=", $start_date)->whereDate("timestamp", "<=", $end_date);

        if ($client_id > 0) {
            $model->where("client_id", $client_id);
        }

        if (!empty($search)) {
            $model->where("email", "like", "%$search%");
        }

        if (!empty($type)) {
            $model->where($type, $value);
        }

        $model = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/staff",
     *     summary="Latest Reports Staff",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=190),
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function staff($machines)
    {
        $client_id      = $this->client_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $machine_id     = $this->request->machine_id;
        $type           = $this->request->type;
        $search         = $this->request->search;

        $select = $groupBy = "";
        switch ($type) {
            case 'machine':
                $select     = "employee_transaction.machine_id,employee_transaction.machine_name";
                $groupBy    = "employee_transaction.machine_id";
                break;
            case 'product':
                $select     = "employee_transaction.product_id,employee_transaction.product_name";
                $groupBy    = "employee_transaction.product_id";
                break;
            case 'employee':
                $select     = "employee_transaction.employee_id,employee_transaction.employee_name";
                $groupBy    = "employee_transaction.employee_id";
                break;
            default:
                $select = "employee_transaction.timestamp";
                $groupBy = "DATE(employee_transaction.timestamp)";
                break;
        }

        $model          = EmployeeTransaction::selectRaw($select);

        $model->leftJoin("client", "client.id", "=", "employee_transaction.client_id");

        $model->leftJoin("product", function ($join) {
            $join->on("product.id", "=", "employee_transaction.product_id");
            $join->on("product.client_id", "=", "employee_transaction.client_id");
        });

        $model->where("employee_transaction.is_deleted", 0);

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->where("employee_transaction.transaction_id", "LIKE", "$search%");
                $query->orWhere("employee_transaction.employee_id", "LIKE", "$search%");
                $query->orWhere("employee_transaction.employee_full_name", "LIKE", "%$search%");
                $query->orWhere("employee_transaction.product_id", "LIKE", "$search%");
                $query->orWhere("employee_transaction.product_name", "LIKE", "$search%");
                $query->orWhere("employee_transaction.machine_name", "LIKE", "$search%");
            });
        }

        if ($client_id > 0) {
            $model->whereIn("employee_transaction.machine_id", $machines);
        }

        if ($machine_id > 0) {
            $model->where("employee_transaction.machine_id", $machine_id);
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model->whereDate("employee_transaction.timestamp", ">=", $start_date);
            $model->whereDate("employee_transaction.timestamp", "<=", $end_date);
        }

        $model->groupByRaw($groupBy);

        if ($type === "machine") {
            $model->orderBy("machine_name", "DESC");
        } else if ($type === "product") {
            $model->orderBy("product_name", "DESC");
        } else if ($type === "employee") {
            $model->orderBy("employee_full_name", "DESC");
        } else {
            $model->orderBy("timestamp", "DESC");
        }
        $model = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/staff/data",
     *     summary="Latest Reports Staff Data",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=190),
     *              @OA\Property(property="type", type="string", example=""),
     *              @OA\Property(property="value", type="string", example=""),
     *              @OA\Property(property="search", type="string", example="")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function staffData($machines)
    {
        $client_id      = $this->client_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $machine_id     = $this->request->machine_id;
        $type           = $this->request->type;
        $value          = $this->request->value;
        $search         = $this->request->search;

        $model          = EmployeeTransaction::select("employee_transaction.machine_id", "employee_transaction.id", "employee_transaction.transaction_id", "employee_transaction.job_number", "employee_transaction.cost_center", "employee_transaction.employee_id", "employee_transaction.employee_full_name", "employee_transaction.product_id", "employee_transaction.product_name", "client.client_name as client_name", "product.product_sku as product_sku", "employee_transaction.machine_name", "employee_transaction.pickup_or_return", "employee_transaction.timestamp");

        $model->leftJoin("client", "client.id", "=", "employee_transaction.client_id");

        $model->leftJoin("product", function ($join) {
            $join->on("product.id", "=", "employee_transaction.product_id");
            $join->on("product.client_id", "=", "employee_transaction.client_id");
        });

        $model->where("employee_transaction.is_deleted", 0);

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->where("employee_transaction.transaction_id", "LIKE", "$search%");
                $query->orWhere("employee_transaction.employee_id", "LIKE", "$search%");
                $query->orWhere("employee_transaction.employee_full_name", "LIKE", "%$search%");
                $query->orWhere("employee_transaction.product_id", "LIKE", "$search%");
                $query->orWhere("employee_transaction.product_name", "LIKE", "$search%");
                $query->orWhere("employee_transaction.machine_name", "LIKE", "$search%");
            });
        }

        if ($client_id > 0) {
            $model->whereIn("employee_transaction.machine_id", $machines);
        }

        if ($machine_id > 0) {
            $model->where("employee_transaction.machine_id", $machine_id);
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model->whereDate("employee_transaction.timestamp", ">=", $start_date);
            $model->whereDate("employee_transaction.timestamp", "<=", $end_date);
        }

        switch ($type) {
            case 'machine':
                $model->where("employee_transaction.machine_id", $value);
                break;
            case 'product':
                $model->where("employee_transaction.product_id", $value);
                break;
            case 'employee':
                $model->where("employee_transaction.employee_id", $value);
                break;
            default:
                $model->whereRaw("DATE(employee_transaction.timestamp)='$value'");
                break;
        }

        $model->groupBy("employee_transaction.id");

        if ($type === "machine") {
            $model->orderBy("machine_name", "DESC");
        } else if ($type === "product") {
            $model->orderBy("product_name", "DESC");
        } else if ($type === "employee") {
            $model->orderBy("employee_full_name", "DESC");
        } else {
            $model->orderBy("timestamp", "DESC");
        }
        $model = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/service",
     *     summary="Latest Reports Service",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=190),
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function service($machines)
    {
        $client_id      = $this->client_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $machine_id     = $this->request->machine_id;
        $type           = $this->request->type;
        $search         = $this->request->search;
        switch ($type) {
            case 'machine':
                $select     = "service_report.machine_id,service_report.machine_name";
                $groupBy    = "service_report.machine_id";
                break;
            case 'product':
                $select     = "service_report.product_id,service_report.product_name";
                $groupBy    = "service_report.product_id";
                break;
            default:
                $select = "service_report.created_at";
                $groupBy = "DATE(service_report.created_at)";
                break;
        }

        $model          = ServiceReport::selectRaw($select)->whereDate("created_at", ">=", $start_date)->whereDate("created_at", "<=", $end_date);

        if (!empty($machine_id)) {
            $model = $model->where("machine_id", $machine_id);
        }

        if ($client_id > 0) {
            $model = $model->whereIn("machine_id", $machines);
        }

        if (!empty($search)) {
            $model->where("service_report.machine_name", "like", "$search%");
            $model->where("service_report.product_name", "like", "$search%");
        }

        $model->groupBy($groupBy)->orderBy("created_at", "DESC");

        $model = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/service/data",
     *     summary="Latest Reports Service Data",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=190),
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function serviceData($machines)
    {
        $client_id      = $this->client_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $machine_id     = $this->request->machine_id;
        $type           = $this->request->type;
        $search         = $this->request->search;

        $model          = ServiceReport::whereDate("created_at", ">=", $start_date)->whereDate("created_at", "<=", $end_date);

        if (!empty($machine_id)) {
            $model = $model->where("machine_id", $machine_id);
        }

        if ($client_id > 0) {
            $model = $model->whereIn("machine_id", $machines);
        }

        if (!empty($search)) {
            $model->where("service_report.machine_name", "like", "$search%");
            $model->where("service_report.product_name", "like", "$search%");
        }

        switch ($type) {
            case 'machine':
                $model->where("service_report.machine_id", $value);
                break;
            case 'product':
                $model->where("service_report.product_id", $value);
                break;
            default:
                $model->whereRaw("DATE(service_report.created_at)='$value'");
                break;
        }

        $model->orderBy("created_at", "DESC");

        $model = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/receipts",
     *     summary="Latest Reports Customer",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=190),
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function receipts($machines)
    {
        $client_id      = $this->client_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $machine_id     = $this->request->machine_id;
        $type           = $this->request->type;
        $search         = $this->request->search;

        switch ($type) {
            case 'machine':
                $select     = "receipts.machine_id,machine.machine_name";
                $groupBy    = "receipts.machine_id";
                break;
            case 'customer':
                $select     = "receipts.name";
                $groupBy    = "receipts.name";
                break;
            default:
                $select     = "receipts.machine_id,machine.machine_name";
                $groupBy    = "receipts.machine_id";
                break;
        }

        $model          = Receipts::selectRaw($select)->leftJoin("machine", "machine.id", "=", "receipts.machine_id")->whereDate("receipts.created_at", ">=", $start_date)->whereDate("receipts.created_at", "<=", $end_date);

        if (!empty($machine_id)) {
            $model = $model->where("machine_id", $machine_id);
        }

        if ($client_id > 0) {
            $model = $model->whereIn("machine_id", $machines);
        }

        if (!empty($search)) {
            $model->where("machine.machine_name", "like", "$search%");
            $model->where("receipts.product", "like", "$search%");
        }

        $model->groupBy($groupBy)->orderBy("receipts.created_at", "DESC");

        $model = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/receipts/data",
     *     summary="Latest Reports Customer Data",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=190),
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function receiptsData($machines)
    {
        $client_id      = $this->client_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $machine_id     = $this->request->machine_id;
        $type           = $this->request->type;
        $search         = $this->request->search;

        $model          = Receipts::select("receipts.*", "machine.machine_name")->leftJoin("machine", "machine.id", "=", "receipts.machine_id")->whereDate("receipts.created_at", ">=", $start_date)->whereDate("receipts.created_at", "<=", $end_date);

        if (!empty($machine_id)) {
            $model = $model->where("machine_id", $machine_id);
        }

        if ($client_id > 0) {
            $model = $model->whereIn("machine_id", $machines);
        }

        if (!empty($search)) {
            $model->where("machine.machine_name", "like", "$search%");
            $model->where("receipts.product", "like", "$search%");
        }

        switch ($type) {
            case 'machine':
                $model->where("receipts.machine_id", $value);
                break;
            case 'customer':
                $model->where("receipts.name", $value);
                break;
            default:
                $model->where("receipts.machine_id", $value);
                break;
        }

        $model->orderBy("receipts.created_at", "DESC");

        $model = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/gift",
     *     summary="Latest Reports Gift",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=190),
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function gift($machines)
    {
        $client_id      = $this->client_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $machine_id     = $this->request->machine_id;
        $type           = $this->request->type;
        $search         = $this->request->search;

        switch ($type) {
            case 'machine':
                $select     = "gift_report.machine_id,machine.machine_name";
                $groupBy    = "gift_report.machine_id";
                break;
            case 'product':
                $select     = "gift_report.product_id,gift_report.product_name";
                $groupBy    = "gift_report.product_id";
                break;
            case 'customer':
                $select     = "gift_report.name";
                $groupBy    = "gift_report.name";
                break;
            default:
                $select     = "gift_report.timestamp";
                $groupBy    = "DATE(gift_report.timestamp)";
                break;
        }

        $model          = GiftReport::selectRaw($select)->leftJoin("machine", "machine.id", "=", "gift_report.machine_id")->whereDate("gift_report.timestamp", ">=", $start_date)->whereDate("gift_report.timestamp", "<=", $end_date);

        if (!empty($machine_id)) {
            $model = $model->where("machine_id", $machine_id);
        }

        if ($client_id > 0) {
            $model = $model->whereIn("machine_id", $machines);
        }

        if (!empty($search)) {
            $model->where("machine.machine_name", "like", "$search%");
            $model->where("gift_report.product", "like", "$search%");
        }

        $model->groupBy($groupBy)->orderBy("gift_report.timestamp", "DESC");

        $model = $model->paginate($this->request->length ?? 50);
        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/gift/data",
     *     summary="Latest Reports Gift Data ",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=190),
     *              @OA\Property(property="type", type="string", example=""),
     *              @OA\Property(property="value", type="string", example=""),
     *              @OA\Property(property="search", type="string", example="")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function giftData($machines)
    {
        $client_id      = $this->client_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $machine_id     = $this->request->machine_id;
        $type           = $this->request->type;
        $value          = $this->request->value;
        $search         = $this->request->search;

        $model          = GiftReport::select("gift_report.*", "machine.machine_name")->leftJoin("machine", "machine.id", "=", "gift_report.machine_id")->whereDate("gift_report.timestamp", ">=", $start_date)->whereDate("gift_report.timestamp", "<=", $end_date);

        if (!empty($machine_id)) {
            $model->where("machine_id", $machine_id);
        }

        if ($client_id > 0) {
            $model->whereIn("machine_id", $machines);
        }


        if (!empty($search)) {
            $model->where("machine.machine_name", "like", "$search%");
            $model->where("gift_report.product", "like", "$search%");
        }

        switch ($type) {
            case 'machine':
                $model->where("gift_report.machine_id", $value);
                break;
            case 'product':
                $model->where("gift_report.product_id", $value);
                break;
            case 'customer':
                $model->where("gift_report.name", $value);
                break;
            default:
                $model->whereRaw("DATE(gift_report.timestamp)='$value'");
                break;
        }

        $model->orderBy("gift_report.timestamp", "DESC");

        $model = $model->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/payment",
     *     summary="Latest Reports Payment",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=190),
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function payment()
    {
        $client_id      = $this->client_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $machine_id     = $this->request->machine_id;
        $type           = $this->request->type;
        $search         = $this->request->search;

        $summary        = Transaction::selectRaw("remote_vend_log.pay_method, COUNT(*) as total_qty, FORMAT(SUM(transactions.amount),2) as total_amount, SUM(IF(transactions.payment_status='SUCCESS',transactions.amount,0)) as ok_amount, SUM(IF(transactions.payment_status='SUCCESS',1,0)) as ok_qty, SUM(IF(transactions.payment_status='FAILED',transactions.amount,0)) as failed_amount, SUM(IF(transactions.payment_status='FAILED',1,0)) as failed_qty");
        $summary->leftJoin("remote_vend_log", "remote_vend_log.vend_id", "=", "transactions.vend_uuid");
        $summary->whereDate("transactions.created_at", ">=", $start_date)->whereDate("transactions.created_at", "<=", $end_date);

        $failedSummary  = Transaction::selectRaw("remote_vend_log.pay_method, FORMAT(SUM(transactions.amount),2) as total_amount, COUNT(*) as qty");
        $failedSummary->leftJoin("remote_vend_log", "remote_vend_log.vend_id", "=", "transactions.vend_uuid");
        $failedSummary->whereDate("transactions.created_at", ">=", $start_date)->whereDate("transactions.created_at", "<=", $end_date);

        $badges        = Transaction::selectRaw("SUM(IF(remote_vend_log.status='2',1,0)) as successfull_vends, SUM(IF(remote_vend_log.status NOT IN ('0','1','2','11'),1,0)) as failed_vends, FORMAT(SUM(transactions.amount),2) as total_payments, FORMAT(SUM(IF(transactions.payment_status='SUCCESS',transactions.amount,0)),2) as successfull_payments, FORMAT(SUM(IF(transactions.payment_status='FAILED',transactions.amount,0)),2) as failed_payments");
        $badges->leftJoin("remote_vend_log", "remote_vend_log.vend_id", "=", "transactions.vend_uuid");
        $badges->whereDate("transactions.created_at", ">=", $start_date)->whereDate("transactions.created_at", "<=", $end_date);

        switch ($type) {
            case 'machine':
                $select     = "remote_vend_log.machine_id,remote_vend_log.machine_name";
                $groupBy    = "remote_vend_log.machine_id";
                break;
            case 'product':
                $select     = "remote_vend_log.product_id,remote_vend_log.product_name";
                $groupBy    = "remote_vend_log.product_id";
                break;
            case 'payment_status':
                $select     = "transactions.payment_status";
                $groupBy    = "transactions.payment_status";
                break;
            case 'vend_status':
                $select     = "remote_vend_log.status";
                $groupBy    = "remote_vend_log.status";
                break;
            case 'pay_method':
                $select     = "remote_vend_log.pay_method";
                $groupBy    = "remote_vend_log.pay_method";
                break;
            default:
                $select     = "transactions.created_at";
                $groupBy    = "DATE(transactions.created_at)";
                break;
        }

        $model         = Transaction::selectRaw($select);
        $model->leftJoin("remote_vend_log", "remote_vend_log.vend_id", "=", "transactions.vend_uuid");
        $model->whereDate("transactions.created_at", ">=", $start_date)->whereDate("transactions.created_at", "<=", $end_date);

        if ($client_id > 0) {
            $model->whereIn("remote_vend_log.machine_id", $machines);
            $badges->whereIn("remote_vend_log.machine_id", $machines);
            $summary->whereIn("remote_vend_log.machine_id", $machines);
            $failedSummary->whereIn("remote_vend_log.machine_id", $machines);
        }

        if ($machine_id > 0) {
            $model->where("remote_vend_log.machine_id", $machine_id);
            $badges->where("remote_vend_log.machine_id", $machine_id);
            $summary->where("remote_vend_log.machine_id", $machine_id);
            $failedSummary->where("remote_vend_log.machine_id", $machine_id);
        }

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->where("remote_vend_log.machine_name", "LIKE", "$search%");
                $query->orWhere("remote_vend_log.product_name", "LIKE", "$search%");
            });
            $badges->where(function ($query) use ($search) {
                $query->where("remote_vend_log.machine_name", "LIKE", "$search%");
                $query->orWhere("remote_vend_log.product_name", "LIKE", "$search%");
            });
            $summary->where(function ($query) use ($search) {
                $query->where("remote_vend_log.machine_name", "LIKE", "$search%");
                $query->orWhere("remote_vend_log.product_name", "LIKE", "$search%");
            });
            $failedSummary->where(function ($query) use ($search) {
                $query->where("remote_vend_log.machine_name", "LIKE", "$search%");
                $query->orWhere("remote_vend_log.product_name", "LIKE", "$search%");
            });
        }
        $badges         = $badges->first();
        $summary        = $summary->groupBy("remote_vend_log.pay_method")->get();
        $failedSummary  = $failedSummary->groupBy("remote_vend_log.pay_method")->get();
        $model          = $model->groupBy($groupBy)->orderBy("transactions.id", "DESC")->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model, "Success", [
            "badges" => $badges,
            "summary" => $summary,
            "failedSummary" => $failedSummary
        ]);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/payment/data",
     *     summary="Latest/Reports Payment Data",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=190),
     *              @OA\Property(property="type", type="string", example=""),
     *              @OA\Property(property="value", type="string", example=""),
     *              @OA\Property(property="search", type="string", example="")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function paymentData()
    {
        $client_id      = $this->client_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $machine_id     = $this->request->machine_id;
        $type           = $this->request->type;
        $value          = $this->request->value;
        $search         = $this->request->search;

        $model         = Transaction::selectRaw("transactions.id, transactions.vend_uuid,transactions.created_at,transactions.amount,transactions.transaction_id,transactions.status,transactions.payment_status,transactions.type,transactions.response,remote_vend_log.machine_id,remote_vend_log.machine_name,remote_vend_log.client_id,remote_vend_log.client_name,remote_vend_log.product_id,remote_vend_log.product_name,remote_vend_log.pay_method,REPLACE(CONCAT(UPPER(LEFT(remote_vend_log.pay_method, 1)), SUBSTRING(remote_vend_log.pay_method, 2)), '_', ' ') as pay_method_name");
        $model->leftJoin("remote_vend_log", "remote_vend_log.vend_id", "=", "transactions.vend_uuid");
        $model->whereDate("transactions.created_at", ">=", $start_date)->whereDate("transactions.created_at", "<=", $end_date);

        if ($client_id > 0) {
            $model->whereIn("remote_vend_log.machine_id", $machines);
        }

        if ($machine_id > 0) {
            $model->where("remote_vend_log.machine_id", $machine_id);
        }

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->where("remote_vend_log.machine_name", "LIKE", "$search%");
                $query->orWhere("remote_vend_log.product_name", "LIKE", "$search%");
            });
        }
        switch ($type) {
            case 'machine':
                $model->where("remote_vend_log.machine_id", $value);
                break;
            case 'product':
                $model->where("remote_vend_log.product_id", $value);
                break;
            case 'payment_status':
                $model->where("transactions.payment_status", $value);
                break;
            case 'vend_status':
                $model->where("remote_vend_log.status", $value);
                break;
            case 'pay_method':
                $model->where("remote_vend_log.pay_method", $value);
                break;
            default:
                $model->whereraw("DATE(transactions.created_at),'$value'");
                break;
        }

        $model          = $model->orderBy("transactions.id", "DESC")->paginate($this->request->length ?? 50);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/vend/queue",
     *     summary="Latest Reports Vend Queue",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=190),
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
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function vend_queue($machines)
    {
        $client_id      = $this->client_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $machine_id     = $this->request->machine_id;
        $type           = $this->request->type;
        $search         = $this->request->search;

        switch ($type) {
            case 'machine':
                $select     = "remote_vend_log.machine_id,remote_vend_log.machine_name";
                $groupBy    = "remote_vend_log.machine_id";
                break;
            case 'product':
                $select     = "remote_vend_log.product_id,,remote_vend_log.product_name";
                $groupBy    = "remote_vend_log.product_id";
                break;
            case 'status':
                $select     = "remote_vend_log.status";
                $groupBy    = "remote_vend_log.status";
                break;
            case 'pay_method':
                $select     = "remote_vend_log.pay_method";
                $groupBy    = "remote_vend_log.pay_method";
                break;
            case 'name':
                $select     = "remote_vend_log.customer_name";
                $groupBy    = "remote_vend_log.customer_name";
                break;
            default:
                $select     = "remote_vend_log.created_at";
                $groupBy    = "DATE(remote_vend_log.created_at)";
                break;
        }

        $model          = RemoteVend::selectRaw($select)->where("is_deleted", 0);

        if (!empty($start_date) && !empty($end_date)) {
            $model->whereBetween("created_at", [$start_date, $end_date]);
        }

        if (!empty($machine_id)) {
            $model->where("machine_id", $machine_id);
        }

        if ($client_id > 0) {
            $model->whereIn("machine_id", $machines);
        }

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->where("customer_name", "LIKE", "$search%");
                $query->orWhere("product_name", "LIKE", "$search%");
                $query->orWhere("machine_name", "LIKE", "$search%");
            });
        }

        $model->groupBy($groupBy)->orderBy("id", "DESC");
        $model = $model->paginate($this->request->length ?? 50);
        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/latest/reports/vend/queue/data",
     *     summary="Latest Reports Vend Queue Data",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=190),
     *              @OA\Property(property="type", type="string", example=""),
     *              @OA\Property(property="value", type="string", example=""),
     *              @OA\Property(property="search", type="string", example="")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function vend_queueData($machines)
    {
        $client_id      = $this->client_id;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $machine_id     = $this->request->machine_id;
        $type           = $this->request->type;
        $value          = $this->request->value;
        $search         = $this->request->search;

        $model          = RemoteVend::select("*", DB::raw("TIMESTAMPDIFF(MINUTE,created_at,updated_at) as time_diff"))->where("is_deleted", 0);

        if (!empty($start_date) && !empty($end_date)) {
            $model->whereBetween("created_at", [$start_date, $end_date]);
        }

        if (!empty($machine_id)) {
            $model->where("machine_id", $machine_id);
        }

        if ($client_id > 0) {
            $model->whereIn("machine_id", $machines);
        }

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->where("customer_name", "LIKE", "$search%");
                $query->orWhere("product_name", "LIKE", "$search%");
                $query->orWhere("machine_name", "LIKE", "$search%");
            });
        }

        switch ($type) {
            case 'machine':
                $model->where("remote_vend_log.machine_id", $value);
                break;
            case 'product':
                $model->where("remote_vend_log.product_id", $value);
                break;
            case 'status':
                $model->where("remote_vend_log.status", $value);
                break;
            case 'pay_method':
                $model->where("remote_vend_log.pay_method", $value);
                break;
            case 'name':
                $model->where("remote_vend_log.customer_name", $value);
                break;
            default:
                $model->whereRaw("DATE(remote_vend_log.created_at)='$value'");
                break;
        }

        $model->orderBy("id", "DESC");
        $model = $model->paginate($this->request->length ?? 50);
        return $this->controller->sendResponseWithPagination($model);
    }
}
