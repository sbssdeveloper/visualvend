<?php

namespace App\Http\Repositories;

use App\Http\Controllers\Rest\BaseController;
use App\Models\Admin;
use App\Models\Client;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ClientRepository
{
    public $controller;

    public function __construct(BaseController $controller)
    {
        $this->controller = $controller;
    }

    /**
     * @OA\Post(
     *     path="/v1/client/list",
     *     summary="Clients List",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="search", type="string", example=""),
     *             @OA\Property(property="length", type="integer", example=100),
     *             @OA\Property(property="type", type="string", example="active")
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

    public function listing($request)
    {
        $model = Client::withCount("portal_users", "machine_users");

        if ($request->type === "active") {
            $model->where("status", 'A');
        } else {
            $model->where("status", "!=", 'D');
        }

        if (!empty($request->search)) {
            $model->where(function ($query) use ($request) {
                $query->where("client_code", "like", $request->search . "%");
                $query->orWhere("client_name", "like", $request->search . "%");
                $query->orWhere("client_username", "like", $request->search . "%");
                $query->orWhere("client_phone", "like", $request->search . "%");
                $query->orWhere("client_email", "like", $request->search . "%");
            });
        }

        $model->orderBy("updated_at", "DESC");

        $model = $model->paginate($request->length ?? 100);

        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/client/info",
     *     summary="Clients Info",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="client_id", type="integer", example="")
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

    public function info($request)
    {
        $model = Client::with(['portal_users', 'machine_users'])->where("id", $request->client_id)->first();
        return $this->controller->sendResponse("Success", $model);
    }

    /**
     * @OA\Post(
     *     path="/v1/client/create",
     *     summary="Clients Create",
     *     tags={"V1"},
     *      @OA\Parameter( name="client_name", in="query", required=true, @OA\Schema(type="string")),
     *      @OA\Parameter( name="client_code", in="query", required=true, @OA\Schema(type="string")),
     *      @OA\Parameter( name="business_registration_number", in="query", required=true, @OA\Schema(type="string")),
     *      @OA\Parameter( name="client_email", in="query", required=true, @OA\Schema(type="string")),
     *      @OA\Parameter( name="client_phone", in="query", required=true, @OA\Schema(type="string")),
     *      @OA\Parameter( name="client_address", in="query", required=true, @OA\Schema(type="string")),
     *      @OA\Parameter( name="report_sale", in="query", required=false, @OA\Schema(type="boolean")),
     *      @OA\Parameter( name="report_refill", in="query", required=false, @OA\Schema(type="boolean")),
     *      @OA\Parameter( name="report_vend_error", in="query", required=false, @OA\Schema(type="boolean")),
     *      @OA\Parameter( name="report_feedback", in="query", required=false, @OA\Schema(type="boolean")),
     *      @OA\Parameter( name="report_media_ad", in="query", required=false, @OA\Schema(type="boolean")),
     *      @OA\Parameter( name="report_staff", in="query", required=false, @OA\Schema(type="boolean")),
     *      @OA\Parameter( name="report_customer", in="query", required=false, @OA\Schema(type="boolean")),
     *      @OA\Parameter( name="report_e_receipt", in="query", required=false, @OA\Schema(type="boolean")),
     *      @OA\Parameter( name="report_gift_vend", in="query", required=false, @OA\Schema(type="boolean")),
     *      @OA\Parameter( name="enable_portal", in="query", required=false, @OA\Schema(type="boolean")),
     *      @OA\Parameter( name="password", in="query", required=false, @OA\Schema(type="string")),
     *      @OA\Parameter( name="confirm_password", in="query", required=false, @OA\Schema(type="string")),
     *      @OA\Parameter( name="selected_report", in="query", required=false, @OA\Schema(type="string")),
     *      @OA\Parameter( name="selected_menu", in="query", required=false, @OA\Schema(type="string")),
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

    public function create($request)
    {
        $clients                                = $request->only("client_code", "client_name", "business_registration_number", "client_address", "client_email", "client_phone");
        $clients["role"]                        = "Full Access";
        $clients["client_username"]             =  $clients["client_name"];
        $clients["created_by"]                  =  $request->auth->firstname;
        $clients["enable_mail_sale_report"]     =  $request->report_sale;
        $clients["enable_mail_refill"]          =  $request->report_refill;
        $clients["enable_mail_non_functional"]  =  $request->report_vend_error;
        $clients["enable_mail_feedback"]        =  $request->report_feedback;
        $clients["enable_mail_ad"]              =  $request->report_media_ad;
        $clients["enable_mail_report"]          =  $request->report_staff;
        $clients["enable_mail_e_receipt"]       =  $request->report_e_receipt;
        $clients["enable_mail_gift"]            =  $request->report_gift_vend;
        $clients["status"]                      =  "I";
        $clients["client_password"]             =  Hash::make($request->password);
        DB::beginTransaction();
        try {
            $client = Client::create($clients);
            if ($request->enable_portal == 1) {
                $exploded_name = explode(" ", $clients["client_name"]);
                $admin = [
                    'mobilenumber' => $clients["client_phone"],
                    'firstname' => $exploded_name[0],
                    'lastname' => isset($exploded_name[1]) ? $exploded_name[1] : "",
                    'role' => 'Full Access',
                    'organization' => $clients["client_name"],
                    'emailid' => $clients["client_email"],
                    'password' => $clients["client_password"],
                    'client_id' => $client->id,
                    'username' => $clients["client_code"],
                    'upt_no' => "+87810" . $clients["client_phone"],
                    'menus' => $request->menus,
                    'reports' => $request->reports
                ];
                Admin::create($admin);
            }
            DB::commit();
            return $this->controller->sendSuccess("Client created successfully.");
        } catch (\Exception $th) {
            DB::rollback();
            return $this->controller->sendError($th->getMessage());
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/client/update",
     *     summary="Clients Update",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="client_id", type="integer", example=""),
     *             @OA\Property(property="client_name", type="string", example=""),
     *             @OA\Property(property="business_registration_number", type="string", example=""),
     *             @OA\Property(property="client_address", type="string", example="")
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

    public function update($request)
    {
        $fields = $request->except("client_id");
        try {
            Client::find($request->client_id)->update($fields);
            return $this->controller->sendSuccess("Client updated successfully.");
        } catch (\Throwable $th) {
            return $this->controller->sendError($th->getMessage());
        }
    }
}
