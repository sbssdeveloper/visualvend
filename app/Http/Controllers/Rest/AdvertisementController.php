<?php

namespace App\Http\Controllers\Rest;

use App\Models\Advertisement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdvertisementController extends LinkedMachineController
{
    /**
     * @OA\Get(
     *     path="/v1/advertisement/list",
     *     summary="Advertisement list",
     *     tags={"V1"},
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */
    public function list(Request $request, Advertisement $model)
    {
        $admin              = $request->auth->admin_id ?? "client";
        $linked_machines    = $this->linked_machines;
        $response = Cache::remember("advertisement-info:'$admin'", env('GLOBAL_CACHE_TIME', 600), function () use ($model, $request, $linked_machines) {
            return $model->bundle($request, $linked_machines);
        });
        return $this->sendResponse("Success",$response);
    }
}
