<?php

namespace App\Http\Repositories;

use App\Http\Controllers\Rest\BaseController;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminRepository
{
    public $request = null;
    public $controller = null;

    public function __construct(Request $request, BaseController $controller)
    {
        $this->request = $request;
        $this->controller = $controller;
    }

    /**
     * @OA\Post(
     *     path="/v1/admin/list",
     *     summary="Admin List",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"name","path"},              
     *              @OA\Property(property="search", type="string", example=""),
     *              @OA\Property(property="status", type="string", enum={0, 1, 2}),
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
        $model = Admin::select("*");

        if ($this->request->client_id > 0) {
            $model->where('client_id', $this->request->client_id);
        }

        if (!empty($search)) {
            $model->where(function ($query) use ($search) {
                $query->whereRaw("CONCAT(firstname,' ',lastname) LIKE %$search%");
                $query->orWhere("emailid", "LIKE", "$search%");
                $query->orWhere("mobilenumber", "LIKE", "$search%");
            });
        }

        if (!empty($status)) {
            $model->where('is_activated', $status);
        }

        $model = $model->paginate($this->request->length ?? 50);
        return $this->controller->sendResponse("Success", $model);
    }

    /**
     * @OA\Post(
     *     path="/v1/admin/create",
     *     summary="Admin Create",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"mobilenumber","firstname", "lastname","role", "emailid","password","username"},              
     *              @OA\Property(property="mobilenumber", type="string", example=""),
     *              @OA\Property(property="firstname", type="string", example=""),
     *              @OA\Property(property="lastname", type="string", example=""),
     *              @OA\Property(property="role", type="string", example=""),
     *              @OA\Property(property="emailid", type="string", example=""),
     *              @OA\Property(property="password", type="string", example=""),
     *              @OA\Property(property="client_id", type="string", example=""),
     *              @OA\Property(property="menus", type="string", example=""),
     *              @OA\Property(property="machines", type="string", example=""),
     *              @OA\Property(property="reports", type="string", example=""),
     *              @OA\Property(property="username", type="string", example=""),
     *              @OA\Property(property="show_data_after", type="string"),
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

    public function create()
    {
        $params = $this->request->only('mobilenumber', 'firstname', 'lastname', 'role', 'emailid', 'password', 'menus', 'machines', 'reports', 'username', 'show_data_after');

        $params["password"] = Hash::make($params["password"]);
        $params["upt_no"]   = "+87810" . $params["mobilenumber"];

        if ($this->request->auth->client_id <= 0) {
            $params["client_id"] = $this->request->client_id;
        }

        try {
            Admin::insert($params);
            return $this->controller->sendSuccess("Web user created successfully.");
        } catch (\Throwable $th) {
            return $this->controller->sendError($th->getMessage());
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/admin/update",
     *     summary="Admin Update",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *              type="object",
     *              required={"firstname", "lastname","role", "password"},             
     *              @OA\Property(property="id", type="integer", example=""),
     *              @OA\Property(property="firstname", type="string", example=""),
     *              @OA\Property(property="lastname", type="string", example=""),
     *              @OA\Property(property="role", type="string", example=""),
     *              @OA\Property(property="password", type="string", example=""),
     *              @OA\Property(property="menus", type="string", example=""),
     *              @OA\Property(property="machines", type="string", example=""),
     *              @OA\Property(property="reports", type="string", example="")
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
        $params = $this->request->only('firstname', 'lastname', 'role', 'menus', 'machines', 'reports', 'show_data_after');

        if(!empty($this->request->password)){
            $params["password"] = Hash::make($this->request->password);
        }

        if ($this->request->auth->client_id <= 0) {
            $params["client_id"] = $this->request->client_id;
        }

        try {
            Admin::where("id", $this->request->id)->update($params);
            return $this->controller->sendSuccess("Web user updated successfully.");
        } catch (\Throwable $th) {
            return $this->controller->sendError($th->getMessage());
        }
    }

    /**
     * @OA\Delete(
     *     path="/v1/admin/delete/{id}",
     *     summary="Delete a web user",
     *     description="Deletes user by ID",
     *     tags={"V1"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the user to delete",
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
     *         description="user deleted successfully",
     *     ),
     *     @OA\Response(    
     *         response=404,
     *         description="user not found",
     *     ),
     *     security={
     *         {"api_key": {}}
     *     }
     * )
     */

     public function remove($id){
        Admin::where("id",$id)->delete();
        return $this->controller->sendSuccess("Web user deleted successfully.");
     }
}
