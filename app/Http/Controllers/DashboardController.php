<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\AuthSignupRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\Employee;
use App\Models\Feed;
use App\Models\Feedback;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Repositories\BaseRepository;
use Validator;
use App\Models\User;
use App\Models\Machine;
use App\Models\MachineHeartBeat;
use App\Models\MachineProductMap;
use App\Models\MachineUser;
use App\Models\Product;
use App\Models\RemoteVend;
use App\Models\Sale;
use App\Models\VendError;
use DB;
use Illuminate\Support\Facades\Hash;

class DashboardController extends BaseController
{
    public function __construct()
    {
        $this->middleware('jwt'); //['except' => ['login']]
    }

    public function dashboard(Request $request)
    {
        $auth       = $request->auth;
        $machines   = Machine::personal($auth, 'columns', ['id', 'machine_name', 'machine_client_id']);
        $collection = collect($machines);

        $machine_ids = $collection->map(function ($item, $key) {
            return $item->id;
        })->all();

        $params                                 = compact("auth", 'machine_ids', 'request');
        $response                               = [];
        $response["vend_machines"]              = count($machine_ids);
        $response["items_vended"]               = Sale::recentVend($params);
        $response["vend_beat"]                  = self::machine_info($params, true);

        $response["stock_level"]                = MachineProductMap::stocks($params);
        $response["feedback"]["refill"]         = self::recentRefill($params,$request)["recent_refill"];
        $response["feedback"]["vend_run"]       = RemoteVend::vendRun($params);
        $response["feedback"]["tasks"]          = [["refill" => "no-data"]];
        return parent::sendResponse($response, "Success");
    }

    public function info(Request $request)
    {
        $auth       = $request->auth;
        $machines   = Machine::personal($auth, 'columns', ['id', 'machine_name', 'machine_client_id']);
        $collection = collect($machines);

        $machine_ids = $collection->map(function ($item, $key) {
            return $item->id;
        })->all();

        $params     = compact("auth", "machines", 'machine_ids');
        $response = array_merge(self::machine_info($params), self::products_info($params), self::staff_info($auth), self::customers_info(), self::machine_users_info($params), self::recentVend($params, $request), self::recentRefill($params, $request), self::recentFeedback($params, $request), self::recentVendError($params, $request), self::getFeed($params, $request), self::sales15days($params, $request));
        return parent::sendResponse($response, "Success");
    }

    function machine_info($params, $type = false)
    {
        extract($params);
        $response   = [];
        if ($auth->client_id > 0) {
        }

        $response["total"]          = count($machine_ids);
        $response['connected']      = 0;
        $response['offline']        = 0;
        $response['fluctuating']    = 0;

        $model = MachineHeartBeat::selectRaw('SUM(IF(TIME_TO_SEC(TIMEDIFF(now(),last_sync_time))<=1800,1,0)) as connected, SUM(IF(TIME_TO_SEC(TIMEDIFF(now(),last_sync_time))>1800 && TIME_TO_SEC(TIMEDIFF(now(),last_sync_time))<=4800,1,0)) as fluctuating, SUM(IF(TIME_TO_SEC(TIMEDIFF(now(),last_sync_time))>4800,1,0)) as offline');
        if ($auth->client_id > 0) {
            $model = $model->whereIn('machine_id', $machine_ids);
        }
        $model = $model->get()->first();
        $response['connected']      = $model->connected;
        $response['offline']        = $model->offline;
        $response['fluctuating']    = $model->fluctuating;
        if ($type) {
            return $response;
        }
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
            if (count($machine_ids)) {
                $model          = $model->whereIn("machine.id", $machine_ids);
            } else {
                $model          = $model->whereIn("machine.id", ["no_machine"]);
            }
            $model                  = $model->where("client_id", $auth->client_id);
        }
        $model                  = $model->where('is_deactivated', '0')->groupBy("user.id")->get()->first();

