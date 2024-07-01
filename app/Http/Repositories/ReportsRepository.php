<?php

namespace App\Http\Repositories;

use DB;
use App\Http\Controllers\Rest\BaseController;
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

        $model              = Sale::select("*", DB::raw("IF(aisle_no IS NULL,'NA',aisle_no) as aisles"), DB::raw("FORMAT(product_price,2) as price"))->with("product")->where("is_deleted", 0);

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
        print_r($data);
        die;
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

    public function refill($machines)
    {
        $refills =  $highest = 0;
        $query = $model = "";
        $product_loc_map = $refilling = $machine_product_map = $sell_quantity =  [];
        $machine_id         = $this->request->machine_id;
        $timestamp          = $this->request->timestamp;
        $start_date         = $this->request->start_date;
        $end_date           = $this->request->end_date;
        $refill_type        = $this->request->refill_type ?? "sale";
        $type               = $this->request->type;
        $search             = $this->request->search;
        $time_diff          = null;

        if ($timestamp && $timestamp != "") {
            $start_date     = null;
            $end_date       = null;
            $timestamp      = date("Y-m-d", strtotime($timestamp));
            $time_diff      = 24 * 60 * 60;
        } else {
            $start_date     = date("Y-m-d H:i:s", strtotime($start_date));
            $end_date       = date("Y-m-d H:i:s", strtotime($end_date));
            $time_diff      = (strtotime($end_date) - strtotime($start_date));
        }

        $topLow             = "SELECT `machine_product_map`.`machine_id`,`machine_product_map`.`updated_at` as timestamp,`machine`.`machine_name`,`machine_product_map`.`id`,`machine_product_map`.`product_id`,`machine_product_map`.`product_name`,`machine_product_map`.`product_location`, (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`) as count FROM `machine_product_map` LEFT JOIN `machine` ON `machine`.`id`=`machine_product_map`.`machine_id` WHERE `product_id`<>''";

        $machines           = "SELECT COUNT(*) as count FROM `machine_product_map` LEFT JOIN `machine` ON `machine`.`id`=`machine_product_map`.`machine_id` WHERE `product_id`<>''";

        $refill_qty         = "SELECT SUM(`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`) as refill_qty  FROM `machine_product_map` LEFT JOIN `machine` ON `machine`.`id`=`machine_product_map`.`machine_id` WHERE `product_id`<>''";

        $vended_qty         =  "SELECT `sale_report`.`aisle_no`,`sale_report`.`product_id`,`sale_report`.`machine_id`,(`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`) as refill_qty FROM `sale_report` LEFT JOIN  `machine_product_map` ON `machine_product_map`.`machine_id`=`sale_report`.`machine_id` AND `machine_product_map`.`product_location`=`sale_report`.`aisle_no` AND `machine_product_map`.`product_id`=`sale_report`.`product_id` WHERE `sale_report`.`product_id`<>''";

        if ($refill_type === "sale") {
            $query              = "SELECT `sale_report`.`id` FROM `sale_report` LEFT JOIN `machine_product_map` ON `machine_product_map`.`machine_id`=`sale_report`.`machine_id` AND `machine_product_map`.`product_location`=`sale_report`.`aisle_no` AND `machine_product_map`.`product_id`=`sale_report`.`product_id`  WHERE `sale_report`.`product_id`<>''";

            $model              = "SELECT `sale_report`.*, (`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`) as refill_qty FROM `sale_report` LEFT JOIN  `machine_product_map` ON `machine_product_map`.`machine_id`=`sale_report`.`machine_id` AND `machine_product_map`.`product_location`=`sale_report`.`aisle_no` AND `machine_product_map`.`product_id`=`sale_report`.`product_id` WHERE `sale_report`.`product_id`<>''";
        } else {
            $query              = "SELECT `machine_product_map`.`id` FROM `machine_product_map` LEFT JOIN `machine` ON `machine`.`id`=`machine_product_map`.`machine_id` WHERE `product_id`<>''";

            $model              = "SELECT `machine_product_map`.`machine_id`,`machine_product_map`.`updated_at` as timestamp,`machine`.`machine_name`,`machine_product_map`.`id`,`machine_product_map`.`product_id`,`machine_product_map`.`product_name`,`machine_product_map`.`product_location` as aisle_no, `machine_product_map`.`product_max_quantity`,`machine_product_map`.`product_quantity`, (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`) as refill_qty FROM `machine_product_map` LEFT JOIN `machine` ON `machine`.`id`=`machine_product_map`.`machine_id` WHERE `product_id`<>''";
        }
        if ($client_id > 0) {
            $topLow        .= " AND `machine_product_map`.`client_id`=$client_id";
            $machines      .= " AND `machine_product_map`.`client_id`=$client_id";
            $refill_qty    .= " AND `machine_product_map`.`client_id`=$client_id";
            $vended_qty    .= " AND `sale_report`.`client_id`=$client_id";
            if ($refill_type === "sale") {
                $model         .= " AND `sale_report`.`client_id`=$client_id";
                $query         .= " AND `sale_report`.`client_id`=$client_id";
            } else {
                $query         .= " AND `machine_product_map`.`client_id`=$client_id";
                $model         .= " AND `machine_product_map`.`client_id`=$client_id";
            }
        }
        if ($machine_id > 0) {
            $topLow        .= " AND `machine_product_map`.`machine_id`=$machine_id";
            $machines      .= " AND `machine_product_map`.`machine_id`=$machine_id";
            $refill_qty    .= " AND `machine_product_map`.`machine_id`=$machine_id";
            $vended_qty    .= " AND `sale_report`.`machine_id`=$machine_id";
            if ($refill_type === "sale") {
                $query         .= " AND `sale_report`.`machine_id`=$machine_id";
                $model         .= " AND `sale_report`.`machine_id`=$machine_id";
            } else {
                $query         .= " AND `machine_product_map`.`machine_id`=$machine_id";
                $model         .= " AND `machine_product_map`.`machine_id`=$machine_id";
            }
        }
        if ($type === "empty_aisles") {
            $topLow        .= " AND `machine_product_map`.`product_quantity`=0";
            $machines      .= " AND `machine_product_map`.`product_quantity`=0";
            $refill_qty    .= " AND `machine_product_map`.`product_quantity`=0";
            $vended_qty    .= " AND `sale_report`.`aisle_remain_qty`=0";
            if ($refill_type === "sale") {
                $query         .= " AND `sale_report`.`aisle_remain_qty`=0";
                $model         .= " AND `sale_report`.`aisle_remain_qty`=0";
            } else {
                $query         .= " AND `machine_product_map`.`product_quantity`=0";
                $model         .= " AND `machine_product_map`.`product_quantity`=0";
            }
        } else if ($type === "part_full_aisles") {
            $topLow        .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>1";
            $machines      .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>1";
            $refill_qty    .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>1";
            $vended_qty    .= " AND `sale_report`.`aisle_remain_qty`>0";
            if ($refill_type === "sale") {
                $query         .= " AND `sale_report`.`aisle_remain_qty`>0";
                $model         .= " AND `sale_report`.`aisle_remain_qty`>0";
            } else {
                $query         .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>0";
                $model         .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>0";
            }
        } else if ($type === "full_aisles") {
            $topLow        .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)=0";
            $machines      .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)=0";
            $refill_qty    .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)=0";
            $vended_qty    .= " AND (`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`)=0";
            if ($refill_type === "sale") {
                $query         .= " AND (`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`)=0";
                $model         .= " AND (`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`)=0";
            } else {
                $query         .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)=0";
                $model         .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)=0";
            }
        } else if ($type === "low_stock_aisles") {
            $topLow        .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>0";
            $machines      .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>0";
            $refill_qty    .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>0";
            $vended_qty    .= " AND (`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`)>0";
            if ($refill_type === "sale") {
                $query         .= " AND (`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`)>0";
                $model         .= " AND (`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`)>0";
            } else {
                $query         .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>0";
                $model         .= " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>0";
            }
        }

        if (!empty($timestamp)) {
            $vended_qty    .= " AND DATE(`sale_report`.`timestamp`)='$timestamp'";
            $query         .= " AND DATE(`sale_report`.`timestamp`)='$timestamp'";
            $model         .= " AND DATE(`sale_report`.`timestamp`)='$timestamp'";
        } else {
            $vended_qty    .= " AND `sale_report`.`timestamp`>='$start_date' AND `sale_report`.`timestamp`<='$end_date'";
        }
        if ($refill_type === "sale") {
            if (!empty($timestamp)) {
                $query         .= " AND DATE(`sale_report`.`timestamp`)='$timestamp'";
                $model         .= " AND DATE(`sale_report`.`timestamp`)='$timestamp'";
            } else {
                $query         .= " AND `sale_report`.`timestamp`>='$start_date' AND `sale_report`.`timestamp`<='$end_date'";
                $model         .= " AND `sale_report`.`timestamp`>='$start_date' AND `sale_report`.`timestamp`<='$end_date'";
            }
        }

        if (!empty($search)) {
            $topLow        .= " AND (`machine_product_map`.`product_name` LIKE '$search%' OR `machine`.`machine_name` LIKE '$search%')";
            $machines      .= " AND (`machine_product_map`.`product_name` LIKE '$search%' OR `machine`.`machine_name` LIKE '$search%')";
            $refill_qty    .= " AND (`machine_product_map`.`product_name` LIKE '$search%' OR `machine`.`machine_name` LIKE '$search%')";
            $vended_qty    .= " AND (`sale_report`.`product_name` LIKE '$search%' OR `sale_report`.`machine_name` LIKE '$search%')";
            if ($refill_type === "sale") {
                $query         .= " AND (`sale_report`.`product_name` LIKE '$search%' OR `sale_report`.`machine_name` LIKE '$search%')";
                $model         .= " AND (`sale_report`.`product_name` LIKE '$search%' OR `sale_report`.`machine_name` LIKE '$search%')";
            } else {
                $query         .= " AND (`machine_product_map`.`product_name` LIKE '$search%' OR `machine`.`machine_name` LIKE '$search%')";
                $model         .= " AND (`machine_product_map`.`product_name` LIKE '$search%' OR `machine`.`machine_name` LIKE '$search%')";
            }
        }

        if ($this->admin_id > 0 && $this->client_id > 0) {
            $my_machines    = implode(",", $this->machines);
            $topLow        .= " AND `machine_product_map`.`machine_id` IN ($my_machines)";
            $machines      .= " AND `machine_product_map`.`machine_id` IN ($my_machines)";
            $refill_qty    .= " AND `machine_product_map`.`machine_id` IN ($my_machines)";
            $vended_qty    .= " AND `sale_report`.`machine_id` IN ($my_machines)";
            if ($refill_type === "sale") {
                $query         .= " AND `sale_report`.`machine_id` IN ($my_machines)";
                $model         .= " AND `sale_report`.`machine_id` IN ($my_machines)";
            } else {
                $query         .= " AND `machine_product_map`.`machine_id` IN ($my_machines)";
                $model         .= " AND `machine_product_map`.`machine_id` IN ($my_machines)";
            }
        }
        $machines         .= " GROUP BY `machine_product_map`.`machine_id`";
        $vended_qty       .= " ORDER BY `sale_report`.`id` DESC";
        $vended_qty        = $this->db->query($vended_qty)->result_array();
        $vended_data       = [];
        $vended_new_qty    = 0;
        foreach ($vended_qty as $key => $value) {
            $combined_new = $value["machine_id"] . "-" . $value["product_id"] . "-" . ($value["aisle_no"] ?? "empty");
            if (isset($vended_data[$combined_new])) {
                continue;
            }
            $vended_data[$combined_new] = $value["refill_qty"];
            if ($value["refill_qty"] > 0) {
                $vended_new_qty += $value["refill_qty"];
            }
        }
        $topRefill         = $topLow . " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>1 ORDER BY count DESC LIMIT 5";
        $topRefill         = $this->db->query($topRefill)->result_array();
        $endCount          = isset(end($topRefill)["count"]) ? end($topRefill)["count"] : 2;
        $lowRefill         = $topLow . " AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)>0 AND (`machine_product_map`.`product_max_quantity` - `machine_product_map`.`product_quantity`)<$endCount  ORDER BY count ASC LIMIT 5";
        $lowRefill         = $this->db->query($lowRefill)->result_array();
        $machines          = $this->db->query($machines)->num_rows();
        $refill_qty        = $this->db->query($refill_qty)->row();
        $refill_qty        = $refill_qty ? $refill_qty->refill_qty : 0;
        $model             .= $refill_type === "sale" ? " ORDER BY `sale_report`.`id` DESC" : " ORDER BY refill_qty DESC";

        $paginate           = paginate($this->db->query($query)->num_rows());
        extract($paginate);
        $model             .= " LIMIT $offset,$length";
        $model              = $this->db->query($model)->result_array();
        $formattedData = $pairs = $allIds = $pairedIds = [];
        if (in_array($type, ["machine", "product"])) {
            $keyName        = $type === "machine" ? "machine_id" :  "product_id";
            $valName        = $type === "machine" ? "machine_name" : "product_name";
            foreach ($model as $key => $value) {
                $combined = (string)($value["machine_id"]) . "_" . $value["product_id"];
                if (isset($machine_product_map[$combined])) {
                    $machine_product_map[$combined] += 1;
                } else {
                    $machine_product_map[$combined] = 1;
                }
                $allIds[] = $value["id"];
                $pairs[$value[$keyName]] = $value[$valName];
                if (isset($formattedData[$value[$keyName]])) {
                    $pairedIds[$value[$keyName]] = [...$pairedIds[$value[$keyName]], $value["id"]];
                    $formattedData[$value[$keyName]] = [...$formattedData[$value[$keyName]], $value];
                } else {
                    $pairedIds[$value[$keyName]] = [$value["id"]];
                    $formattedData[$value[$keyName]] = [$value];
                }
            }
        } else {
            $formattedData = $model;
            foreach ($formattedData as $value) {
                $combined = (string)($value["machine_id"]) . "_" . $value["product_id"];
                // $machines[] = $value["machine_id"];
                if (isset($machine_product_map[$combined])) {
                    $machine_product_map[$combined] += 1;
                } else {
                    $machine_product_map[$combined] = 1;
                }
                $allIds[] = $value["id"];
            }
        }
        $paginate["time_diff"]              = $time_diff;
        $paginate["machine_product_map"]    = $machine_product_map;
        $paginate["showingRecords"]         = count($model);
        $paginate["data"]                   = $formattedData;
        $paginate["pairs"]                  = $pairs;
        $paginate["all"]                    = $allIds;
        $paginate["paired"]                 = $pairedIds;
        $paginate["total_refills"]          = $refill_qty;
        $paginate["total_machines"]         = $machines;
        $paginate["top_refilling"]          = $topRefill;
        $paginate["vended_refills"]         = $vended_new_qty;
        $paginate["least_refilling"]        = array_reverse($lowRefill);
        return $this->output
            ->set_content_type('application/json')
            ->set_status_header(200)
            ->set_output(json_encode($paginate));
    }
}
