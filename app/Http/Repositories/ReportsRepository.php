<?php

namespace App\Http\Repositories;

use DB;
use App\Http\Controllers\Rest\BaseController;
use App\Models\Sale;
use Illuminate\Http\Request;

class ReportsRepository
{
    public $request = null;
    public $controller = null;
    public function __construct(Request $request, BaseController $controller)
    {
        $this->request      = $request;
        $this->controller   = $controller;
        $this->role         = $request->auth->role;
        $this->client_id    = $request->auth->client_id;
        $this->admin_id     = $request->auth->admin_id;
    }

    /**
     * @OA\Post(
     *     path="/v1/reports/sales",
     *     summary="Reports Sale",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"start_date","end_date"},              
     *              @OA\Property(property="start_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="end_date", type="date", example="2024-01-01"),
     *              @OA\Property(property="machine_id", type="integer", example=196),
     *              @OA\Property(property="type", type="string", example=""),
     *              @OA\Property(property="search", type="string", example="")
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

    public function sales($machines)
    {
        $where              = $allIds = $pairedIds = $saleMachines =  [];
        $search             = $this->request->search;

        $model              = Sale::select("*", DB::raw("IF(aisle_no IS NULL,'NA',aisle_no) as aisles"), DB::raw("FORMAT(product_price,2) as price"))->with("product")->where("is_deleted", 0);

        if ($this->client_id > 0) {
            $model          = $model->where("client_id", $this->client_id);
        }

        if ($this->client_id > 0 && !in_array($this->role, ["Super Admin", "Full Access"])) {
            $model          = $model->where("id NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$this->admin_id)");
        }

        if (!empty($search)) {
            $model      = $model->where(function ($query) use ($search) {
                $query->where("product_name", "LIKE", "$search%")->orWhere("machine_name", "LIKE", "$search%")->orWhere("employee_name", "LIKE", "$search%");
            });
        }

        if (!empty($this->request->machine_id)) {
            $model                  = $model->where("machine_id", $this->request->machine_id);
        } elseif ($this->client_id > 0) {
            $model      = $model->whereIn("machine_id", $machines);
        }

        if (!empty($this->request->start_date) && !empty($this->request->end_date)) {
            $model          = $model->whereDate('timestamp', '>=', $this->request->start_date)->whereDate('timestamp', '<=', $this->request->end_date);
        }


        if ($this->request->type === "machine") {
            $model          = $model->orderBy('machine_name', "ASC");
        } else if ($this->request->type === "employee") {
            $model          = $model->orderBy("employee_name", "DESC");
        } else if ($this->request->type === "product") {
            $model          = $model->orderBy("product_name", "ASC");
        } else if ($this->request->type === "pickup") {
            $model          = $model->orderBy('pickup_or_return', "ASC");
        } else if ($this->request->type === "return") {
            $model          = $model->orderBy('pickup_or_return', "DESC");
        } else {
            $model          = $model->orderBy('machine_name', "ASC");
        }
        $model              = $model->groupBy("id")->paginate($this->request->length ?? 50);
        $data =  $this->controller->sendResponseWithPaginationList($model, [
            "type"      => $this->request->type,
            "selector"  => "id",
            "typeArr"   => ["machine", "employee", "product"],
            "keyName"   => $this->request->type === "machine" ? "machine_id" : ($this->request->type === "employee" ? "employee_id" : "product_id"),
            "valName"   => $this->request->type === "machine" ? "machine_name" : ($this->request->type === "employee" ? "employee_name" : "product_name"),
        ]);
        $data["top_selling"] = $this->top_selling($machines);
        if(count($data["top_selling"])>0){
            $data["least_selling"] = $this->least_selling($machines, end($data["top_selling"])["count"] ?? 0);
        }else{
            $data["least_selling"] = [];
        }
        return $this->controller->sendResponseReport($data);
    }

    function top_selling($machines)
    {        
        $search = $this->request->search;
        $model  = Sale::select("product_id", "machine_name", "product_name",  DB::raw("count(product_id) as count"))->where("is_deleted", 0);

        if ($this->client_id > 0) {
            $model          = $model->where("client_id", $this->client_id);
        }

        if ($this->client_id > 0 && !in_array($this->role, ["Super Admin", "Full Access"])) {
            $model          = $model->where("id NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$this->admin_id)");
        }

        if (!empty($search)) {
            $model      = $model->where(function ($query) use ($search) {
                $query->where("product_name", "LIKE", "$search%")->orWhere("machine_name", "LIKE", "$search%")->orWhere("employee_name", "LIKE", "$search%");
            });
        }

        if (!empty($this->request->machine_id)) {
            $model                  = $model->where("machine_id", $this->request->machine_id);
        } elseif ($this->client_id > 0) {
            $model      = $model->whereIn("machine_id", $machines);
        }

        if (!empty($this->request->start_date) && !empty($this->request->end_date)) {
            $model          = $model->whereDate('timestamp', '>=', $this->request->start_date)->whereDate('timestamp', '<=', $this->request->end_date);
        }
        $model          = $model->groupBy("product_id")->orderBy("count", "DESC")->limit(5)->get()->toArray();
        return $model;
    }

    function least_selling($machines, $lowerLimit)
    {
        $search = $this->request->search;
        $model  = Sale::select("product_id", "machine_name", "product_name",  DB::raw("count(product_id) as count"))->where("is_deleted", 0);

        if ($this->client_id > 0) {
            $model          = $model->where("client_id", $this->client_id);
        }

        if ($this->client_id > 0 && !in_array($this->role, ["Super Admin", "Full Access"])) {
            $model          = $model->where("id NOT IN (SELECT `sale_id` FROM `hidden_sale_reports` WHERE `user_id`=$this->admin_id)");
        }

        if (!empty($search)) {
            $model      = $model->where(function ($query) use ($search) {
                $query->where("product_name", "LIKE", "$search%")->orWhere("machine_name", "LIKE", "$search%")->orWhere("employee_name", "LIKE", "$search%");
            });
        }

        if (!empty($this->request->machine_id)) {
            $model                  = $model->where("machine_id", $this->request->machine_id);
        } elseif ($this->client_id > 0) {
            $model      = $model->whereIn("machine_id", $machines);
        }

        if (!empty($this->request->start_date) && !empty($this->request->end_date)) {
            $model          = $model->whereDate('timestamp', '>=', $this->request->start_date)->whereDate('timestamp', '<=', $this->request->end_date);
        }
        $model          = $model->groupBy("product_id")->orderBy("count", "ASC")->having("count", "<", $lowerLimit)->limit(5)->get()->toArray();
        return $model;
    }
}
