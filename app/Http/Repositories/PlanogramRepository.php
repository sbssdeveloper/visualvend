<?php

namespace App\Http\Repositories;

use DB;
use App\Http\Controllers\Rest\BaseController;
use App\Models\HappyHours;
use App\Models\Planogram;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class PlanogramRepository
{
    public $request = null;
    public $controller = null;
    public function __construct(Request $request, BaseController $controller)
    {
        $this->request      = $request;
        $this->controller   = $controller;
        $this->client_id    = $request->auth->client_id;
    }

    /**
     * @OA\Post(
     *     path="/v1/planogram/list",
     *     summary="Planogram List",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(property="machine_id", type="integer", default=""),
     *              @OA\Property(property="search", type="string", default=""),
     *          )
     *     ),
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2aXN1YWx2ZW5kLWp3dCIsInN1YiI6eyJjbGllbnRfaWQiOi0xLCJhZG1pbl9pZCI6NX0sImlhdCI6MTcxOTU1ODk3NywiZXhwIjoxNzI0NzQyOTc3fQ.clotIfYAWfTd8uE304UeUN5wNScJrs-vVxNH2gv04K8",
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

    public function list($machines)
    {
        $client_id  = $this->request->auth->client_id;
        $machine_id = $this->request->machine_id;
        $search     = $this->request->search;
        $type       = $this->request->type;

        $planogram  = Planogram::select("created_at", "uuid",  DB::raw("NULL as start_date"), DB::raw("NULL as end_date"), "parent_uuid", "machine_id", "name", "status", "age_verify", DB::raw("0 as duration"),  DB::raw("1 as is_default"),  DB::raw("'live' as planogram_type"))->with(["machine" => function ($select) {
            $select->select("machine_name", "id");
        }]);

        $happy_hours = HappyHours::select("created_at", "uuid","start_date", "end_date", "parent_uuid", "machine_id", "name", "status", "age_verify", DB::raw("TIMESTAMPDIFF(HOUR,happy_hours.start_date,happy_hours.end_date) as duration"), DB::raw("0 as is_default"), DB::raw("'happy_hours' as planogram_type"))->with(["machine" => function ($select) {
            $select->select("machine_name", "id");
        }]);

        if ($machine_id > 0) {
            $planogram->where("machine_id", $machine_id);
            $happy_hours->where("machine_id", $machine_id);
        }

        if ($client_id > 0) {
            $planogram->whereIn("machine_id", $machines);
            $happy_hours->whereIn("machine_id", $machines);
        }

        if (!empty($search)) {
            $planogram->where(function ($query) use ($search) {
                $query->where("name", "like", "$search%")->orWhereHas("machine", function ($hasQuery) use ($search) {
                    $hasQuery->where("machine_name", "like", "$search%")->where("is_deleted", 0);
                });
            });
            $happy_hours->where(function ($query) use ($search) {
                $query->where("name", "like", "$search%")->orWhereHas("machine", function ($hasQuery) use ($search) {
                    $hasQuery->where("machine_name", "like", "$search%")->where("is_deleted", 0);
                });
            });
        } else {
            $planogram->whereHas("machine", function ($query) {
                $query->where("is_deleted", 0);
            });

            $happy_hours->whereHas("machine", function ($query) {
                $query->where("is_deleted", 0);
            });
        }
        $planogram->orderBy("id", "DESC");
        $happy_hours->orderBy("id", "DESC");
        $model = $planogram->union($happy_hours)->paginate($this->request->length ?? 50);
        $data =  $this->controller->sendResponseWithPaginationList($model, [
            "type"      => $this->request->type,
            "selector"  => "uuid",
            "typeArr"   => ["machine", "status"],
            "keyName"   => $this->request->type === "machine" ? "machine_id" : "status",
            "valName"   => $this->request->type === "machine" ? "machine_name" : "status",
            "withObj"   => ["withVal" => "machine_name","with"=>"machine"]
        ]);
        return $this->controller->sendResponseReport($data);
    }

    /**
     * @OA\Get(
     *     path="/v1/planogram/info",
     *     summary="Planoram Info",
     *     tags={"V1"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="string"),
     *         description="UUID"
     *     ),
     *     @OA\Parameter(
     *         name="type",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="string",  enum={"planogram", "happy_hours"}),
     *         description="Planogram Type: 'planogram' (Planogram), 'happy_hours' (Happy Hours)"
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

    public function info()
    {
        $model = null;
        if ($this->request->type === "planogram") {
            $model = Planogram::with("planogram_data")->where("uuid", $this->request->uuid)->first();
        } else {
            $model = HappyHours::with("happy_hours_data")->where("uuid", $this->request->uuid)->first();
        }

        return $this->controller->sendResponse("Success", $model);
    }
}
