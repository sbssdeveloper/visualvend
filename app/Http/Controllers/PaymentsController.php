<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\AuthSignupRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\Machine;
use App\Models\RemoteVend;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Repositories\BaseRepository;
use Validator;
use App\Models\User;
use DB;
use Illuminate\Support\Facades\Hash;

class PaymentsController extends BaseController
{
    public function __construct()
    {
        $this->middleware('jwt'); //['except' => ['login']]
    }

    public function list(Request $request)
    {
        $this->validate($request, ['start_date' => 'required|date_format:Y-m-d H:i:s', 'end_date' => 'required|date_format:Y-m-d H:i:s', 'type' => 'required|in:all,approved,declined,timeout,payment_types,machine_types']);

        $client_id  = $request->auth->client_id;
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;
        $type       = $request->type;
        $model      = RemoteVend::where('updated_at>=', $start_date)->where('updated_at<=', $end_date);
        if ($machine_id > 0) {
            $model  = $model->where("machine_id", $machine_id);
        }
        if (in_array($type, ["all", "approved", "declined", "timeout"])) {
            $model  = $model->where("machine_id", $type);
        }
        $model = $model->get();
        return parent::sendResponse($model, "Success");
    }

    public function activities(Request $request)
    {
    }
}
