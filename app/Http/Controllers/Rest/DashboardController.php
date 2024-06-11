<?php

namespace App\Http\Controllers\Rest;

use App\Models\Admin;
use App\Models\Employee;
use App\Models\Feed;
use App\Models\Feedback;
use App\Models\LocationNonFunctional;
use App\Models\Machine;
use App\Models\MachineUser;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DashboardController extends LinkedMachineController
{
    public function __construct(Request $request)
    {
        \DB::statement("SET SQL_MODE=''");
    }

    /**
     * @OA\Post(
     *     path="/v1/info",
     *     summary="Dashboard Information",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="start_date", type="date", example="2024-01-01 00:00:00"),
     *             @OA\Property(property="end_date", type="date", example="2024-01-01 00:00:00"),
     *             @OA\Property(property="machine_id", type="date", example="machine_id"),
     *             @OA\Property(property="product_id", type="date", example="product_id"),
     *             @OA\Property(property="search", type="date", example="PEPSI"),
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
        $machines = Machine::dashboardInfo($request->auth, $this->linked_machines);
        $products = Product::dashboardInfo($request->auth);
        $staff    = Employee::dashboardInfo($request->auth);
        $users    = MachineUser::dashboardInfo($request->auth, $this->linked_machines);
        $sales    = Sale::dashboardInfo($request, $this->linked_machines);
        $refill   = Sale::recentRefill($request, $this->linked_machines);
        $feedback = Feedback::dashboardInfo($request, $this->linked_machines);
        $locNFn   = LocationNonFunctional::dashboardInfo($request, $this->linked_machines);
        $feedInfo = Feed::dashboardInfo($request, $this->linked_machines);
        $sale15   = Sale::sales15days($request, $this->linked_machines);
        $response = array_merge($machines, $products, $staff, $users, $sales, $refill, $feedback, $locNFn, $feedInfo, $sale15);
        return  $this->sendResponse($response, "Sucess");
    }
}
