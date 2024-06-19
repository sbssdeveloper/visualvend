<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\MachineProductMap;
use App\Models\RefillHistory;
use App\Models\StockReset;
use Illuminate\Http\Request;

class StockController extends BaseController
{
    public function __construct()
    {
        $this->middleware('jwt'); //['except' => ['login']]
    }

    /**
     * @OA\Post(
     *     path="/api/stock/list",
     *     summary="Stock List",
     *     tags={"Quizee"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="machine_id", type="integer")
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
     *         description="Success with api information."
     *     )
     * )
     */

    public function list(Request $request, MachineProductMap $product_map)
    {
        $this->validate($request, ['machine_id' => 'required']);
        $machineInfo = Machine::select("machine_row", "machine_column")->where("id", $request->machine_id)->first();
        return $this->sendResponse("Success", ["dimensions" => $machineInfo, "stock" => $product_map->currentStock($request)]);
    }

    /**
     * @OA\Post(
     *     path="/api/stock/reset",
     *     summary="Stock Reset",
     *     tags={"Quizee"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="machine_id", type="integer"),
     *             @OA\Property(property="aisles", type="string")
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
     *         description="Success with api information."
     *     )
     * )
     */

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

    /**
     * @OA\Post(
     *     path="/api/stock/refill",
     *     summary="Stock Refill",
     *     tags={"Quizee"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="machine_id", type="integer"),
     *             @OA\Property(property="aisles", type="string")
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
     *         description="Success with api information."
     *     )
     * )
     */

    public function refill(Request $request, RefillHistory $model)
    {
        $this->validate($request, ['machine_id' => 'required|exists:machine,id', "aisles" => "required"]);
        $model = $model->refill($request);
        extract($model);
        if ($response == "success") {
            return $this->sendSuccess("Aisle Refilled successfully.");
        } else {
            return $this->sendError($message);
        }
    }
}
