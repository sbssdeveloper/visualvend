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
        $model      = RemoteVend::selectRaw("COUNT(*) as total_vends, SUM(IF(remote_vend_log.status IN('3','4','5','6','7','8','00'), 1, 0)) as failed_vends, SUM(IF(remote_vend_log.status='1', 1, 0)) as successfull_vends, SUM(IF(transactions.payment_status='FAILED', 1, 0)) as pay_failed, SUM(IF(transactions.id>0,1,0)) as total_mobile_vends, SUM(IF(transactions.id>0 AND remote_vend_log.status IN('3','4','5','6','7','8','00'),1,0)) as failed_mobile_vends, SUM(IF(transactions.id>0 AND payment_status='FAILED',1,0)) as failed_mobile_payments")->leftJoin('transactions', 'transactions.transaction_id', '=', 'remote_vend_log.transaction_id')->whereRaw("remote_vend_log.updated_at >= '$start_date'")->whereRaw("remote_vend_log.updated_at <= '$end_date'");

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

        $mobile_payments = Transaction::selectRaw("COUNT(transactions.id) as successfull_mobile_vends,SUM(transactions.amount) as total_amount, SUM(IF(response LIKE '%DEBIT%',amount,0)) as debit_card_amount,SUM(IF(response LIKE '%CREDIT%',amount,0)) as credit_card_amount, SUM(IF(response LIKE '%VISA%',amount,0)) as visa_amount, SUM(IF(response LIKE '%MASTERCARD%',amount,0)) as mastercard_amount, SUM(IF(response LIKE '%AMEX%',amount,0)) as amex_amount, SUM(IF(pay_method='apple_pay',amount,0)) as apple_amount,  SUM(IF(pay_method='google_pay',amount,0)) as google_amount,  SUM(IF(pay_method='paypal',amount,0)) as paypal_amount,  SUM(IF(pay_method='after_pay',amount,0)) as after_pay_amount")->leftJoin('remote_vend_log', 'transactions.transaction_id', '=', 'remote_vend_log.transaction_id')->whereRaw("transactions.created_at >= '$start_date'")->whereRaw("transactions.created_at <= '$end_date'")->whereRaw("remote_vend_log.id > 0")->where("transactions.payment_status", "SUCCESS")->first();

        $model->visa_amount         = $mobile_payments ? ($mobile_payments->visa_amount ?? 0) : 0;
        $model->mastercard_amount   = $mobile_payments ? ($mobile_payments->mastercard_amount ?? 0) : 0;
        $model->amex_amount         = $mobile_payments ? ($mobile_payments->amex_amount ?? 0) : 0;
        $model->apple_amount        = $mobile_payments ? ($mobile_payments->apple_amount ?? 0) : 0;
        $model->google_amount       = $mobile_payments ? ($mobile_payments->google_amount ?? 0) : 0;
        $model->paypal_amount       = $mobile_payments ? ($mobile_payments->paypal_amount ?? 0) : 0;
        $model->after_pay_amount    = $mobile_payments ? ($mobile_payments->after_pay_amount ?? 0) : 0;
        $model->debit_card_amount   = $mobile_payments ? ($mobile_payments->debit_card_amount ?? 0) : 0;
        $model->credit_card_amount  = $mobile_payments ? ($mobile_payments->credit_card_amount ?? 0) : 0;

        $model->successfull_mobile_vends    = $mobile_payments ? ($mobile_payments->successfull_mobile_vends ?? 0) : 0;


        $model->all_card_payments   = $model->visa_amount + $model->mastercard_amount + $model->amex_amount;
        $model->all_mobile_payments = $model->apple_amount + $model->google_amount + $model->paypal_amount + $model->after_pay_amount;

        // percentage code
        $model->vend_success_rate   = $model->total_vends > 0 ? number_format(($model->successfull_vends / $model->total_vends) * 100, 2) : 0;
        $model->vend_success_rate   .= "%";

        $model->vend_failed_rate    = $model->total_vends > 0 ? number_format(($model->failed_vends / $model->total_vends) * 100, 2) : 0;
        $model->vend_failed_rate   .= "%";

        $model->pay_failed_rate     = $model->total_vends > 0 ? number_format(($model->pay_failed / $model->total_vends) * 100, 2) : 0;
        $model->pay_failed_rate    .= "%";

        $model->mbl_success_rate    = $model->total_mobile_vends > 0 ? number_format(($model->successfull_mobile_vends / $model->total_mobile_vends) * 100, 2) : 0;
        $model->mbl_success_rate   .= "%";

        $model->mbl_failed_rate     = $model->total_mobile_vends > 0 ? number_format(($model->failed_mobile_vends / $model->total_mobile_vends) * 100, 2) : 0;
        $model->mbl_failed_rate    .= "%";

        $model->mbl_failed_pay_rate  = $model->total_mobile_vends > 0 ? number_format(($model->failed_mobile_payments / $model->total_mobile_vends) * 100, 2) : 0;
        $model->mbl_failed_pay_rate .= "%";

        return parent::sendResponse($model, "Success");
    }

    public function activities(Request $request)
    {
        $machine_id = $request->machine_id;
        $type       = $request->type;

        $model      = Transaction::selectRaw("IF(pay_status='pay at machine','pay_at_machine',pay_status) as pay_status,remote_vend_log.aisle_number, transactions.amount, transactions.payment_status, transactions.response")->leftJoin('remote_vend_log', 'transactions.transaction_id', '=', 'remote_vend_log.transaction_id')->whereIn("pay_status", ["pay_to_card", "google_pay", "pay_at_machine", "paypal", "after_pay", "apple_pay", "pay at machine"])->whereNotNull("transactions.id");

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
        $model = $model->paginate($request->length ?? 10);
        return parent::sendResponseWithPagination($model, "Success");
    }
}
