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
