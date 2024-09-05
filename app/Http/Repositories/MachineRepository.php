<?php

namespace App\Http\Repositories;

use App\Http\Controllers\Rest\BaseController;
use App\Models\AdvertisementImage;
use App\Models\AssignedAdvertisement;
use App\Models\Employee;
use App\Models\EmployeeGroup;
use App\Models\HappyHours;
use App\Models\HappyHoursData;
use App\Models\Machine;
use App\Models\MachineAssignCategory;
use App\Models\MachineInitialSetup;
use App\Models\MachineProductMap;
use App\Models\MachineUser;
use App\Models\Planogram;
use App\Models\PlanogramData;
use App\Models\TemporaryHappyHours;
use App\Models\TemporaryPlanogramData;
use App\Models\User;
use Carbon\Carbon;
use DB;

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
        $model = Machine::select("id", "machine_name")->with([
            "category" => function ($query) {
                $query->select("machine_id", "category_id");
            },
            "product_map" => function ($query) {
                $query->select("machine_id", "product_id", "product_name", "product_location as aisle_no", "product_quantity", "product_max_quantity");
            }
        ])->where("id", $request->machine_id)->first();
        return $this->controller->sendResponse("Success", $model);
    }

    /**
     * @OA\Delete(
     *     path="/v1/machine/delete/{id}",
     *     summary="Delete a machine",
     *     description="Deletes machine by ID",
     *     tags={"V1"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the machine to delete",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *      @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcyMjUwOTE4NSwiZXhwIjoxNzI3NjkzMTg1fQ.4pu6tlg3HVwHCh2Px21XPscE0niVfMZgpIR8rDSu15I",
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="machine deleted successfully",
     *     ),
     *     @OA\Response(    
     *         response=404,
     *         description="machine not found",
     *     ),
     *     security={
     *         {"api_key": {}}
     *     }
     * )
     */

    public function remove($id)
    {
        // echo $id;
        $model = Machine::where("id", $id)->first();
        if ($model) {
            DB::beginTransaction();
            try {
                $model->is_deleted = 1;
                $model->delete_user_id = request()->auth->client_id;
                $model->deleted_at = Carbon::now();
                $model->machine_username = "useless_now";
                $model->save();
                MachineProductMap::where("machine_id", $id)->delete();
                MachineAssignCategory::where("machine_id", $id)->delete();
                AssignedAdvertisement::where("machine_id", $id)->delete();
                AdvertisementImage::where("machine_id", $id)->delete();
                MachineInitialSetup::where("id", $id)->delete();
                Planogram::where("machine_id", $id)->delete();
                HappyHours::where("machine_id", $id)->delete();
                PlanogramData::where("machine_id", $id)->delete();
                HappyHoursData::where("machine_id", $id)->delete();
                $admins = User::whereRaw("FIND_IN_SET(?, machines)", [$id])->get();
                if (count($admins)) {
                    foreach ($admins as $admin) {
                        $machines = explode(",", $admin->machines);
                        $machines = array_filter($machines, function ($machine) use ($id) {
                            return $machine != $id;
                        });
                        $machines = implode(",", $machines);
                        $admin->machines = $machines;
                        $admin->save();
                    }
                }
                $users = MachineUser::whereRaw("FIND_IN_SET(?, machines)", [$id])->get();
                if (count($users)) {
                    foreach ($users as $user) {
                        $machines = explode(",", $user->machines);
                        $machines = array_filter($machines, function ($machine) use ($id) {
                            return $machine != $id;
                        });
                        $machines = implode(",", $machines);
                        $user->machines = $machines;
                        $user->save();
                    }
                }
                $empGroups = EmployeeGroup::whereRaw("FIND_IN_SET(?, machines)", [$id])->get();
                if (count($empGroups)) {
                    foreach ($empGroups as $empGroup) {
                        $machines = explode(",", $empGroup->machines);
                        $machines = array_filter($machines, function ($machine) use ($id) {
                            return $machine != $id;
                        });
                        $machines = implode(",", $machines);
                        $empGroup->machines = $machines;
                        $empGroup->save();
                    }
                }
                $employees = Employee::whereRaw("FIND_IN_SET(?, machines)", [$id])->get();
                if (count($employees)) {
                    foreach ($employees as $employee) {
                        $machines = explode(",", $employee->machines);
                        $machines = array_filter($machines, function ($machine) use ($id) {
                            return $machine != $id;
                        });
                        $machines = implode(",", $machines);
                        $employee->machines = $machines;
                        $employee->save();
                    }
                }
                DB::commit();
                return $this->controller->sendSuccess("Machine deleted successfully.");
            } catch (\Exception $e) {
                DB::rollback();
                return $this->controller->sendError($e->getMessage());
            }
        } else {
            return $this->controller->sendError("No machine found.");
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/machine/products/list",
     *     summary="Machine Products",
     *     tags={"V1"},
     *     @OA\Parameter(
     *         name="machine_id",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="number"),
     *         description="Machine ID ID"
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

    public function machineProducts($request)
    {
        $machine_id = $request->machine_id;
        $model = MachineProductMap::where("machine_id", $machine_id)->where("product_location", "<>", "")->where("product_id", "<>", "")->get();
        return $this->controller->sendResponse("Success",$model);
    }

    /**
     * @OA\Get(
     *     path="/v1/machine/product/info",
     *     summary="Machine Product Info",
     *     tags={"V1"},
     *     @OA\Parameter(
     *         name="id",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="number"),
     *         description="ID"
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

    public function productInfo($request)
    {
        $id = $request->id;
        $model = MachineProductMap::where("id", $id)->get();
        return $this->controller->sendResponse("Success",$model);
    }
}
