<?php

namespace App\Http\Repositories;

use App\Http\Controllers\Rest\BaseController;
use App\Models\Machine;

class MachineRepository
{
    public $controller;
    public function __construct(BaseController $controller)
    {
        $this->controller = $controller;
    }

    /**
     * @OA\Post(
     *     path="/v1/machine/refill/info",
     *     summary="Refill Info",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(property="machine_id", type="integer")
     *          )
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

    public function refillInfo($request)
    {
        $model = Machine::select("id","machine_name")->with([
            "category" => function ($query) {
                $query->select("machine_id", "category_id");
            },
            "product_map" => function ($query) {
                $query->select("machine_id","product_id", "product_name", "product_location as aisle_no", "product_quantity", "product_max_quantity");
            }
        ])->where("id", $request->machine_id)->first();
        return $this->controller->sendResponse("Success",$model);
    }
}
