<?php

namespace App\Http\Controllers\RemoteVend;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\BaseController;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends BaseController
{
    public function __construct()
    {
        $this->middleware('pub', ['except' => ['login', 'signup']]);
    }

    /**
     * @OA\Post(
     *     path="/remote/vend/signup",
     *     summary="Signup Customer",
     *     tags={"RemoteVend"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="firstname", type="string"),
     *             @OA\Property(property="lastname", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="prefix", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="confirm_password", type="string")
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
        $this->validate($request, ["firstname" => 'required|min:4,max:20', "lastname" => 'required|min:4,max:20', "email" => 'required|email|unique:customers,email', "prefix" => 'required', "phone" => 'required|email|unique:customers,phone', "password" => 'required|confirmed|min:6']);
        $data = $request->only("firstname", "lastname", "email", "prefix", "phone", "password");
        Customer::insert($data);
        return parent::sendSuccess("Customer created successfully.");
    }

    public function login() {}
}
