<?php

namespace App\Http\Repositories;

use App\Models\HappyHoursData;
use DB;
use Encrypt;
use App\Http\Controllers\Rest\BaseController;
use App\Http\Helpers\PlanogramHelper;
use App\Models\HappyHours;
use App\Models\Machine;
use App\Models\MachineAssignProduct;
use App\Models\MachineProductMap;
use App\Models\Planogram;
use App\Models\PlanogramData;
use App\Models\Product;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Illuminate\Support\Facades\Storage;
use function asset; 

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
        if ($this->request->type === "live") {
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
     *                @OA\Property(property="multi_plano", type="integer", example=1),
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

    // public function upload()
    // {
    //     $response = null;
    //     $uuid           = (string) Encrypt::uuid();
    //     $model          = Machine::where("id", $this->request->machine_id)->first();
    //     $client_id      = $model->machine_client_id;
    //     $sheetData      = $this->planogram->uploadFile($this->request);
    //     $shiftedData    = array_shift($sheetData);
    //     if (count($sheetData) > 0) {
    //         $formatCheck    = $this->helper->check_format_type($shiftedData);
    //         extract($this->helper->formatPairs($formatCheck));
    //         $formatAuth = $this->helper->formatAuthenticate($shiftedData, $formatValues);
    //         if ($formatAuth["success"] === true) {
    //             $arrayObj = ["sheet_data" => $sheetData, 'machine_id' => $this->request->machine_id, "client_id" => $client_id, 'formatKeys' => $formatKeys, 'formatValues' => $formatValues, "category" => $formatCheck["category"], 'model' => $model];
    //             $response = $this->helper->uploadNow($this->helper->planoProductMap($arrayObj));
    //             ["code" => $code, "message" => $message] = $response;
    //             unset($response["code"], $response["message"]);
    //             if ($code == 200) {
    //                 return $this->controller->sendResponse($message, $response);
    //             }
    //             return $this->controller->sendError($message, $response);
    //         } else {
    //             return $this->controller->sendError($formatAuth["error"]);
    //         }
    //     }
    //     return $this->controller->sendError("Uploaded sheet is empty.");
    // }
    public function upload()
    {
        $response = null;
        $uuid           = (string) Encrypt::uuid();
        $model          = Machine::where("id", $this->request->machine_id)->first();
        $client_id      = $model->machine_client_id;
        $sheetData      = $this->planogram->uploadFile($this->request);
        $shiftedData    = array_shift($sheetData);
        if (count($sheetData) > 0) {
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
        return $this->controller->sendError("Uploaded sheet is empty.");
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
        if (count($sheetData) > 0) {
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
        return $this->controller->sendError("Uploaded sheet is empty.");
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
            if (count($sheetData) > 0) {
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
                        $response["no_of_product_updated"] = isset($crud["mapped"]) ? count($crud["mapped"]) : 0;
                        return $this->controller->sendResponse($crud["message"], $response);
                    } else {
                        return $this->controller->sendError($crud["message"]);
                    }
                } else {
                    return $this->controller->sendError($formatAuth["error"]);
                }
            }
            return $this->controller->sendError("Uploaded sheet is empty.");
        }
        return $this->controller->sendError("Machines list should be active.");
    }

    /**
     * @OA\Post(
     *     path="/v1/planogram/reset",
     *     summary="Planogram Reset",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                type="object",
     *                required={"machine_id"},
     *                @OA\Property(property="machine_id", type="integer", example="")
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

    public function reset()
    {
        $machine_id = $this->request->machine_id;
        DB::beginTransaction();
        try {
            MachineProductMap::where("machine_id", $machine_id)->delete();
            MachineAssignProduct::where("machine_id", $machine_id)->delete();
            $updatedRows = Planogram::where("machine_id", $machine_id)->where("status", "Active")->update(["status" => "Backup"]);
            DB::commit();
            return $this->controller->sendSuccess("Planogram reset successfully.");
        } catch (\Exception $e) {
            DB::rollback();
            return $this->controller->sendError($e->getMessage());
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/planogram/view",
     *     summary="Planogram View",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                type="object",
     *                @OA\Property(property="uuid", type="string", example=""),
     *                @OA\Property(property="type", type="string", enum={"live","happy_hours"})
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

    public function view()
    {
        $model = $this->request->type == "live" ? PlanogramData::class : HappyHoursData::class;

        $data = $model::where("plano_uuid", $this->request->uuid)->get();

        return $this->controller->sendResponse("Success", $data);
    }

    /**
     * @OA\Post(
     *     path="/v1/planogram/delete",
     *     summary="Planogram Delete",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                type="object",
     *                @OA\Property(property="uuid", type="string", example=""),
     *                @OA\Property(property="type", type="string", enum={"live","happy_hours"})
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

    public function delete()
    {
        $plano = $this->request->type == "live" ? Planogram::class : HappyHours::class;
        $model = $this->request->type == "live" ? PlanogramData::class : HappyHoursData::class;

        $data = $plano::where("uuid", $this->request->uuid)->first();

        DB::beginTransaction();
        try {
            if ($data->status === "Active") {
                MachineAssignProduct::where("machine_id", $data->machine_id)->delete();
                MachineProductMap::where("machine_id", $data->machine_id)->delete();
            }
            $data->delete();
            $model::where("plano_uuid", $this->request->uuid)->delete();
            DB::commit();
            return $this->controller->sendSuccess("Planogram deleted successfully.");
        } catch (\Exception $e) {
            DB::rollback();
            return $this->controller->sendError($e->getMessage());
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/planogram/status/update",
     *     summary="Planogram Status Update",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                type="object",
     *                @OA\Property(property="uuid", type="string", example=""),
     *                @OA\Property(property="type", type="string", enum={"live","happy_hours"})
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

    public function status()
    {
        $plano = $this->request->type == "live" ? Planogram::class : HappyHours::class;
        $model = $this->request->type == "live" ? PlanogramData::class : HappyHoursData::class;

        $data = $plano::where("uuid", $this->request->uuid)->first();

        DB::beginTransaction();
        try {
            if ($this->request->type == "live" && $data->status === "Backup") {
                MachineProductMap::where("machine_id", $data->machine_id)->delete();
                MachineAssignProduct::where("machine_id", $data->machine_id)->delete();
                MachineProductMap::insert(
                    PlanogramData::where("plano_uuid", $this->request->uuid)->get()->makeHidden(['id', 'plano_uuid'])->toArray()
                );
                MachineAssignProduct::insert(
                    MachineProductMap::select(DB::raw("id as product_map_id"), "machine_id", "category_id", "product_id", "product_price", "product_location", "product_quantity", "product_max_quantity", "show_order", "s2s", "aisles_included", "vend_quantity", "bundle_includes", "bundle_price", "currency")->where("machine_id", $data->machine_id)->get()->toArray()
                );
            }
            $plano::where("status", "Active")->update(["status" => $this->request->type == "live" ? "Backup" : "Inactive"]);
            $data->status = "Active";
            $data->save();
            DB::commit();
            return $this->controller->sendSuccess("Planogram status updated successfully.");
        } catch (\Exception $e) {
            DB::rollback();
            return $this->controller->sendError($e->getMessage());
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/planogram/mobile/list",
     *     summary="Planogram Mobile List",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(property="machine_id", type="integer", default=""),
     *              @OA\Property(property="search", type="string", default=""),
     *              @OA\Property(property="type", type="string", default=""),
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

    public function mobileList($machines)
    {
        $client_id  = $this->request->auth->client_id;
        $machine_id = $this->request->machine_id;
        $search     = $this->request->search;
        $type       = $this->request->type;

        $select             = "";
        switch ($type) {
            case 'machine':
                $select = "machine_id";
                break;
            default:
                $select = "status";
                break;
        }

        $planogram  = Planogram::selectRaw($select);

        if ($type == "machine") {
            $planogram->with(["machine" => function ($select) {
                $select->select("machine_name", "id");
            }]);
        }

        $happy_hours = HappyHours::selectRaw($select);

        if ($type == "machine") {
            $happy_hours->with(["machine" => function ($select) {
                $select->select("machine_name", "id");
            }]);
        }

        if ($machine_id > 0) {
            $planogram->where("machine_id", $machine_id);
            $happy_hours->where("machine_id", $machine_id);
        }

        if ($client_id > 0) {
            $planogram->whereIn("machine_id", $machines);
            $happy_hours->whereIn("machine_id", $machines);
        }

        if (!empty($search)) {
            if ($type == "machine") {
                $planogram->where(function ($query) use ($search) {
                    $query->whereHas("machine", function ($hasQuery) use ($search) {
                        $hasQuery->where("machine_name", "like", "$search%")->where("is_deleted", 0);
                    });
                });
                $happy_hours->where(function ($query) use ($search) {
                    $query->whereHas("machine", function ($hasQuery) use ($search) {
                        $hasQuery->where("machine_name", "like", "$search%")->where("is_deleted", 0);
                    });
                });
            }
        } else {
            $planogram->whereHas("machine", function ($query) {
                $query->where("is_deleted", 0);
            });

            $happy_hours->whereHas("machine", function ($query) {
                $query->where("is_deleted", 0);
            });
        }

        $planogram->groupBy($type == "machine" ? "machine_id" : "status")->orderBy("id", "DESC");
        $happy_hours->groupBy($type == "machine" ? "machine_id" : "status")->orderBy("id", "DESC");
        $model = $planogram->union($happy_hours)->paginate($this->request->length ?? 50);
        return $this->controller->sendResponseWithPagination($model, "Success");
    }

    /**
     * @OA\Post(
     *     path="/v1/planogram/mobile/list/data",
     *     summary="Planogram Mobile List Data",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(property="type", type="integer", default=""),
     *              @OA\Property(property="value", type="integer", default=""),
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

    public function mobileListData($machines)
    {
        $client_id  = $this->request->auth->client_id;
        $machine_id = $this->request->machine_id;
        $search     = $this->request->search;
        $type       = $this->request->type;
        $value      = $this->request->value;

        $planogram  = Planogram::select(DB::raw("DATE_FORMAT(`created_at`, '%Y-%m-%d %H:%i:%s') as date"), "uuid",  DB::raw("'Indefinite' as start_date"), DB::raw("'Indefinite' as end_date"), "parent_uuid", "machine_id", "name", "status", "age_verify", DB::raw("0 as duration"),  DB::raw("1 as is_default"),  DB::raw("'live' as planogram_type"))->with(["machine" => function ($select) {
            $select->select("machine_name", "id");
        }]);

        $happy_hours = HappyHours::select(DB::raw("DATE_FORMAT(`created_at`, '%Y-%m-%d %H:%i:%s') as date"), "uuid", "start_date", "end_date", "parent_uuid", "machine_id", "name", "status", "age_verify", DB::raw("TIMESTAMPDIFF(HOUR,happy_hours.start_date,happy_hours.end_date) as duration"), DB::raw("0 as is_default"), DB::raw("'happy_hours' as planogram_type"))->with(["machine" => function ($select) {
            $select->select("machine_name", "id");
        }]);

        if ($type === "machine") {
            $planogram->where("machine_id", $value);
            $happy_hours->where("machine_id", $value);
        } else {
            $planogram->where("status", $value);
            $happy_hours->where("status", $value);
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
        return $this->controller->sendResponseWithPagination($model, "Success");
    }

    /**
     * @OA\Post(
     *     path="/v1/planogram/export",
     *     summary="Planogram Export",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(property="type", type="string", default=""),
     *              @OA\Property(property="machine_id", type="integer", default="")
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

    // public function export()
    // {
    //     $linkedAisles   = $finalData = [];
    //     $machine_id     = $this->request->machine_id;
    //     $type           = $this->request->type;
    //     $model          = Machine::select("machine_client_id", "machine_is_single_category")->where("id", $machine_id)->first();
    //     $mapModel       = MachineProductMap::where('machine_id', $machine_id)->whereRaw("product_id <>''")->whereRaw("product_location <>''");

    //     if (!$type || $type === "planogram") {
    //         $mapModel->orderByRaw("CAST(product_location AS UNSIGNED) ASC");
    //     }
    //     $mapModel     = $mapModel->get()->toArray();

    //     if (count($mapModel)) {
    //         $planogram = [];
    //         foreach ($mapModel as $key => $value) {
    //             $product_id                 = $value["product_id"];
    //             if (isset($planogram[$product_id])) {
    //                 $planogram[$product_id] .= "," . $value["product_location"];
    //             } else {
    //                 $planogram[$product_id]  = $value["product_location"];
    //             }
    //         }
    //         foreach ($mapModel as $key => $value) {
    //             $plano_id                   = $value["id"];
    //             $product_id                 = $value["product_id"];
    //             $product_location           = $value["product_location"];
    //             $category_id                = $value["category_id"];
    //             $product_quantity           = $value["product_quantity"];
    //             $product_max_quantity       = $value["product_max_quantity"];
    //             $product_location           = $value["product_location"];
    //             $product_price              = $value["product_price"];
    //             if (empty($product_price) || ((float)$product_price < 0)) {
    //                 $local_product          = Product::select("product_price")->where("product_id", $product_id)->where("client_id", $model->machine_client_id)->where("is_deleted", "0")->first();
    //                 if ($local_product) {
    //                     $product_price      = preg_replace('#[^0-9\.,]#', '', $local_product->product_price);;
    //                 }
    //             }
    //             $aisles_included            = isset($planogram[$product_id]) ? $planogram[$product_id] : "";
    //             $vend_quantity              = $value["vend_quantity"] > 0 ? $value["vend_quantity"] : 1;
    //             $bundle_includes            = $value["bundle_includes"];
    //             $bundle_price               = preg_replace('#[^0-9\.,]#', '', $value["bundle_price"]);
    //             if (empty($bundle_price) || (float)$bundle_price <= 0) {
    //                 $bundle_price           = $product_price;
    //             }
    //             $product_image              = $value["product_image"];
    //             if (empty($product_image)) {
    //                 $product_image              = "ngapp/assets/img/default_product.png";
    //             }
    //             $product_image_thumbnail        = $value["product_image_thumbnail"];
    //             if (empty($product_image_thumbnail)) {
    //                 $product_image_thumbnail    = $product_image;
    //             }
    //             $product_more_info_image        = $value["product_more_info_image"];
    //             if (empty($product_more_info_image)) {
    //                 $product_more_info_image    = "ngapp/assets/img/default_product.png";
    //             }
    //             $product_detail_image           = $value["product_detail_image"];
    //             if (empty($product_detail_image)) {
    //                 $product_detail_image       = "ngapp/assets/img/default_product.png";
    //             }
    //             $product_more_info_video    = $value["product_more_info_video"];
    //             $product_detail_video       = $value["product_detail_video"];
    //             $s2s                        = $value["s2s"];
    //             $s2s_type                   = $value["s2s_type"];

    //             if (isset($linkedAisles[$product_id])) {
    //                 $linkedAisles[$product_id] = $linkedAisles[$product_id] . "," . $value["product_location"];
    //             } else {
    //                 $linkedAisles[$product_id] = $value["product_location"];
    //             }
    //             $finalData[$key]                = [
    //                 "id"                        => $plano_id,
    //                 "machine_is_single_category" => $model->machine_is_single_category,
    //                 "product_id"                 => $product_id,
    //                 "product_location"           => $product_location,
    //                 "category_id"                => $category_id,
    //                 "product_quantity"           => $product_quantity,
    //                 "product_max_quantity"       => $product_max_quantity,
    //                 "product_location"           => $product_location,
    //                 "product_price"              => $product_price,
    //                 "aisles_included"            => $aisles_included,
    //                 "vend_quantity"              => $vend_quantity,
    //                 "bundle_includes"            => $bundle_includes,
    //                 "bundle_price"               => $bundle_price,
    //                 "product_image"              => $product_image,
    //                 "product_image_thumbnail"    => $product_image_thumbnail,
    //                 "product_more_info_image"    => $product_more_info_image,
    //                 "product_detail_image"       => $product_detail_image,
    //                 "product_more_info_video"    => $product_more_info_video,
    //                 "product_detail_video"       => $product_detail_video,
    //                 "s2s"                        => $s2s,
    //                 "s2s_type"                   => $s2s_type
    //             ];
    //         }

    //         foreach ($finalData as $key => $value) {
    //             $product_id         = $value["product_id"];
    //             if (isset($linkedAisles[$product_id])) {
    //                 $finalData[$key]["aisles_included"] = $linkedAisles[$product_id];
    //             }
    //         }
    //     }

    //     return $this->controller->sendResponse("Success", $finalData);
    // }


    public function export(Request $request)
    {
        $machine_id = $request->machine_id;
        $type = $request->type;

        $model = Machine::select("machine_client_id","machine_name", "machine_is_single_category")
            ->where("id", $machine_id)
            ->first();

        $query = MachineProductMap::where('machine_id', $machine_id)
            ->whereRaw("product_id <>''")
            ->whereRaw("product_location <>''");

        if (!$type || $type === "planogram") {
            $query->orderByRaw("CAST(product_location AS UNSIGNED) ASC");
        }

        $mapModel = $query->get();

        if ($mapModel->isEmpty()) {
            return response()->json(["success" =>false,"message" => "No data available"]);
        }
        // Create Spreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Set Headers
        $headers = [
            "Product Code", "Category Code", "Quantity", "Capacity", "Aisle No", "Product Price",
            "Aisles Included", "Vend Quantity", "Bundle Includes", "Bundle Price", "Product Image",
            "Product Image Thumbnail", "Product More Info Image", "Product Detail Image",
            "Product More Info Video", "Product Detail Video", "S2S", "S2S Type"
        ];

        // Add Headers to Excel
        $colIndex = 1;
        foreach ($headers as $header) {
            $sheet->setCellValueByColumnAndRow($colIndex++, 1, $header);
        }

        // Add Data
        $rowIndex = 2;
        foreach ($mapModel as $item) {
            $colIndex = 1;
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->product_id);
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->category_id);
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->product_quantity);
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->product_max_quantity);
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->product_location);
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->product_price);
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->product_location);
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->vend_quantity > 0 ? $item->vend_quantity : 1);
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->bundle_includes);
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->bundle_price);
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->product_image ?? "ngapp/assets/img/default_product.png");
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->product_image_thumbnail ?? "ngapp/assets/img/default_product.png");
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->product_more_info_image ?? "ngapp/assets/img/default_product.png");
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->product_detail_image ?? "ngapp/assets/img/default_product.png");
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->product_more_info_video);
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->product_detail_video);
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->s2s);
            $sheet->setCellValueByColumnAndRow($colIndex++, $rowIndex, $item->s2s_type);
            $rowIndex++;
        }

        // Save File
        $fileName =  $model->machine_name. '_' . time() . ".xlsx";
        $filePath = "exports/" . $fileName;
        
        // Ensure the directory exists
        $directory = storage_path('app/public/exports');
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }
        
        // Save the spreadsheet
        $writer = new Xlsx($spreadsheet);
        $writer->save($directory . '/' . $fileName);
        
        // Generate the download URL
        $downloadUrl = url('storage/exports/' . $fileName);
        return response()->json(["success" => true, "download_url" => $downloadUrl]);
    }
}
