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
        $this->middleware('pub', ['except' => ['login', 'signup', 'refresh', 'resetPassword', 'call_log', 'loginByToken', 'timezones']]);
    }

    public function login(Request $request)
    {
        $this->validate($request, ['username' => 'required', "password" => "required"]);
        $username = $request->username;
        $password = $request->password;

        $user  =  User::select(["password", 'menus', 'reports', 'role', 'id', 'client_id','is_activated'])->where('mobilenumber', $username)->orWhere('username', $username)->first();
        if ($user) {
            if ($user->is_activated === 1) {
                $verified = parent::verify_password($user->password, $password);
                if ($verified) {
                    $response = [
                        'success' => true,
                        'token' => parent::jwt($user),
                        'menus' => $user->menus,
                        'reports' => $user->reports,
                        'role' => $user->role,
                    ];
                    return response()->json($response, 200);
                }
                return parent::sendError("Password entered is incorrect");
            }
            return parent::sendError("Oops! Your account is Inactive. Please contact admin.");
        }
        return parent::sendError("Username entered is incorrect");
    }
}
