<?php

namespace App\Http\Controllers\Rest;

use App\Http\Helpers\MachineHelper;
use App\Models\Admin;
use App\Models\Machine;
use App\Rules\MachineUserRule;
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
     *     summary="Machine Information",
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

        $model      = Machine::where("id", $machine_id)->first();

        return parent::sendResponse("Success", $model);
    }

    public function create(Request $request, MachineHelper $helper, BaseController $controller, MachineUserRule $rule)
    {
        $rules = [
            "machine_name"                  => "required|string|min:3,max:50",
            "machine_row"                   => "required|integer|min:1,max:16",
            "machine_column"                => "required|integer|min:1,max:16",
            "machine_address"               => "required|string",
            "machine_latitude"              => ["required", 'regex:/^[-]?(([0-8]?[0-9])\.(\d+))|(90(\.0+)?)$/'],
            "machine_longitude"             => ["required", 'regex:/^[-]?(([0-8]?[0-9])\.(\d+))|(90(\.0+)?)$/'],
            "machine_is_single_category"    => "required|in:0,1",
            'machine_username'              => ["required", $rule],
        ];

        if ($request->auth->client_id <= 0) {
            $rules['machine_client_id'] = "required|integer|min:1";
        }

        $this->validate($request, $rules);

        return $helper->create($request, $controller);
    }

    public function update(Request $request, MachineHelper $helper, BaseController $controller)
    {
        $rules = [
            "machine_name"                  => "required|string|min:3,max:50",
            "machine_row"                   => "required|integer|min:1,max:16",
            "machine_column"                => "required|integer|min:1,max:16",
            "machine_address"               => "required|string",
            "machine_latitude"              => ["required", 'regex:/^[-]?(([0-8]?[0-9])\.(\d+))|(90(\.0+)?)$/'],
            "machine_longitude"             => ["required", 'regex:/^[-]?(([0-8]?[0-9])\.(\d+))|(90(\.0+)?)$/'],
            "machine_is_single_category"    => "required|in:0,1"
        ];

        $this->validate($request, $rules);

        return $helper->update($request, $controller);
    }
}
