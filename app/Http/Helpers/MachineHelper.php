<?php

namespace App\Http\Helpers;

use DB;
use App\Models\Machine;
use App\Models\MachineUser;
use App\Models\MachineInitialSetup;

class MachineHelper
{
    /**
     * @OA\Post(
     *     path="/v1/machine/create",
     *     summary="Machine Insert",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"machine_username",
     *                  "machine_name",
     *                  "machine_row",
     *                  "machine_column",
     *                  "machine_address",
     *                  "machine_latitude",
     *                  "machine_longitude",
     *                  "machine_is_single_category"
     *              },              
     *              @OA\Property(property="machine_name", type="string"),
     *              @OA\Property(property="machine_username", type="string"),
     *              @OA\Property(property="machine_row", type="integer"),
     *              @OA\Property(property="machine_column", type="integer"),
     *              @OA\Property(property="machine_address", type="string"),
     *              @OA\Property(property="machine_latitude", type="string"),
     *              @OA\Property(property="machine_longitude", type="string"),
     *              @OA\Property(property="machine_is_single_category", type="number"),
     *              @OA\Property(property="machine_client_id", type="integer"),
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOjE2MSwiYWRtaW5faWQiOjE1OX0sImlhdCI6MTcxODk2ODA3OSwiZXhwIjoxNzI0MTUyMDc5fQ.LuLaN2o66G1CYxBRa0uheC-ETKD2IiOv3sxEq8QPg7g"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function create($request, $controller)
    {
        $data = $request->only("machine_name", "machine_username", "machine_row", "machine_column", "machine_address", "machine_latitude", "machine_longitude", "machine_is_single_category");

        if ($request->auth->client_id <= 0) {
            $data["machine_client_id"] = $request->client_id;
        } else {
            $data["machine_client_id"] = $request->auth->client_id;
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

    /**
     * @OA\Post(
     *     path="/v1/machine/update",
     *     summary="Machine Update",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"machine_name",
     *                  "machine_row",
     *                  "machine_column",
     *                  "machine_address",
     *                  "machine_latitude",
     *                  "machine_longitude",
     *                  "machine_is_single_category"
     *              },              
     *              @OA\Property(property="machine_name", type="string"),
     *              @OA\Property(property="machine_row", type="integer"),
     *              @OA\Property(property="machine_column", type="integer"),
     *              @OA\Property(property="machine_address", type="string"),
     *              @OA\Property(property="machine_latitude", type="string"),
     *              @OA\Property(property="machine_longitude", type="string"),
     *              @OA\Property(property="machine_is_single_category", type="number")
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string"),
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOjE2MSwiYWRtaW5faWQiOjE1OX0sImlhdCI6MTcxODk2ODA3OSwiZXhwIjoxNzI0MTUyMDc5fQ.LuLaN2o66G1CYxBRa0uheC-ETKD2IiOv3sxEq8QPg7g"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success."
     *     )
     * )
     */

    public function update($request, $controller)
    {
        $data = $request->only("machine_name", "machine_row", "machine_column", "machine_address", "machine_latitude", "machine_longitude", "machine_is_single_category");

        DB::beginTransaction();
        try {
            $machine_id = $request->machine_id;
            Machine::where("id", $machine_id)->update($data);
            MachineInitialSetup::where("id", $machine_id)->update($data);
            DB::commit();
            return $controller->sendSuccess("Machine updated successfully.");
        } catch (\Exception $e) {
            DB::rollback();
            return $controller->sendError($e->getMessage());
        }
    }
}
