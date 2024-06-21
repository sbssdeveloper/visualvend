<?php

namespace App\Http\Helpers;

use DB;
use App\Models\Machine;
use App\Models\MachineInitialSetup;

class MachineHelper
{
    /**
     * @OA\Post(
     *     path="/v1/machine/create",
     *     summary="Machine Create",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"machine_username","machine_row","machine_column","machine_address","machine_latitude","machine_longitude","machine_is_single_category"},
     *             @OA\Property(property="machine_username", type="string"),
     *             @OA\Property(property="machine_row", type="integer"),
     *             @OA\Property(property="machine_column", type="integer"),
     *             @OA\Property(property="machine_address", type="string"),
     *             @OA\Property(property="machine_client_id", type="integer"),
     *             @OA\Property(property="machine_latitude", type="string"),
     *             @OA\Property(property="machine_longitude", type="string"),
     *             @OA\Property(property="machine_is_single_category", type="integer")
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

    public function create($request, $machine, $controller)
    {
        $data = $request->only("machine_username", "machine_row", "machine_column", "machine_address", "machine_latitude", "machine_longitude", "machine_is_single_category");

        if ($request->auth->client_id <= 0) {
            $data["machine_client_id"] = $request->client_id;
        }

        DB::beginTransaction();
        try {
            $machine_id = Machine::insertGetId($data);
            MachineUser::where("username", $data["machine_username"])->update(["machines" => $machine_id]);
            $data["id"] = $machine_id;
            MachineInitialSetup::insert($data);
            DB::commit();
            return $controller->sendSuccess("Machine created successfully.");
        } catch (\Exception $e) {
            DB::rollback();
            return $controller->sendError($e->getMessage());
        }
    }
}
