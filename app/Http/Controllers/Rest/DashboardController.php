<?php

namespace App\Http\Controllers\Rest;

use DB;
use App\Models\Admin;
use App\Models\Employee;
use App\Models\Feed;
use App\Models\Feedback;
use App\Models\LocationNonFunctional;
use App\Models\Machine;
use App\Models\MachineProductMap;
use App\Models\MachineUser;
use App\Models\Product;
use App\Models\RemoteVend;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DashboardController extends LinkedMachineController
{
    public function __construct(Request $request)
    {
        parent::__construct($request);
        DB::statement("SET SQL_MODE=''");
    }

    /**
     * @OA\Post(
     *     path="/v1/info",
     *     summary="Dashboard Information",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="start_date", type="string", example="2024-01-01 00:00:00"),
     *             @OA\Property(property="end_date", type="string", example="2024-01-01 00:00:00"),
     *             @OA\Property(property="machine_id", type="integer"),
     *             @OA\Property(property="product_id", type="string"),
     *             @OA\Property(property="search", type="string"),
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with dashboard information."
     *     )
     * )
     */

    public function info(Request $request)
    {
       
        $machines = Machine::dashboardInfo($request, $this->linked_machines);
        $products = Product::dashboardInfo($request->auth);
        $staff    = Employee::dashboardInfo($request->auth);
        $users    = MachineUser::dashboardInfo($request, $this->linked_machines);
        $sales    = Sale::dashboardInfo($request, $this->linked_machines);
        $refill   = Sale::recentRefill($request, $this->linked_machines);
        $feedback = Feedback::dashboardInfo($request, $this->linked_machines);
        $locNFn   = LocationNonFunctional::dashboardInfo($request, $this->linked_machines);
        $feedInfo = Feed::dashboardInfo($request, $this->linked_machines);
        $sale7    = Sale::sales7days($request, $this->linked_machines);

        $auth           = $request->auth;
        $machine_ids    = $this->linked_machines;
        $params         = compact("auth", 'machine_ids', 'request');
        $vend_sales     = ["vend_sales" => RemoteVend::recentVend($params)];
        $response       = array_merge($machines, $products, $staff, $users, $sales, $refill, $feedback, $locNFn, $feedInfo, $sale7, $vend_sales);
        $response["stock_level"]  = MachineProductMap::stocks($params);
        return  $this->sendResponse("Success", $response);
    }
}
