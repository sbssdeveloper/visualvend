<?php

namespace App\Http\Repositories;

use Illuminate\Support\Facades\DB;
use Encrypt;
use App\Http\Controllers\Rest\BaseController;
use App\Mail\MachineRequestMail;
use App\Models\Cabinet;
use App\Models\Client;
use App\Models\MachineUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MachineUserRepository
{
    public $request;
    public $controller;

    public function __construct(Request $request, BaseController $controller)
    {
        $this->request = $request;
        $this->controller = $controller;
    }

    /**
     * @OA\Post(
     *     path="/v1/user/list",
     *     summary="Machine List",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                type="object",
     *                @OA\Property(property="length", type="integer", example=""),
     *                @OA\Property(property="search", type="string", example=""),
     *                @OA\Property(property="status", type="string", example="")
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

    public function list()
    {
        $search = $this->request->search;
        $status = $this->request->status;
        $model  = MachineUser::class;

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->where('firstname', 'like', "$search%");
                $query->orWhere('lastname', 'like', "$search%");
                $query->orWhere('mobilenumber', 'like', "$search%");
                $query->orWhere('emailid', 'like', "$search%");
            });
        }

        if (!empty($status)) {
            $model->where('status', $search);
        }
        $model->orderBy('last_updated', "DESC");

        $model = $model->paginate($this->request->length ?? 50);
        return $this->controller->sendResponseWithPagination($model);
    }

    /**
     * @OA\Post(
     *     path="/v1/user/available/list",
     *     summary="Machine User list",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="client_id", type="integer", example="20")
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

    public function availableList()
    {
        $client_id = $this->request->auth->client_id <= 0 ? $this->request->client_id : $this->request->auth->client_id;

        $model = MachineUser::select('username', 'firstname', 'lastname');
        $model->where("client_id", $client_id);
        $model->where("machines", "");
        $model->where("status", 1);
        $model = $model->where("is_deactivated", 0)->get();

        return $this->controller->sendResponse("Success", $model);
    }

    /**
     * @OA\Post(
     *     path="/v1/user/request/login",
     *     summary="Request Machine Login",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                type="object",
     *                @OA\Property(property="client_id", type="integer", example=""),
     *                @OA\Property(property="firstname", type="string", example=""),
     *                @OA\Property(property="lastname", type="string", example=""),
     *                @OA\Property(property="mobilenumber", type="string", example=""),
     *                @OA\Property(property="emailid", type="string", example=""),
     *                @OA\Property(property="username", type="string", example=""),
     *                @OA\Property(property="password", type="string", example=""),
     *                @OA\Property(property="password_confirmation", type="string"),
     *                @OA\Property(property="cabinet_style", type="string"),
     *                @OA\Property(property="machine_name", type="string"),
     *                @OA\Property(property="cabinet_rows", type="integer"),
     *                @OA\Property(property="cabinet_columns", type="integer"),
     *                @OA\Property(property="start_end_aisle", type="string",enum={"01-99","1-99"})
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

    public function requestLogin()
    {
        $cabinet                    = [];
        $login                      = $this->request->only("firstname", "lastname", "mobilenumber", "emailid", "username");
        $login['password']          = Hash::make($this->request->password);
        $login['uuid']              = (string) Encrypt::uuid();
        $login["client_id"]         = $this->request->auth->client_id <= 0 ? $this->request->client_id : $this->request->auth->client_id;
        $cabinet['uuid']            = (string) Encrypt::uuid();
        $cabinet['user_uuid']       = $login['uuid'];
        $cabinet['style']           = $this->request->cabinet_style;
        $cabinet['name']            = $this->request->machine_name;
        $cabinet['max_rowss']        = $this->request->cabinet_rows;
        $cabinet['max_columns']     = $this->request->cabinet_columns;
        $cabinet['aisles_format']   = $this->request->start_end_aisle;

        $model  = Client::where("id", $login["client_id"])->first();
        DB::beginTransaction();
        try {
            MachineUser::insert($login);
            Cabinet::insert($cabinet);
            DB::commit();
            self::sendMail($model);
            return $this->controller->sendSuccess("Machine login request successfully submiited.");
        } catch (\Exception $e) {
            DB::rollback();
            return $this->controller->sendError($e->getMessage());
        }
    }

    function sendMail($model)
    {
        $emailObj = [
            "name" => "Admin",
            "message" => "Please approve the Machine Login request for the below mentioned.",
            "client_name" => $model->client_name
        ];

        if (!empty($model->client_address)) {
            $emailObj['client_address'] = $model->client_address;
        }

        if (!empty($model->client_mobile_number)) {
            $emailObj['client_mobile_number'] = $model->client_phone;
        }

        if (!empty($model->client_email)) {
            $emailObj['client_email'] = $model->client_email;
        }

        if (!empty($model->business_registration_number)) {
            $emailObj['business_registration_number'] = $model->business_registration_number;
        }

        $object = new MachineRequestMail($emailObj);

        $to = env("ADMIN_EMAIL");

        $message = "Mail sent successfully.";

        $emailMessage = $this->controller->sendEmail(compact("object", "to", "message"));
        die($emailMessage);
        return $emailMessage;
    }
}
