<?php

namespace App\Http\Repositories;

use DB;
use App\Http\Controllers\Rest\BaseController;
use App\Models\LocationNonFunctional;
use App\Models\Machine;
use App\Models\MachineProductMap;
use App\Models\Sale;
use Illuminate\Http\Request;

class ReportsRepository
{
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

        $model              = Sale::select("sale_report.*", DB::raw("IF(sale_report.aisle_no IS NULL,'NA',sale_report.aisle_no) as aisle_no"), DB::raw("FORMAT(sale_report.product_price,2) as price"), "machine_product_map.product_max_quantity", "machine_product_map.product_quantity")->leftJoin("machine_product_map", function ($join) {
            $join->on("sale_report.product_id", "=", "machine_product_map.product_id");
            $join->on("sale_report.machine_id", "=", "machine_product_map.machine_id");
            $join->on("sale_report.aisle_no", "=", "machine_product_map.product_location");
        })->where("sale_report.is_deleted", 0);

        $errors = LocationNonFunctional::selectRaw("COUNT(location_non_functional.id) as count, SUM(CASE WHEN LOCATE('Cancel', error_code) THEN 1 ELSE 0 END) AS cancelled")->leftJoin("machine", "machine.id", "=", "location_non_functional.machine_id");

        if ($client_id > 0) {
            $model          = $model->whereIn("sale_report.machine_id", $machines);
            $errors         = $errors->whereIn("machine.id", $machines);
        }

        if (!empty($search)) {
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
            $model  = $model->where("sale_report.machine_id", $machine_id);
            $errors = $errors->where("location_non_functional.machine_id", $machine_id);
        }

        if ($start_date && !empty($start_date) && $end_date && !empty($end_date)) {
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

        return $this->controller->sendResponseReport($data);
    }
}
