<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\AuthSignupRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\Employee;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Repositories\BaseRepository;
use Validator;
use App\Models\User;
use App\Models\Machine;
use App\Models\MachineHeartBeat;
use App\Models\MachineUser;
use App\Models\Product;
use DB;
use Illuminate\Support\Facades\Hash;

class DashboardController extends BaseController
{
    public function __construct()
    {
        $this->middleware('jwt'); //['except' => ['login']]
    }

    public function info(Request $request)
    {
        $auth       = $request->auth;
        $machines   = Machine::personal($auth, 'columns', ['id', 'machine_name', 'machine_client_id']);
        $params     = compact("auth", "machines");
        $response = array_merge(self::machine_info($params), self::products_info($params), self::staff_info($auth), self::customers_info(), self::machine_users_info($params));
        //self::customers_info(), self::machine_users_info($params), self::recentVend($params), self::recentRefill($params), self::recentFeedback($params), self::recentVendError($params), self::getFeed($params), self::sales15days($params)
        return parent::sendResponse($response, "Success");
    }

    function machine_info($params)
    {
        extract($params);
        $response   = [];
        if ($auth->client_id > 0) {
        }

        $response["total"]          = count($machines);
        $response['connected']      = 0;
        $response['offline']        = 0;
        $response['fluctuating']    = 0;

        $collection = collect($machines);

        $machine_ids = $collection->map(function ($item, $key) {
            return $item->id;
        })->all();

        $machine_status = MachineHeartBeat::selectRaw('SUM(IF(TIME_TO_SEC(TIMEDIFF(now(),last_sync_time))<=1800,1,0)) as connected, SUM(IF(TIME_TO_SEC(TIMEDIFF(now(),last_sync_time))>1800 && TIME_TO_SEC(TIMEDIFF(now(),last_sync_time))<=4800,1,0)) as fluctuating, SUM(IF(TIME_TO_SEC(TIMEDIFF(now(),last_sync_time))>4800,1,0)) as offline')->whereIn('machine_id', $machine_ids)->get()->first();
        return ['machines' => $response];
    }

    function products_info($params)
    {
        extract($params);
        $response["assigned"]   = Product::assigned($auth, ["product.id"], "count") ?? 0;
        $response["total"]      = Product::total($auth, ["product.id"], "count") ?? 0;
        $response["unassigned"] = $response["total"] - $response["assigned"];
        return ['products' => $response];
    }

    function staff_info($auth)
    {
        $employee = Employee::select(['id'])->where("is_deleted", 0);
        if ($auth->client_id > 0) {
            $employee = $employee->where('client_id', $auth->client_id);
        }
        $employee   = $employee->count();
        $response["total"]      = $employee;
        $response["active"]     = 0;
        $response["inactive"]   = 0;
        $response["offline"]    = $employee;
        return ['staff' => $response];
    }

    function customers_info()
    {
        $response["total"]      = 0;
        $response["active"]     = 0;
        $response["inactive"]   = 0;
        $response["offline"]    = 0;
        return ['customer' => $response];
    }

    function machine_users_info($params)
    {
        extract($params);
        $response               = [];
        $model                  = MachineUser::selectRaw('COUNT(*) as total,SUM(IF(TIME_TO_SEC(TIMEDIFF(now(),user.last_updated))<=1800,1,0)) as active, SUM(IF(TIME_TO_SEC(TIMEDIFF(now(),user.last_updated))>1800,1,0)) as inactive');
        if ($auth->client_id > 0) {
            $model          = $model->leftJoin("machine", "machine.machine_username", "=", "user.username");
            if (count($machines)) {
                $model          = $model->where_in("machine.id", $machines);
            } else {
                $model          = $model->where_in("machine.id", ["no_machine"]);
            }
            $model                  = $model->where("client_id", $auth->client_id);
        }
        $model                  = $model->where('is_deactivated', '0')->groupBy("user.id")->get()->toArray();
        return ['machine_users' => $model];
    }

    function recentVend($admin_machines)
    {
        $start_date = $this->input->post("start_date");
        $end_date   = $this->input->post("end_date");
        $machine_id = $this->input->post("machine_id");
        $product_id = $this->input->post("product_id");
        $search     = $this->input->post("search");

        $model =  $this->db->select(["sale_report.*", "client.client_name"])->join("client", "client.id=sale_report.client_id", "left")->where('sale_report.is_deleted', '0');

        if ($this->client_id > 0) {
            $model =  $model->where('sale_report.client_id', $this->client_id);
            if (count($admin_machines) > 0) {
                $model =  $model->where_in("sale_report.machine_id", $admin_machines);
            } else {
                $model =  $model->where_in("sale_report.machine_id", ["no_machine"]);
            }
        }

        if ($machine_id) {
            $model =  $model->where('sale_report.machine_id', $machine_id);
        } else if ($product_id) {
            $model =  $model->where('sale_report.product_id', $product_id);
        }

        if (!empty($search)) {
            $model =  $model->group_start()
                ->like("sale_report.machine_name", $search, "after")
                ->or_like('sale_report.product_name', $search, "after")
                ->group_end();
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->where('sale_report.timestamp>=', $start_date);
            $model  = $model->where('sale_report.timestamp<=', $end_date);
        }

        $model =  $model->order_by('sale_report.id', 'DESC')->limit(5)->get("sale_report")->result_array();
        return ['recent_vend' => $model];
    }