        return ['machine_users' => $model];
    }

    function recentVend($params, $request)
    {
        extract($params);
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;
        $product_id = $request->product_id;
        $search     = $request->search;

        $model =  Sale::select(["sale_report.*", "client.client_name"])->leftJoin("client", "client.id", "=", "sale_report.client_id")->where('sale_report.is_deleted', '0');

        if ($auth->client_id > 0) {
            $model =  $model->where('sale_report.client_id', $auth->client_id);
            if (count($machine_ids) > 0) {
                $model =  $model->whereIn("sale_report.machine_id", $machine_ids);
            } else {
                $model =  $model->whereIn("sale_report.machine_id", ["no_machine"]);
            }
        }

        if ($machine_id) {
            $model =  $model->where('sale_report.machine_id', $machine_id);
        } else if ($product_id) {
            $model =  $model->where('sale_report.product_id', $product_id);
        }

        if (!empty($search)) {
            // $model =  $model->group_start()
            //     ->like("sale_report.machine_name", $search, "after")
            //     ->or_like('sale_report.product_name', $search, "after")
            //     ->group_end();
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->whereRaw("sale_report.timestamp >= '$start_date'");
            $model  = $model->whereRaw("sale_report.timestamp <= '$end_date'");
        }

        $model =  $model->orderBy('sale_report.id', 'DESC')->limit(5)->get();
        return ['recent_vend' => $model];
    }

    public function recentRefill($params, $request)
    {
        extract($params);
        $refills =  $highest = 0;
        $product_loc_map = $refilling = $machine_product_map = $machines = $sell_quantity =  [];
        $machine_id         = $request->machine_id;
        $timestamp          = $request->timestamp;
        $start_date         = $request->start_date;
        $end_date           = $request->end_date;
        $type               = $request->type;
        $search             = $request->search;
        $start_date         = date("Y-m-d H:i:s", strtotime($start_date));
        $end_date           = date("Y-m-d H:i:s", strtotime($end_date));

        $model              = "SELECT `sale_report`.*, `client`.`client_name`, (`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`) as refill_qty FROM `sale_report` LEFT JOIN  `machine_product_map` ON `machine_product_map`.`machine_id`=`sale_report`.`machine_id` AND `machine_product_map`.`product_location`=`sale_report`.`aisle_no` AND `machine_product_map`.`product_id`=`sale_report`.`product_id` LEFT JOIN  `client` ON `sale_report`.`client_id`=`client`.`id` WHERE `sale_report`.`product_id`<>''";

        if ($auth->client_id > 0) {
            if (count($machine_ids) == 0) {
                $machine_ids = ["no-machine"];
            }
            $my_machines    = implode(",", $machine_ids);
            $model         .= " AND `sale_report`.`client_id`=$auth->client_id";
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
        $model              = DB::select($model);

        return ['recent_refill' => $model];
    }

    function recentFeedback($params, $request)
    {
        extract($params);
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;
        $product_id = $request->product_id;
        $search     = $request->search;

        $model =  Feedback::select(["feedback.*", "client.client_name", "machine.machine_name"])->leftJoin("client", "client.id", "=", "feedback.client_id")->leftJoin("machine", "feedback.machine_id", "=", "machine.id")->where('feedback.is_deleted', '0')->whereNotNull('feedback.product_id');

        if ($auth->client_id > 0) {
            $model =  $model->where('feedback.client_id', $auth->client_id);
            if (count($machine_ids) > 0) {
                $model =  $model->whereIn("feedback.machine_id", $machine_ids);
            } else {
                $model =  $model->whereIn("feedback.machine_id", ["no_machine"]);
            }
        }

        if ($machine_id) {
            $model =  $model->where('feedback.machine_id', $machine_id);
        } else if ($product_id) {
            $model =  $model->where('feedback.product_id', $product_id);
        }

        if (!empty($search)) {
            // $model =  $model->group_start()
            //     ->like("machine.machine_name", $search, "after")
            //     ->or_like('feedback.product_name', $search, "after")
            //     ->group_end();
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->whereRaw("feedback.timestamp>= '$start_date'");
            $model  = $model->whereRaw("feedback.timestamp<= '$end_date'");
        }

        $model =  $model->orderBy('feedback.feedback_id', 'DESC')->limit(5)->get();
        return ['recent_feedback' => $model];
    }

    function recentVendError($params, $request)
    {
        extract($params);
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;
        $product_id = $request->product_id;
        $search     = $request->search;

        $model =  VendError::select(["location_non_functional.*", "client.client_name"])->leftJoin("machine", "machine.id", "=", "location_non_functional.machine_id")->leftJoin("client", "client.id", "=", "machine.machine_client_id")->where('location_non_functional.is_deleted', '0');

        if ($auth->client_id > 0) {
            $model =  $model->where('machine.machine_client_id', $auth->client_id);
            if (count($machine_ids) > 0) {
                $model =  $model->whereIn("location_non_functional.machine_id", $machine_ids);
            } else {
                $model =  $model->whereIn("location_non_functional.machine_id", ["no_machine"]);
            }
        }

        if ($machine_id) {
            $model =  $model->where('location_non_functional.machine_id', $machine_id);
        }
        //  else if ($product_id) {
        //     $model =  $model->where('location_non_functional.product_id', $product_id);
        // }

        if (!empty($search)) {
            // $model =  $model->group_start()
            //     ->like("location_non_functional.machine_name", $search, "after")
            //     ->or_like('location_non_functional.product_name', $search, "after")
            //     ->group_end();
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->whereRaw("location_non_functional.timestamp >= '$start_date'");
            $model  = $model->whereRaw("location_non_functional.timestamp <= '$end_date'");
        }

        $model =  $model->orderBy('location_non_functional.id', 'DESC')->limit(5)->get();
        return ['recent_vend_error' => $model];
    }

    public function getFeed($params, $request)
    {
        extract($params);
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;

        $model =  Feed::select(["feed.*", "machine.machine_name"])->leftJoin("machine", "machine.id", "=", "feed.machine_id");

        if ($auth->client_id > 0) {
            $model =  $model->where('feed.client_id', $auth->client_id);
            if (count($machine_ids) > 0) {
                $model =  $model->whereIn("feed.machine_id", $machine_ids);
            } else {
                $model =  $model->whereIn("feed.machine_id", ["no_machine"]);
            }
        }

        if ($machine_id) {
            $model =  $model->where('feed.machine_id', $machine_id);
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->whereRaw("feed.created_on >='$start_date'");
            $model  = $model->whereRaw("feed.created_on <='$end_date'");
        }

        $model =  $model->orderBy('feed.id', 'DESC')->limit(20)->get();
        return ['recent_feed' => $model];
    }

    public function sales15days($params)
    {
        extract($params);
        $model = Sale::selectRaw("DATE(`timestamp`) as date, FORMAT(SUM(`product_price`),2) as total_sale")->where('is_deleted', '0')->whereRaw('timestamp BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY) AND NOW()');
        if ($auth->client_id > 0) {
            if (count($machine_ids) > 0) {
                $model =  $model->whereIn("machine_id", $machine_ids);
            } else {
                $model =  $model->whereIn("machine_id", ["no_machine"]);
            }
            $model = $model->where("client_id", $auth->client_id);
        }
        $model = $model->groupBy("date")->get();
        $array = [];
        foreach ($model as $value) {
            $array[$value["date"]] = $value["total_sale"];
        }
        return ['15_days_sales' => $array];
    }
}
