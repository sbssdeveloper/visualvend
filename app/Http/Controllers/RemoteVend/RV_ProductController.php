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
     *         required=true,
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
        $model      = MachineProductMap::where("machine_id", $request->machine_id)->whereNotNull("product_id");
        $model->orderBy(DB::raw('CAST(product_location AS UNSIGNED)'), 'asc');
        $model      = $model->get()->makeHidden("id");
        return parent::sendResponse("Success", $model);
    }
}
