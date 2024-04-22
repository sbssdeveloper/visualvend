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
use App\Models\Machine;
use DB;
use Illuminate\Support\Facades\Hash;

class DashboardController extends BaseController
{
    public function __construct()
    {
        $this->middleware('jwt'); //['except' => ['login']]
    }

    public function info(Request $request)
    {
        $auth = $request->auth;
        if ($auth->client_id > 0) {
            $list = Machine::personal($auth->machines);
        }
        print_r($list);
    }
}
