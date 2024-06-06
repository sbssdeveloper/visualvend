<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\MachineProductMap;
use Illuminate\Http\Request;

class StockController extends BaseController
{
    public function __construct()
    {
        $this->middleware('jwt'); //['except' => ['login']]
    }

    public function list(Request $request, MachineProductMap $product_map)
    {
        $this->validate($request, ['machine_id' => 'required']);
        $machineInfo = Machine::select("machine_row", "machine_column")->where("id", $request->machine_id)->first();
        return $this->sendResponse(["dimensions" => $machineInfo, "stock" => $product_map->currentStock($request)], "Success");
    }
}
