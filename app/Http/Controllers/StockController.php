<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\MachineProductMap;
use App\Models\StockReset;
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

    public function reset(Request $request, StockReset $model)
    {
        $this->validate($request, ['machine_id' => 'required|exists:machine,id', "aisles" => "required"]);
        $model = $model->reset($request);
        extract($model);
        if ($response == "success") {
            return $this->sendSuccess("Aisle resetted successfully.");
        } else {
            return $this->sendError($message);
        }
    }
}
