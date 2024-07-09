<?php

namespace App\Http\Repositories;

use DB;
use Encrypt;
use App\Http\Controllers\Rest\BaseController;
use App\Http\Helpers\PlanogramHelper;
use App\Models\HappyHours;
use App\Models\Machine;
use App\Models\Planogram;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

use function PHPSTORM_META\type;

class PlanogramRepository
{
    public $helper = null;
    public $request = null;
    public $controller = null;
    public $planogram = null;
    public function __construct(Request $request, BaseController $controller, Planogram $planogram, PlanogramHelper $helper)
    {
        $this->request      = $request;
        $this->helper       = $helper;
        $this->controller   = $controller;
        $this->planogram    = $planogram;
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

        $planogram  = Planogram::select(DB::raw("DATE_FORMAT(`created_at`, '%Y-%m-%d %H:%i:%s') as date"), "uuid",  DB::raw("'Indefinite' as start_date"), DB::raw("'Indefinite' as end_date"), "parent_uuid", "machine_id", "name", "status", "age_verify", DB::raw("0 as duration"),  DB::raw("1 as is_default"),  DB::raw("'live' as planogram_type"))->with(["machine" => function ($select) {
            $select->select("machine_name", "id");
        }]);

        $happy_hours = HappyHours::select(DB::raw("DATE_FORMAT(`created_at`, '%Y-%m-%d %H:%i:%s') as date"), "uuid", "start_date", "end_date", "parent_uuid", "machine_id", "name", "status", "age_verify", DB::raw("TIMESTAMPDIFF(HOUR,happy_hours.start_date,happy_hours.end_date) as duration"), DB::raw("0 as is_default"), DB::raw("'happy_hours' as planogram_type"))->with(["machine" => function ($select) {
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
            "withObj"   => ["withVal" => "machine_name", "with" => "machine"]
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

    /**
     * @OA\Post(
     *     path="/v1/planogram/upload",
     *     summary="New Planogram Upload",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                type="object",
     *                required={"machine_id","file","name"},
     *                @OA\Property(property="client_id", type="integer", example=""),
     *                @OA\Property(property="name", type="string", example=""),
     *                @OA\Property(property="machine_id", type="string", example=""),
     *                @OA\Property(property="type", type="string", enum={"live","happy_hours"}),
     *                @OA\Property(property="start_date", type="string", example=""),
     *                @OA\Property(property="end_date", type="string", example=""),
     *                @OA\Property(property="multi_planogram", type="integer", example=1),
     *                @OA\Property(
     *                  property="file",
     *                  description="File",
     *                  type="string",
     *                  format="binary"
     *                )
     *             )
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
     *         description="Success with api information."
     *     )
     * )
     */

    public function upload()
    {
        $response = null;
        $uuid           = (string) Encrypt::uuid();
        $model          = Machine::where("id", $this->request->machine_id)->first();
        $client_id      = $model->machine_client_id;
        $sheetData      = $this->planogram->uploadFile($this->request);
        $shiftedData    = array_shift($sheetData);
        $formatCheck    = $this->helper->check_format_type($shiftedData);
        extract($this->helper->formatPairs($formatCheck));
        $formatAuth = $this->helper->formatAuthenticate($shiftedData, $formatValues);
        if ($formatAuth["success"] === true) {
            $arrayObj = ["sheet_data" => $sheetData, 'machine_id' => $this->request->machine_id, "client_id" => $client_id, 'formatKeys' => $formatKeys, 'formatValues' => $formatValues, "category" => $formatCheck["category"], 'model' => $model];
            $response = $this->helper->uploadNow($this->helper->planoProductMap($arrayObj));
            ["code" => $code, "message" => $message] = $response;
            unset($response["code"], $response["message"]);
            if ($code == 200) {
                return $this->controller->sendResponse($message, $response);
            }
            return $this->controller->sendError($message, $response);
        } else {
            return $this->controller->sendError($formatAuth["error"]);
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/planogram/update",
     *     summary="New Planogram Update",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                type="object",
     *                required={"uuid","type","name", "file"},
     *                @OA\Property(property="uuid", type="string", example=""),
     *                @OA\Property(property="type", type="string", example="live"),
     *                @OA\Property(property="name", type="string", example=""),
     *                @OA\Property(property="start_date", type="string", example=""),
     *                @OA\Property(property="end_date", type="string", example=""),
     *                @OA\Property(
     *                  property="file",
     *                  description="File",
     *                  type="string",
     *                  format="binary"
     *                )
     *             )
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
     *         description="Success with api information."
     *     )
     * )
     */

    public function update()
    {
        $uuid       = $this->request->uuid;
        $name       = $this->request->name;
        $type       = $this->request->type;
        $start_date = $this->request->start_date;
        $end_date   = $this->request->end_date;
        $model      = null;
        if ($type == "live") {
            $model = Planogram::where('uuid', $uuid)->first();
        } else {
            $model = HappyHours::where('uuid', $uuid)->first();
        }
        $sheetData      = $this->planogram->uploadFile($this->request);
        $shiftedData    = array_shift($sheetData);
        $formatCheck    = $this->helper->check_format_type($shiftedData);
        extract($this->helper->formatPairs($formatCheck));
        $formatAuth     = $this->helper->formatAuthenticate($shiftedData, $formatValues);
        if ($formatAuth["success"] === true) {
            $arrayObj = ["sheet_data" => $sheetData, 'formatKeys' => $formatKeys, 'formatValues' => $formatValues, "category" => $formatCheck["category"], "uuid" => $uuid, "start_date" => $start_date, "end_date" => $end_date, 'machine_id' => $model->machine_id, "client_id" => $model->client_id, "type" => $type, "name" => $name];

            $response = $this->helper->updateUploadNow($this->helper->planoProductMapForUpdate($arrayObj));

            ["code" => $code, "message" => $message] = $response;
            unset($response["code"], $response["message"]);
            if ($code == 200) {
                return $this->controller->sendResponse($message, $response);
            }
            return $this->controller->sendError($message, $response);
        } else {
            return $this->controller->sendError($formatAuth["error"]);
        }
    }

    public function multi_upload()
    {
        $response       = [];
        $client_id      = $this->client_id > 0 ? $this->client_id : $this->request->client_id;
        $name           = $this->request->name;
        $start_date     = $this->request->start_date;
        $end_date       = $this->request->end_date;
        $machines       = explode(",", $this->request->machine_id);
        $type           = $this->request->type;
        $authen         = Machine::where("machine_client_id", $client_id);
        $authen->whereIn("id", $machines);
        $authen->where("is_deleted", 0);
        $count = $authen->count();
        if ($count === count($machines)) {
            $sheetData      = $this->planogram->uploadFile($this->request);
            $shiftedData    = array_shift($sheetData);
            $formatCheck    = $this->helper->check_format_type($shiftedData);
            extract($this->helper->formatPairs($formatCheck));
            $formatAuth = $this->helper->formatAuthenticate($shiftedData, $formatValues);
            if ($formatAuth["success"] === true) {
                $arrayObj = [
                    "sheet_data"    => $sheetData,
                    'machines'      => $machines,
                    "client_id"     => $client_id,
                    'formatKeys'    => $formatKeys,
                    'formatValues'  => $formatValues,
                    "category"      => $formatCheck["category"]
                ];
                $formatter = $this->helper->multiPlanoProductMap($arrayObj);
                $crud = [];
                if ($type === "happy_hours") {
                    $crud   = $this->helper->subPlanogramInsert(compact('machines', 'name', 'formatter', 'start_date', 'end_date'));
                } else {
                    $crud   = $this->helper->livePlanogramInsert(compact('machines', 'name', 'formatter'));
                }
                if ($crud["success"] === true) {
                    if ($formatter["errors"] > 0) {
                        $response["error_message"] = $formatter["error_text"];
                        $response["no_of_error"] = $formatter["errors"];
                    }
                    if ($formatter["warnings"] > 0) {
                        $response["warning_message"] = $formatter["warning_text"];
                        $response["no_of_warnings"] = $formatter["warnings"];
                    }
                    $response["no_of_product_updated"] = count($crud["mapped"]);
                    return $this->controller->sendResponse($crud["message"], $response);
                } else {
                    return $this->controller->sendError($crud["message"]);
                }
            } else {
                return $this->controller->sendError($formatAuth["error"]);
            }
        }
        return $this->controller->sendError("Machines list should be active.");
    }
}