    public function recentRefill($admin_machines)
    {
        $refills =  $highest = 0;
        $product_loc_map = $refilling = $machine_product_map = $machines = $sell_quantity =  [];
        $client_id          = $this->input->request_headers()['ClientId'];
        $machine_id         = $this->input->post("machine_id");
        $timestamp          = $this->input->post("timestamp");
        $start_date         = $this->input->post("start_date");
        $end_date           = $this->input->post("end_date");
        $type               = $this->input->post("type");
        $search             = $this->input->post("search");
        $start_date         = date("Y-m-d H:i:s", strtotime($start_date));
        $end_date           = date("Y-m-d H:i:s", strtotime($end_date));

        $model              = "SELECT `sale_report`.*, (`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`) as refill_qty FROM `sale_report` LEFT JOIN  `machine_product_map` ON `machine_product_map`.`machine_id`=`sale_report`.`machine_id` AND `machine_product_map`.`product_location`=`sale_report`.`aisle_no` AND `machine_product_map`.`product_id`=`sale_report`.`product_id` WHERE `sale_report`.`product_id`<>''";

        if ($client_id > 0) {
            $my_machines    = implode(",", $admin_machines);
            $model         .= " AND `sale_report`.`client_id`=$client_id";
            $model         .= " AND `sale_report`.`machine_id` IN ($my_machines)";
        }

        if ($machine_id > 0) {
            $model         .= " AND `sale_report`.`machine_id`=$machine_id";
        }
        $model         .= " AND `sale_report`.`timestamp`>='$start_date' AND `sale_report`.`timestamp`<='$end_date'";

        if (!empty($search)) {
            $model         .= " AND (`sale_report`.`product_name` LIKE '$search%' OR `sale_report`.`machine_name` LIKE '$search%')";
        }
        $refills           .= " GROUP BY `sale_report`.`product_id`, `sale_report`.`machine_id`, `sale_report`.`aisle_no` ORDER BY `sale_report`.`id` DESC";
        $model             .= " ORDER BY `sale_report`.`id` DESC";
        $model             .= " LIMIT 5";
        $model              = $this->db->query($model)->result_array();

        $clients            = $mapped = [];
        foreach ($model as $value) {
            $clients = [...$clients, $value["client_id"]];
        }
        if (count($clients) > 0) {
            $clientMap          = $this->db->select(["id", "client_name"])->where_in('id', array_unique($clients))->get("client")->result_array();
            foreach ($clientMap as $value) {
                $mapped[$value["id"]] = $value["client_name"];
            }
        }
        foreach ($model as $key => $value) {
            if (isset($mapped[$value["client_id"]])) {
                $model[$key]["client_name"] = $mapped[$value["client_id"]];
            } else {
                $model[$key]["client_name"] = "";
            }
        }
        return ['recent_refill' => $model];
    }

    function recentAudit($admin_machines)
    {
        $start_date = $this->input->post("start_date");
        $end_date   = $this->input->post("end_date");
        $machine_id = $this->input->post("machine_id");
        $product_id = $this->input->post("product_id");
        $search     = $this->input->post("search");

        $model =  $this->db->select(["refill_history.*", "client.client_name"])->join("client", "client.id=refill_history.client_id", "left")->where('refill_history.is_deleted', '0');

        if ($this->client_id > 0) {
            $model =  $model->where('refill_history.client_id', $this->client_id);
            if (count($admin_machines) > 0) {
                $model =  $model->where_in("refill_history.machine_id", $admin_machines);
            } else {
                $model =  $model->where_in("refill_history.machine_id", ["no_machine"]);
            }
        }

        if ($machine_id) {
            $model =  $model->where('refill_history.machine_id', $machine_id);
        } else if ($product_id) {
            $model =  $model->where('refill_history.product_id', $product_id);
        }

        if (!empty($search)) {
            $model =  $model->group_start()
                ->like("refill_history.machine_name", $search, "after")
                ->or_like('refill_history.product_name', $search, "after")
                ->group_end();
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->where('refill_history.created_at>=', $start_date);
            $model  = $model->where('refill_history.created_at<=', $end_date);
        }

        $model =  $model->order_by('refill_history.id', 'DESC')->limit(5)->get("refill_history")->result_array();
        return ['recent_refill' => $model];
    }

