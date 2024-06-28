<?php

namespace App\Http\Controllers\Rest;

use App\Models\MachineUser;
use Illuminate\Http\Request;

class UserController extends LinkedMachineController
{
    /**
     * @OA\Post(
     *     path="/v1/user/list",
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
    public function list(Request $request, MachineUser $user, BaseController $controller)
    {
        if ($request->auth->client_id <= 0) {
            $this->validate($request, ["client_id" => "required|exists:client,id"]);
        }

        return $user->newList($request, $controller);
    }
}
