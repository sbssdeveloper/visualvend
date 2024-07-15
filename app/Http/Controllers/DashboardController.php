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
        $machines   = Machine::personal($request, 'columns', ['id', 'machine_name', 'machine_client_id']);
        $collection = collect($machines);

        $machine_ids = $collection->map(function ($item, $key) {
            return $item->id;
        })->all();

        $params                                 = compact("auth", 'machine_ids', 'request');
        $response                               = [];
        $response["vend_machines"]              = count($machine_ids);
        $response["items_vended"]               = Sale::recentVend($params);
        $response["payment_types"]              = RemoteVend::recentVend($params);
        $response["vend_beat"]                  = self::machine_info($params, true);

        $response["stock_level"]                = MachineProductMap::stocks($params);
        $response["feedback"]["refill"]         = self::recentRefill($params)["recent_refill"];
        $response["feedback"]["vend_run"]       = self::recentVend($params)["recent_vend"];
        $response["feedback"]["tasks"]          = [["refill" => "no-data"]];
        $response["feedback"]["feed"]           = self::getFeed($params)["recent_feed"];
        $today_sales                            =
            $response["other"]                      = [
                'bump_in'   => "00",
                'bump_out'  => "00"
            ];
        return parent::sendResponse("Success", $response);
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

    function recentVend($params)
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

    public function recentRefill($params)
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

        $model              = "SELECT `sale_report`.*, `client`.`client_name`, (`machine_product_map`.`product_max_quantity` - `sale_report`.`aisle_remain_qty`) as refill FROM `sale_report` LEFT JOIN  `machine_product_map` ON `machine_product_map`.`machine_id`=`sale_report`.`machine_id` AND `machine_product_map`.`product_location`=`sale_report`.`aisle_no` AND `machine_product_map`.`product_id`=`sale_report`.`product_id` LEFT JOIN  `client` ON `sale_report`.`client_id`=`client`.`id` WHERE `sale_report`.`product_id`<>''";

        if ($machine_id > 0) {
            $model         .= " AND `sale_report`.`machine_id`=$machine_id";
        } else if ($auth->client_id > 0) {
            if (count($machine_ids) == 0) {
                $machine_ids = ["no-machine"];
            }
            $my_machines    = implode(",", $machine_ids);
            $model         .= " AND `sale_report`.`client_id`=$auth->client_id";
            $model         .= " AND `sale_report`.`machine_id` IN ($my_machines)";
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

    public function getFeed($params)
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
}
