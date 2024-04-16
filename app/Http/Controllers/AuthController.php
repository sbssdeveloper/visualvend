<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\AuthSignupRequest;
use App\Http\Requests\ResetPasswordRequest;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Repositories\BaseRepository;
use Validator;
use App\Models\User;
use DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends BaseController
{
    public function __construct()
    {
        $this->middleware('api', ['except' => ['login', 'signup', 'refresh', 'resetPassword', 'call_log', 'loginByToken', 'timezones']]);
    }

    public function login(Request $request)
    {
        $this->validate($request, ['username' => 'required', "password" => "required"]);
        $username = $request->username;
        $password = $request->password;

        $user  =  User::where('mobilenumber', $username)->orWhere('username', $username)->first();
        if($user){
            $verified = parent::verify_password($user->password, $password);
            dd($verified);
        }
        return parent::sendError("Username entered is incorrect");
    }
}
