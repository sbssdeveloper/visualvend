<?php

namespace App\Http\Repositories;

use DB;
use App\Http\Controllers\Rest\BaseController;
use App\Models\EmployeeTransaction;
use App\Models\Feedback;
use App\Models\LocationNonFunctional;
use App\Models\Machine;
use App\Models\MachineProductMap;
use App\Models\ReportEmail;
use App\Models\Sale;
use Illuminate\Http\Request;

class ReportsRepository
{
    public const _VEND_ERRORS = ["Motor Error", "Out of Stock", "Vend Drop Error", "not correctly vending", "Price Mismatch", "Invalid Aisle", "Stock Mismatch", "Vend Failed", "Sold out", "Controller Error", "Need Service"];

    public $request = null;
    public $controller = null;
    public function __construct(Request $request, BaseController $controller)
    {
        ini_set('memory_limit', '-1');
        $this->request      = $request;
        $this->controller   = $controller;
        $this->role         = $request->auth->role;
        $this->client_id    = $request->auth->client_id;
        $this->admin_id     = $request->auth->admin_id;
    }

    /**
     * @OA\Post(
     *     path="/v1/reports/sales",
     *     summary="Reports Sale",
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
        $model              = Sale::select("*", DB::raw("IF(aisle_no IS NULL,'NA',aisle_no) as aisles"), DB::raw("FORMAT(product_price,2) as price"))->with("product")->where("is_deleted", 0);

        if ($this->client_id > 0) {
            $model          = $model->where("client_id", $this->client_id);
            $total          = $total->where("client_id", $this->client_id);
        }

        if ($this->client_id > 0 && !in_array($this->role, ["Super Admin", "Full Access"])) {
            $model          = $model->where("id NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$this->admin_id)");
            $total          = $total->where("id NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$this->admin_id)");
        }

        if (!empty($search)) {
            $model      = $model->where(function ($query) use ($search) {
                $query->where("product_name", "LIKE", "$search%")->orWhere("machine_name", "LIKE", "$search%")->orWhere("employee_name", "LIKE", "$search%");
            });

            $total      = $total->where(function ($query) use ($search) {
                $query->where("product_name", "LIKE", "$search%")->orWhere("machine_name", "LIKE", "$search%")->orWhere("employee_name", "LIKE", "$search%");
            });
        }

        if (!empty($this->request->machine_id)) {
            $model                  = $model->where("machine_id", $this->request->machine_id);
            $total                  = $total->where("machine_id", $this->request->machine_id);
        } elseif ($this->client_id > 0) {
            $model      = $model->whereIn("machine_id", $machines);
            $total      = $total->whereIn("machine_id", $machines);
        }

        if (!empty($this->request->start_date) && !empty($this->request->end_date)) {
            $model          = $model->whereDate('timestamp', '>=', $this->request->start_date)->whereDate('timestamp', '<=', $this->request->end_date);
            $total          = $total->whereDate('timestamp', '>=', $this->request->start_date)->whereDate('timestamp', '<=', $this->request->end_date);
        }


        if ($this->request->type === "machine") {
            $model          = $model->orderBy('machine_name', "ASC");
        } else if ($this->request->type === "employee") {
            $model          = $model->orderBy("employee_name", "DESC");
        } else if ($this->request->type === "product") {
            $model          = $model->orderBy("product_name", "ASC");
        } else if ($this->request->type === "pickup") {
            $model          = $model->orderBy('pickup_or_return', "ASC");
        } else if ($this->request->type === "return") {
            $model          = $model->orderBy('pickup_or_return', "DESC");
        } else {
            $model          = $model->orderBy('machine_name', "ASC");
        }
        $model              = $model->groupBy("id")->paginate($this->request->length ?? 50);
        $total              = $total->sum("product_price");
        $data =  $this->controller->sendResponseWithPaginationList($model, [
            "type"      => $this->request->type,
            "selector"  => "id",
            "typeArr"   => ["machine", "employee", "product"],
            "keyName"   => $this->request->type === "machine" ? "machine_id" : ($this->request->type === "employee" ? "employee_id" : "product_id"),
            "valName"   => $this->request->type === "machine" ? "machine_name" : ($this->request->type === "employee" ? "employee_name" : "product_name"),
        ]);
        $data["top_selling"] = $this->top_selling($machines);
        if (count($data["top_selling"]) > 0) {
            $data["least_selling"] = $this->least_selling($machines, end($data["top_selling"])["count"] ?? 0);
        } else {
            $data["least_selling"] = [];
        }
        $data["total_sales"] = number_format($total, 2);
        return $this->controller->sendResponseReport($data);
    }

    function top_selling($machines)
    {
        $search = $this->request->search;
        $model  = Sale::select("product_id", "machine_name", "product_name",  DB::raw("count(product_id) as count"))->where("is_deleted", 0);

        if ($this->client_id > 0) {
            $model          = $model->where("client_id", $this->client_id);
        }

        if ($this->client_id > 0 && !in_array($this->role, ["Super Admin", "Full Access"])) {
            $model          = $model->where("id NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$this->admin_id)");
        }

        if (!empty($search)) {
            $model      = $model->where(function ($query) use ($search) {
                $query->where("product_name", "LIKE", "$search%")->orWhere("machine_name", "LIKE", "$search%")->orWhere("employee_name", "LIKE", "$search%");
            });
        }

        if (!empty($this->request->machine_id)) {
            $model                  = $model->where("machine_id", $this->request->machine_id);
        } elseif ($this->client_id > 0) {
            $model      = $model->whereIn("machine_id", $machines);
        }

        if (!empty($this->request->start_date) && !empty($this->request->end_date)) {
            $model          = $model->whereDate('timestamp', '>=', $this->request->start_date)->whereDate('timestamp', '<=', $this->request->end_date);
        }
        $model          = $model->groupBy("product_id")->orderBy("count", "DESC")->limit(5)->get()->toArray();
        return $model;
    }

    function least_selling($machines, $lowerLimit)
    {
        $search = $this->request->search;
        $model  = Sale::select("product_id", "machine_name", "product_name",  DB::raw("count(product_id) as count"))->where("is_deleted", 0);

        if ($this->client_id > 0) {
            $model          = $model->where("client_id", $this->client_id);
        }

        if ($this->client_id > 0 && !in_array($this->role, ["Super Admin", "Full Access"])) {
            $model          = $model->where("id NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$this->admin_id)");
        }

        if (!empty($search)) {
            $model      = $model->where(function ($query) use ($search) {
                $query->where("product_name", "LIKE", "$search%")->orWhere("machine_name", "LIKE", "$search%")->orWhere("employee_name", "LIKE", "$search%");
            });
        }

        if (!empty($this->request->machine_id)) {
            $model                  = $model->where("machine_id", $this->request->machine_id);
        } elseif ($this->client_id > 0) {
            $model      = $model->whereIn("machine_id", $machines);
        }

        if (!empty($this->request->start_date) && !empty($this->request->end_date)) {
            $model          = $model->whereDate('timestamp', '>=', $this->request->start_date)->whereDate('timestamp', '<=', $this->request->end_date);
        }
        $model          = $model->groupBy("product_id")->orderBy("count", "ASC")->having("count", "<", $lowerLimit)->limit(5)->get()->toArray();
        return $model;
    }

    /**
     * @OA\Post(
     *     path="/v1/reports/refill",
     *     summary="Reports Refill",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="timestamp", type="date", example="2024-01-01"),
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=196),
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
        $refills =  $highest = 0;
        $model = null;
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
            $model         = $model->orderBy("sale_report.id", "DESC");
        } else {
            $model         = $model->orderBy("refill_qty", "DESC");
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

    /**
     * @OA\Post(
     *     path="/v1/reports/stock",
     *     summary="Reports Stock",
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

        $model  = Machine::select("machine_product_map.id AS id", "machine.id AS machine_id", "refill_history.aisle_number", "machine.machine_name", "machine_product_map.product_location", "machine_product_map.product_id", DB::raw("IF(machine_product_map.product_id = '', 'Empty', machine_product_map.product_name) AS product_name"), "machine_product_map.product_quantity", "machine_product_map.category_id", "machine_product_map.product_max_quantity", DB::raw("(machine_product_map.product_max_quantity - machine_product_map.product_quantity) AS need_refill_amount"), DB::raw("IF (machine_product_map.product_max_quantity <= 0, 0, FLOOR(machine_product_map.product_quantity / machine_product_map.product_max_quantity * 100)) AS stock_percentage"), DB::raw("SUBSTRING_INDEX(GROUP_CONCAT(refill_history.refill_amount ORDER BY refill_history.id DESC), ',', 1) AS last_refill_amount"), DB::raw("SUBSTRING_INDEX(GROUP_CONCAT(refill_history.created_at ORDER BY refill_history.id DESC), ',', 1) AS last_refill_date"), DB::raw("DATE(SUBSTRING_INDEX(GROUP_CONCAT(refill_history.created_at ORDER BY refill_history.id DESC), ',', 1)) AS last_refill_date_only"))->leftJoin("machine_product_map", "machine_product_map.machine_id", "=", "machine.id")->leftJoin("refill_history", function ($join) {
            $join->on("refill_history.machine_id", "=", "machine_product_map.machine_id");
            $join->on("refill_history.aisle_number", "=", "machine_product_map.product_location");
        })
            ->whereNotNull("machine_product_map.product_id")
            ->where(function ($query) {
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
                $query->where("machine.product_name", "LIKE", "$search%");
                $query->orWhere("machine_product_map.product_name", "LIKE", "$search%");
            });
        }

        if (!empty($start_date)) {
            $model  = $model->whereDate("refill_history.created_at", ">=", $start_date);
            $model  = $model->whereDate("refill_history.created_at", "<=", $end_date);
        }
        if (in_array($type, ["low_stock_products", 'low_stock_aisles'])) {
            $model  = $model->whereRaw("machine_product_map.product_max_quantity-machine_product_map.product_quantity>0");
        } else if ($type == "no_refill_required") {
            $model  = $model->whereRaw("machine_product_map.product_max_quantity-machine_product_map.product_quantity=0");
        } else if (in_array($type, ["empty_items", "empty_aisles"])) {
            $model  = $model->where("machine_product_map.product_quantity", 0);
        }
        $model  = $model->groupByRaw("IFNULL(refill_history.machine_id, machine_product_map.id), IFNULL(refill_history.aisle_number, machine_product_map.id) ORDER BY machine.id ASC")->paginate($this->request->length ?? 10);

        $data =  $this->controller->sendResponseWithPaginationList($model, [
            "type"      => $this->request->type,
            "selector"  => "id",
            "typeArr"   => ["machine", "product", 'category', 'low_stock_products'],
            "keyName"   => $this->request->type === "machine" ? "machine_id" : ($this->request->type === "category" ? "category_id" : "product_id"),
            "valName"   => $this->request->type === "machine" ? "machine_name" : ($this->request->type === "category" ? "category_id" : "product_name"),
        ]);
        return $this->controller->sendResponseReport($data);
    }

    /**
     * @OA\Post(
     *     path="/v1/reports/vend/activity",
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

        $model              = Sale::select("sale_report.employee_id", "sale_report.employee_name", "sale_report.id", "sale_report.timestamp", "sale_report.transaction_id", "sale_report.product_id", "sale_report.machine_id", "sale_report.product_name", "sale_report.machine_name", DB::raw("IF(sale_report.pickup_or_return=-1,'Pickup','Return') as vend_state"), DB::raw("IF(sale_report.transaction_status=2,'Vended Ok','Error') as errror_code"), DB::raw("IF(sale_report.transaction_status=2,'Paid - Vended','Error') as status"), DB::raw("IF(sale_report.aisle_no IS NULL,'NA',sale_report.aisle_no) as aisle_no"), DB::raw("FORMAT(sale_report.product_price,2) as price"), "machine_product_map.product_max_quantity", "machine_product_map.product_quantity")->leftJoin("machine_product_map", function ($join) {
            $join->on("sale_report.product_id", "=", "machine_product_map.product_id");
            $join->on("sale_report.machine_id", "=", "machine_product_map.machine_id");
            $join->on("sale_report.aisle_no", "=", "machine_product_map.product_location");
        })->where("sale_report.is_deleted", 0);

        $sales  = Sale::where("is_deleted", 0);

        $errors = LocationNonFunctional::selectRaw("COUNT(location_non_functional.id) as count, SUM(CASE WHEN LOCATE('Cancel', error_code) THEN 1 ELSE 0 END) AS cancelled")->leftJoin("machine", "machine.id", "=", "location_non_functional.machine_id");

        if ($client_id > 0) {
            $sales          = $sales->whereIn("machine_id", $machines);
            $model          = $model->whereIn("sale_report.machine_id", $machines);
            $errors         = $errors->whereIn("machine.id", $machines);
        }

        if (!empty($search)) {
            $sales  = $sales->where(function ($query) use ($search) {
                $query->where("machine_name", "LIKE", "$search%");
                $query->orWhere("employee_name", "LIKE", "%$search%");
                $query->orWhere("product_name", "LIKE", "$search%");
            });

            $model  = $model->where(function ($query) use ($search) {
                $query->where("sale_report.machine_name", "LIKE", "$search%");
                $query->orWhere("sale_report.employee_name", "LIKE", "%$search%");
                $query->orWhere("sale_report.product_name", "LIKE", "$search%");
            });

            $errors  = $errors->where(function ($query) use ($search) {
                $query->where("location_non_functional.machine_name", "LIKE", "$search%");
                $query->orWhere("location_non_functional.product_name", "LIKE", "$search%");
            });
        }

        if (!empty($machine_id)) {
            $sales  = $sales->where("sale_report.machine_id", $machine_id);
            $model  = $model->where("sale_report.machine_id", $machine_id);
            $errors = $errors->where("location_non_functional.machine_id", $machine_id);
        }

        if ($start_date && !empty($start_date) && $end_date && !empty($end_date)) {
            $sales  = $sales->whereDate("sale_report.timestamp", ">=", $start_date);
            $sales  = $sales->whereDate("sale_report.timestamp", "<=", $end_date);
            $model  = $model->whereDate("sale_report.timestamp", ">=", $start_date);
            $model  = $model->whereDate("sale_report.timestamp", "<=", $end_date);
            $errors = $errors->whereDate("location_non_functional.timestamp", ">=", $start_date);
            $errors = $errors->whereDate("location_non_functional.timestamp", "<=", $end_date);
        }
        $errors     = $errors->first();
        if ($type === "machine") {
            $model          = $model->orderBy('sale_report.machine_name', "ASC");
        } else if ($type === "employee") {
            $model          = $model->orderBy("sale_report.employee_name", "DESC");
        } else if ($type === "product") {
            $model          = $model->orderBy("sale_report.product_name", "ASC");
        } else if ($type === "pickup") {
            $model          = $model->orderBy('sale_report.pickup_or_return', "ASC");
        } else if ($type === "return") {
            $model          = $model->orderBy('sale_report.pickup_or_return', "DESC");
        } else {
            $model          = $model->orderBy('sale_report.machine_name', "ASC");
        }
        $model              = $model->groupBy("sale_report.id")->paginate($this->request->length ?? 50);

        $data =  $this->controller->sendResponseWithPaginationList($model, [
            "type"      => $this->request->type,
            "selector"  => "id",
            "typeArr"   => ["machine", "product", 'employee'],
            "keyName"   => $this->request->type === "machine" ? "machine_id" : ($this->request->type === "employee" ? "employee_id" : "product_id"),
            "valName"   => $this->request->type === "machine" ? "machine_name" : ($this->request->type === "employee" ? "employee_name" : "product_name"),
        ]);

        $data["failed"]     = $errors->count;
        $data["cancelled"]  = $errors->cancelled;
        $data["sales"]      = number_format($sales->sum("product_price"), 2);

        return $this->controller->sendResponseReport($data);
    }

    /**
     * @OA\Post(
     *     path="/v1/reports/expiry/products",
     *     summary="Reports Expiry Products",
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

        $model          = MachineProductMap::selectRaw("machine_product_map.id,machine_product_map.updated_at,machine_product_map.machine_id,  machine.machine_name, machine_product_map.product_id, machine_product_map.product_name, product.product_batch_no, machine_product_map.product_quantity, product.product_batch_expiray_date, GROUP_CONCAT(machine_product_map.product_location) as aisles, product.discount_price, product.product_discount_type, product.product_discount_code, machine_product_map.product_price, IF(TIMESTAMPDIFF(DAY,NOW(),product.product_batch_expiray_date)>0,CONCAT(TIMESTAMPDIFF(DAY,NOW(),product.product_batch_expiray_date),' Days'),'EXPIRED') as days_remaining");

        $model = $model->leftJoin("product", function ($join) {
            $join->on("machine_product_map.product_id", "=", "product.product_id");
            $join->on("machine_product_map.client_id", "=", "product.client_id");
        });

        $model = $model->leftJoin("machine", "machine.id", "=", "machine_product_map.machine_id");

        $model = $model->whereNotNull("product.product_batch_expiray_date");

        if (!empty($start_date) && !empty($end_date)) {
            $model = $model->WhereDate("product.created_at", ">=", $start_date);
            $model = $model->WhereDate("product.created_at", "<=", $end_date);
        }

        if (!empty($search)) {
            $model = $model->where(function ($query) use ($search) {
                $query->where('machine_product_map.product_name', 'like', "$search%");
                $query->orWhere('machine.machine_name', 'like', "$search%");
            });
        }

        if ($machine_id > 0) {
            $model = $model->where("machine_product_map.machine_id", $machine_id);
        }

        if ($this->client_id > 0) {
            $model = $model->whereIn("machine_product_map.machine_id", $machines);
        }

        $model = $model->groupBy("machine_product_map.machine_id", "machine_product_map.product_id");

        $model = $model->orderBy("machine_product_map.id", "DESC");

        $model = $model->paginate($this->request->length ?? 50);

        $data =  $this->controller->sendResponseWithPaginationList($model, [
            "type"      => $this->request->type,
            "selector"  => "id",
            "typeArr"   => ["machine", "product", 'expiry'],
            "keyName"   => $this->request->type === "machine" ? "machine_id" : ($this->request->type === "expiry" ? "product_batch_expiray_date" : "product_id"),
            "valName"   => $this->request->type === "machine" ? "machine_name" : ($this->request->type === "expiry" ? "product_batch_expiray_date" : "product_name"),
        ]);

        return $this->controller->sendResponseReport($data);
    }

    /**
     * @OA\Post(
     *     path="/v1/reports/vend/error",
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

        $model              = LocationNonFunctional::select(DB::raw("location_non_functional.*"), "machine.machine_name");
        $model->leftJoin("machine", "machine.id", "=", "location_non_functional.machine_id");
        $model->where("location_non_functional.is_deleted", 0);

        if ($client_id > 0) {
            $model->whereIn("location_non_functional.machine_id", $machines);
        }

        if ($machine_id && $machine_id > 0) {
            $model->where("location_non_functional.id", $machine_id);
        }

        if (in_array($type, ["all_errors", "machine"]) && $search != "") {
            if ($type === "all_errors") {
                $model->where("location_non_functional.error_code", "LIKE", "$search%");
            } else {
                $model->where("machine.machine_name", "LIKE", "$search%");
            }
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model->whereDate("location_non_functional.timestamp", ">=", $start_date);
            $model->whereDate("location_non_functional.timestamp", "<=", $end_date);
        }

        if ($type) {
            if (in_array($type, self::_VEND_ERRORS)) {
                $model->where("location_non_functional.error_code", $type);
            } else if ($type === "all_errors") {
                $model->whereNotNull("location_non_functional.error_code");
            } else if ($type === "product_faults") {
                $model->where("location_non_functional.error_code", "LIKE", "%fault%");
            } else if ($type === "payment_faults") {
                $model->where("location_non_functional.error_code", "LIKE", "%payment%");
            }
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
        $data =  $this->controller->sendResponseWithPaginationList($model, [
            "type"      => $this->request->type,
            "selector"  => "id",
            "typeArr"   => ["machine", "all_errors"],
            "keyName"   => $this->request->type === "machine" ? "machine_id" : "error_code",
            "valName"   => $this->request->type === "machine" ? "machine_name" : "error_code",
        ]);

        return $this->controller->sendResponseReport($data);
    }

    /**
     * @OA\Post(
     *     path="/v1/reports/feedback",
     *     summary="Reports Feedback",
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

        $model              = Feedback::select("feedback.*", "product.product_name as product_name", "machine.machine_name as machine_name", "client.client_name as client_name");
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
        $keyName = $valName = "";
        if ($type === "machine") {
            $keyName = "machine_id";
            $valName = "machine_name";
        } else if ($type === "product") {
            $keyName = "product_id";
            $valName = "product_name";
        } else if ($type === "feedback_type") {
            $keyName = "complaint";
            $valName = "complaint";
        } else if ($type === "location") {
            $keyName = "address";
            $valName = "address";
        } else if ($type === "customer") {
            $keyName = "customer_name";
            $valName = "customer_name";
        }
        $data =  $this->controller->sendResponseWithPaginationList($model, [
            "type"      => $this->request->type,
            "selector"  => "feedback_id",
            "typeArr"   => ["machine", "product", "feedback_type", "location", "customer"],
            "keyName"   => $keyName,
            "valName"   => $valName
        ]);

        return $this->controller->sendResponseReport($data);
    }

    /**
     * @OA\Post(
     *     path="/v1/reports/email",
     *     summary="Reports Email",
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

        $model      = ReportEmail::whereDate("timestamp", ">=", $start_date)->whereDate("timestamp", "<=", $end_date);

        if ($client_id > 0) {
            $model->where("client_id", $client_id);
        }

        if (!empty($search)) {
            $model->where("email", "like", "%$search%");
        }

        if (!empty($type)) {
            $model->where($type, $type);
        }

        $model = $model->paginate($this->request->length ?? 50);

        $data =  $this->controller->sendResponseWithPaginationList($model, [
            "type"      => $this->request->type,
            "selector"  => "id",
            "typeArr"   => ["type", "frequency"],
            "keyName"   => $this->request->type,
            "valName"   => $this->request->type
        ]);

        return $this->controller->sendResponseReport($data);
    }

    /**
     * @OA\Post(
     *     path="/v1/reports/staff",
     *     summary="Reports Staff",
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

        $model          = EmployeeTransaction::select("employee_transaction.id", "employee_transaction.transaction_id", "employee_transaction.job_number", "employee_transaction.cost_center", "employee_transaction.employee_id", "employee_transaction.employee_full_name", "employee_transaction.product_id", "employee_transaction.product_name", "client.client_name as client_name", "product.product_sku as product_sku", "employee_transaction.machine_name", "employee_transaction.pickup_or_return");

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

        $data = $this->controller->sendResponseWithPaginationList($model, [
            "type"      => $this->request->type,
            "selector"  => "id",
            "typeArr"   => ["machine", "product", "employee"],
            "keyName"   => $this->request->type === "machine" ? "machine_id" : ($this->request->type == "product" ? "product_id" : "employee_id"),
            "valName"   => $this->request->type === "machine" ? "machine_name" : ($this->request->type == "product" ? "product_name" : "employee_full_name")
        ]);

        return $this->controller->sendResponseReport($data);
    }
}
