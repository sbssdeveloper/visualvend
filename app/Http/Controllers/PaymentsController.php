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
use stdClass;

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

        $machinePay =
            $model      = RemoteVend::selectRaw("COUNT(*) as total_vends, SUM(IF(status IN('3','4','5','6','7','8','00'), 1, 0)) as failed_vends, SUM(IF(status='1', 1, 0)) as successfull_vends")->whereRaw("updated_at >= '$start_date'")->whereRaw("updated_at <= '$end_date'");
        if ($machine_id > 0) {
            $model  = $model->where("machine_id", $machine_id);
        }
        if (in_array($type, ["approved", "declined", "timeout"])) {
            if ($type === "approved") {
                $model  = $model->where("status", "0");
            } else if ($type === "declined") {
                $model  = $model->whereNotIn("status", ['0', '1', '2', '11']);
            } else if ($type === "timeout") {
                $model  = $model->where("status", '7');
            }
        }
        $model = $model->first();
        if (!$model) {
            $model = new stdClass();
            $model->total_vends         = 0;
            $model->failed_vends        = 0;
            $model->successfull_vends   = 0;
        }
        $model->pay_failed = 0;
        return parent::sendResponse($model, "Success");
    }

    public function activities(Request $request)
    {
    }
}