    function recentFeedback($admin_machines)
    {
        $start_date = $this->input->post("start_date");
        $end_date   = $this->input->post("end_date");
        $machine_id = $this->input->post("machine_id");
        $product_id = $this->input->post("product_id");
        $search     = $this->input->post("search");

        $model =  $this->db->select(["feedback.*", "client.client_name", "machine.machine_name"])->join("client", "client.id=feedback.client_id", "left")->join("machine", "feedback.machine_id=machine.id", "left")->where('feedback.is_deleted', '0')->where('feedback.product_id <>', '');

        if ($this->client_id > 0) {
            $model =  $model->where('feedback.client_id', $this->client_id);
            if (count($admin_machines) > 0) {
                $model =  $model->where_in("feedback.machine_id", $admin_machines);
            } else {
                $model =  $model->where_in("feedback.machine_id", ["no_machine"]);
            }
        }

        if ($machine_id) {
            $model =  $model->where('feedback.machine_id', $machine_id);
        } else if ($product_id) {
            $model =  $model->where('feedback.product_id', $product_id);
        }

        if (!empty($search)) {
            $model =  $model->group_start()
                ->like("machine.machine_name", $search, "after")
                ->or_like('feedback.product_name', $search, "after")
                ->group_end();
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->where('feedback.timestamp>=', $start_date);
            $model  = $model->where('feedback.timestamp<=', $end_date);
        }

        $model =  $model->order_by('feedback.feedback_id', 'DESC')->limit(5)->get("feedback")->result_array();
        return ['recent_feedback' => $model];
    }

    function recentVendError($admin_machines)
    {
        $start_date = $this->input->post("start_date");
        $end_date   = $this->input->post("end_date");
        $machine_id = $this->input->post("machine_id");
        $product_id = $this->input->post("product_id");
        $search     = $this->input->post("search");

        $model =  $this->db->select(["location_non_functional.*", "client.client_name"])->join("machine", "machine.id=location_non_functional.machine_id")->join("client", "client.id=machine.machine_client_id", "left")->where('location_non_functional.is_deleted', '0');

        if ($this->client_id > 0) {
            $model =  $model->where('machine.machine_client_id', $this->client_id);
            if (count($admin_machines) > 0) {
                $model =  $model->where_in("location_non_functional.machine_id", $admin_machines);
            } else {
                $model =  $model->where_in("location_non_functional.machine_id", ["no_machine"]);
            }
        }

        if ($machine_id) {
            $model =  $model->where('location_non_functional.machine_id', $machine_id);
        }
        //  else if ($product_id) {
        //     $model =  $model->where('location_non_functional.product_id', $product_id);
        // }

        if (!empty($search)) {
            $model =  $model->group_start()
                ->like("location_non_functional.machine_name", $search, "after")
                ->or_like('location_non_functional.product_name', $search, "after")
                ->group_end();
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->where('location_non_functional.timestamp>=', $start_date);
            $model  = $model->where('location_non_functional.timestamp<=', $end_date);
        }

        $model =  $model->order_by('location_non_functional.id', 'DESC')->limit(5)->get("location_non_functional")->result_array();
        return ['recent_vend_error' => $model];
    }

    public function getFeed($admin_machines)
    {
        $start_date = $this->input->post("start_date");
        $end_date   = $this->input->post("end_date");
        $machine_id = $this->input->post("machine_id");

        $model =  $this->db->select(["feed.*", "machine.machine_name"])->join("machine", "machine.id=feed.machine_id", "left");

        if ($this->client_id > 0) {
            $model =  $model->where('feed.client_id', $this->client_id);
        }

        if ($machine_id) {
            $model =  $model->where('feed.machine_id', $machine_id);
            if (count($admin_machines) > 0) {
                $model =  $model->where_in("feed.machine_id", $admin_machines);
            } else {
                $model =  $model->where_in("feed.machine_id", ["no_machine"]);
            }
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->where('feed.created_on>=', $start_date);
            $model  = $model->where('feed.created_on<=', $end_date);
        }

        $model =  $model->order_by('feed.id', 'DESC')->limit(20)->get("feed")->result_array();
        return ['recent_feed' => $model];
    }

    public function sales15days($admin_machines)
    {
        $model = $this->db->select(["DATE(timestamp) as date", "FORMAT(SUM(product_price),2) as total_sale"])->where('is_deleted', '0')->where('timestamp BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY) AND NOW()');
        if ($this->client_id > 0) {
            if (count($admin_machines) > 0) {
                $model =  $model->where_in("machine_id", $admin_machines);
            } else {
                $model =  $model->where_in("machine_id", ["no_machine"]);
            }
            $model = $model->where("client_id", $this->client_id);
        }
        $model = $model->group_by("DATE(timestamp)")->get('sale_report')->result_array();
        $array = [];
        foreach ($model as $value) {
            $array[$value["date"]] = $value["total_sale"];
        }
        return ['15_days_sales' => $array];
    }
}
