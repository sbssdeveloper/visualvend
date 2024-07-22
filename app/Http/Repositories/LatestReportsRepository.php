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
        } else {
            $model->where("client_id", $this->request->client_id);
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
                $select     = "sale_report.machine_id, sale_report.machine_name";
                $groupBy    = "sale_report.machine_id";
                break;
            case 'product':
                $select     = "product_id, product_name";
                $groupBy    = "product_id, machine_id";
                break;
            case 'category':
                $select     = "category_id, category_name";
                $groupBy    = "category_id";
                break;
            case 'aisle':
                $select     = $refill_type === "sale" ? "aisle_no as aisle" : "product_location as aisle";
                $groupBy    = $refill_type === "sale" ? "aisle_no" : "product_location";
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
        if ($type === "empty_aisles") {
            $topLow         = $topLow->where("machine_product_map.product_quantity", 0);
            $refill_qty     = $refill_qty->where("machine_product_map.product_quantity", 0);
            $machines       = $machines->where("machine_product_map.product_quantity", 0);
            $vended_qty     = $vended_qty->where("sale_report.aisle_remain_qty", 0);
            if ($refill_type === "sale") {
                $model      = $model->where("sale_report.aisle_remain_qty", 0);
            } else {
                $model      = $model->where("machine_product_map.product_quantity", 0);
            }
        } else if ($type === "part_full_aisles") {
            $topLow         = $topLow->whereRaw("machine_product_map.product_max_quantity - machine_product_map.product_quantity)>0");
            $refill_qty     = $refill_qty->whereRaw("machine_product_map.product_max_quantity - machine_product_map.product_quantity)>0");
            $machines      = $machines->whereRaw("machine_product_map.product_max_quantity - machine_product_map.product_quantity)>0");
            $vended_qty    = $vended_qty->where("sale_report.aisle_remain_qty", ">", 0);
            if ($refill_type === "sale") {
                $model      = $model->where("sale_report.aisle_remain_qty", ">", 0);
            } else {
                $model      = $model->whereRaw("machine_product_map.product_max_quantity - machine_product_map.product_quantity)>0");
            }
        } else if ($type === "full_aisles") {
            $topLow        = $topLow->whereRaw("(`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)=0");
            $refill_qty    = $refill_qty->whereRaw("(`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)=0");
            $machines      = $machines->whereRaw("(`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)=0");
            $vended_qty    = $vended_qty->whereRaw("(`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`)=0");
            if ($refill_type === "sale") {
                $model      = $model->whereRaw("(`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`)=0");
            } else {
                $model      = $model->whereRaw("(`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)=0");
            }
        } else if ($type === "low_stock_aisles") {
            $topLow         = $topLow->whereRaw("(`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>0");
            $refill_qty     = $refill_qty->whereRaw("(`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>0");
            $machines       = $machines->whereRaw("(`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>0");
            $vended_qty     = $vended_qty->whereRaw("(`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`)>0");
            if ($refill_type === "sale") {
                $model      = $model->whereRaw("(`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`)>0");
            } else {
                $model      = $model->whereRaw("(`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>0");
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
            $model         = $model->groupBy($groupBy)->orderBy("sale_report.id", "DESC");
        } else {
            $model         = $model->groupBy($groupBy)->orderBy("refill_qty", "DESC");
        }

        $model          = $model->paginate($this->request->length ?? 10);

        $data =  $this->controller->sendResponseWithPaginationList($model, [
            "type"      => $this->request->type,
            "selector"  => "id",
            "typeArr"   => ["machine", "employee", "product"],
            "keyName"   => $this->request->type === "machine" ? "machine_id" : ($this->request->type === "employee" ? "employee_id" : "product_id"),
            "valName"   => $this->request->type === "machine" ? "machine_name" : ($this->request->type === "employee" ? "employee_name" : "product_name"),
            "extra"     => ["repeated_products"]
        ]);
        $data["total_refills"]          = $refill_qty ?? 0;
        $data["total_machines"]         = $machines;
        $data["top_refilling"]          = $topRefill;
        $data["vended_refills"]         = $vended_new_qty;
        $data["least_refilling"]        = array_reverse($lowRefill);
        return $this->controller->sendResponseReport($data);
    }
}
