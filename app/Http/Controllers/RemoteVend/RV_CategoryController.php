<?php

namespace App\Http\Controllers\RemoteVend;

use App\Http\Controllers\Rest\BaseController;
use App\Models\Customer;
use App\Models\Machine;
use Illuminate\Http\Request;

class RV_CategoryController extends BaseController
{

    /**
     * @OA\Get(
     *     path="/remote/vend/categories",
     *     summary="Category List",
     *     tags={"Remote Vend"},
     * *    @OA\Parameter(
     *         name="machine_id",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="number"),
     *         description="Machine ID"
     *     ),
     * *    @OA\Parameter(
     *         name="type",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string"),
     *         description="Category Type"
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

    public function list(Request $request)
    {
        $this->validate($request, ["machine_id" => 'required|exists:machine,id']);
        $model = Machine::where("id", $request->machine_id)->row();
        $categorys = $model->categorys()->get();
        print_r($categorys);
    }
}
