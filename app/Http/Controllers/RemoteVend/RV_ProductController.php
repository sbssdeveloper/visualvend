<?php

namespace App\Http\Controllers\RemoteVend;

use App\Http\Controllers\Rest\BaseController;
use App\Models\MachineProductMap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RV_ProductController extends BaseController
{
    /**
     * @OA\Get(
     *     path="/remote/vend/products",
     *     summary="Machine Products List",
     *     tags={"Remote Vend"},
     * *    @OA\Parameter(
     *         name="machine_id",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="number"),
     *         description="Machine ID"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function list(Request $request)
    {
        $this->validate($request, ["machine_id" => 'required|exists:machine,id']);
        $model      = MachineProductMap::where("machine_id", $request->machine_id)->whereNotNull("product_id")->where("product_id", "<>", "");
        $model->orderBy(DB::raw('CAST(product_location AS UNSIGNED)'), 'asc');
        $model      = $model->get()->makeHidden("id");
        return parent::sendResponse("Success", $model);
    }

    /**
     * @OA\Get(
     *     path="/remote/vend/product/info",
     *     summary="Machine Products List",
     *     tags={"Remote Vend"},
     * *    @OA\Parameter(
     *         name="machine_id",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="number"),
     *         description="Machine ID"
     *     ),
     * *    @OA\Parameter(
     *         name="product_id",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="number"),
     *         description="Product ID"
     *     ),
     * *    @OA\Parameter(
     *         name="aisle_no",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="number"),
     *         description="Aisle ID"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function info(Request $request)
    {
        $this->validate($request, ["machine_id" => 'required|exists:machine,id', "product_id" => 'required', 'aisle_no' => "required"]);
        $model      = MachineProductMap::where("machine_id", $request->machine_id)->where("product_id", $request->product_id)->where("product_location", $request->aisle_no)->first()->makeHidden("id");
        return parent::sendResponse("Success", $model);
    }
}
