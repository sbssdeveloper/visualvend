<?php

namespace App\Http\Controllers\Rest;

use App\Models\Admin;
use App\Models\Machine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class MachineController extends LinkedMachineController
{
    /**
     * @OA\Get(
     *     path="/v1/machine/list",
     *     summary="Machine Dropdown list",
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

    public function dropdownList(Request $request)
    {
        $response = Cache::remember("machine-listing:$this->admin_logged_in", env('LISTING_TIME_LIMIT', 300), function () use ($request) {
            $admin_id   = $request->auth->admin_id;
            $client_id  = $request->auth->client_id;
            $machines   = $this->linked_machines;

            $model      = Machine::select("id", "machine_name")->where("is_deleted", "0");

            if ($client_id > 0) {
                $model  = $model->where("machine_client_id", $client_id)->whereIn("id", $machines);
            }

            return ($model  = $model->orderBy('machine_name', "ASC")->get());
        });

        return parent::sendResponse("Success", $response);
    }

    /**
     * @OA\Post(
     *     path="/v1/machine/list",
     *     summary="Machine list",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="length", type="integer", example="20"),
     *             @OA\Property(property="page", type="integer", example="1"),
     *             @OA\Property(property="search", type="integer")
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
     *         description="Success."
     *     )
     * )
     */

    public function list(Request $request)
    {
        $admin_id   = $request->auth->admin_id;
        $client_id  = $request->auth->client_id;
        $machines   = $this->linked_machines;

        $model      = Machine::select("id", "machine_name")->where("is_deleted", "0");

        /**Machine with search param */

        if ($request->has("search")) {
            $model = $model->where(function ($query) use ($request) {
                $query->where("machine_name", "LIKE", $request->search . "%");
            });
        }

        if ($client_id > 0) {
            $model  = $model->where("machine_client_id", $client_id)->whereIn("id", $machines);
        }

        if ($request->has("sort") && $request->has("direction")) {
            $model  = $model->orderBy($request->sort, $request->direction);
        }

        $model  = $model->paginate($request->length ?? 10);
        return parent::sendResponse("Success", $model);
    }

    /**
     * @OA\Post(
     *     path="/v1/machine/info",
     *     summary="Machine liinfost",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="machine_id", type="integer", example="596")
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
     *         description="Success."
     *     )
     * )
     */

    public function info(Request $request)
    {
        $machine_id   = $request->machine_id;

        $model      = Machine::select("id", "machine_name")->where("id", $machine_id)->get();
        
        return parent::sendResponse("Success", $model);
    }
}
