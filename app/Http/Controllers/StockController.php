<?php

namespace App\Http\Controllers;

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
        return $this->sendResponse($product_map->currentStock($request), "Success");
    }
}
