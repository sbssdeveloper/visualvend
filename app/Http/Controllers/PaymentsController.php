<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\AuthSignupRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\Machine;
use App\Models\RemoteVend;
use App\Models\Transaction;
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

        // From Remote vend log
        $machinePay =
            $model      = RemoteVend::selectRaw("COUNT(*) as total_vends, SUM(IF(remote_vend_log.status IN('3','4','5','6','7','8','00'), 1, 0)) as failed_vends, SUM(IF(remote_vend_log.status='1', 1, 0)) as successfull_vends, SUM(IF(transactions.payment_status='FAILED', 1, 0)) as pay_failed")->leftJoin('transactions', 'transactions.transaction_id=remote_vend_log.transaction_id')->whereRaw("remote_vend_log.updated_at >= '$start_date'")->whereRaw("remote_vend_log.updated_at <= '$end_date'");

        if ($machine_id > 0) {
            $model  = $model->where("remote_vend_log.machine_id", $machine_id);
        }
        if (in_array($type, ["approved", "declined", "timeout"])) {
            if ($type === "approved") {
                $model  = $model->where("remote_vend_log.status", "0");
            } else if ($type === "declined") {
                $model  = $model->whereNotIn("remote_vend_log.status", ['0', '1', '2', '11']);
            } else if ($type === "timeout") {
                $model  = $model->where("remote_vend_log.status", '7');
            }
        }
        $model = $model->first();
        if (!$model) {
            $model = new stdClass();
            $model->total_vends         = 0;
            $model->failed_vends        = 0;
            $model->successfull_vends   = 0;
            $model->pay_failed          = 0;
        }

        $mobile_payments = Transaction::selectRaw("SUM(transactions.amount) as total_amount, SUM(IF(response LIKE '%VISA%',amount,0)) as visa_amount, SUM(IF(response LIKE '%MASTERCARD%',amount,0)) as mastercard_amount, SUM(IF(response LIKE '%AMEX%',amount,0)) as amex_amount, SUM(IF(pay_method='apple_pay',amount,0)) as apple_amount,  SUM(IF(pay_method='google_pay',amount,0)) as google_amount,  SUM(IF(pay_method='paypal',amount,0)) as paypal_amount,  SUM(IF(pay_method='after_pay',amount,0)) as after_pay_amount")->leftJoin('transactions', '`transactions`.`transaction_id`=`remote_vend_log`.`transaction_id`')->whereRaw("transactions.created_at >= '$start_date'")->whereRaw("created_at <= '$end_date'")->whereRaw("remote_vend_log.id > 0")->where("transactions.status", "SUCCESS")->first();

        $model->visa_amount         = $mobile_payments ? $mobile_payments->visa_amount : 0;
        $model->mastercard_amount   = $mobile_payments ? $mobile_payments->mastercard_amount : 0;
        $model->amex_amount         = $mobile_payments ? $mobile_payments->amex_amount : 0;
        $model->apple_amount        = $mobile_payments ? $mobile_payments->apple_amount : 0;
        $model->google_amount       = $mobile_payments ? $mobile_payments->google_amount : 0;
        $model->paypal_amount       = $mobile_payments ? $mobile_payments->paypal_amount : 0;
        $model->after_pay_amount    = $mobile_payments ? $mobile_payments->after_pay_amount : 0;
        return parent::sendResponse($model, "Success");
    }

    public function activities(Request $request)
    {
    }
}
