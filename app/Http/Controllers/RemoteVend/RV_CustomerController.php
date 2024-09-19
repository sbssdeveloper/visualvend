<?php

namespace App\Http\Controllers\RemoteVend;

use App\Http\Controllers\Rest\BaseController;
use App\Models\Customer;
use Illuminate\Http\Request;

class RV_CustomerController extends BaseController
{
    public function __construct()
    {
        $this->middleware('pub', ['except' => ['login', 'signup']]);
    }
    /**
     * @OA\Post(
     *     path="/remote/vend/signup",
     *     summary="Signup Customer",
     *     tags={"Remote Vend"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="firstname", type="string", example="firstname"),
     *             @OA\Property(property="lastname", type="string", example="lastname"),
     *             @OA\Property(property="email", type="string", example="email"),
     *             @OA\Property(property="prefix", type="string", example="prefix"),
     *             @OA\Property(property="phone", type="string", example="phone"),
     *             @OA\Property(property="password", type="string", example="password"),
     *             @OA\Property(property="password_confirmation", type="string", example="confirm_password")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User Signup successfully."
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Other errors with JSON content."
     *     )
     * )
     */

    public function signup(Request $request)
    {
        $this->validate($request, ["firstname" => 'required|min:4,max:20', "lastname" => 'required|min:4,max:20', "email" => 'required|email|unique:customers,email', "prefix" => 'required', "phone" => 'required|unique:customers,phone', "password" => 'required|confirmed|min:6']);
        $data = $request->only("firstname", "lastname", "email", "prefix", "phone", "password");
        Customer::create($data);
        return parent::sendSuccess("Customer created successfully.");
    }

    /**
     * @OA\Post(
     *     path="/remote/vend/login",
     *     summary="Login Customer",
     *     tags={"Remote Vend"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="username", type="string", example="username"),
     *             @OA\Property(property="password", type="string", example="password")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User logged in successfully."
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Other errors with JSON content."
     *     )
     * )
     */

    public function login(Request $request)
    {
        $this->validate($request, ["username" => 'required', "password" => 'required']);
        $model = Customer::where('phone', $request->username)->orWhere('email', $request->username)->first();

        if ($model && Customer::verifyPassword($request->password, $model->password)) {
            $jwt = parent::customerJwt($model);
            return parent::sendSuccess("Customer logged in successfully.", $jwt);
        } else {
            return parent::sendError("Invalid username or password.");
        }
    }
}
