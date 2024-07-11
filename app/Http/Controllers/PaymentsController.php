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

    /**
     * @OA\Post(
     *     path="/api/payments/list",
     *     summary="Payments List",
     *     tags={"Quizee"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="start_date", type="string"),
     *             @OA\Property(property="end_date", type="string"),
     *             @OA\Property(property="machine_id", type="integer"),
     *             @OA\Property(property="type", type="string"),
     *             @OA\Property(property="device", type="string")
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
     *         description="Success with api information."
     *     )
     * )
     */

    public function list(Request $request)
    {
        $client_id  = $request->auth->client_id;
        $start_date = $request->start_date;
        $end_date   = $request->end_date;
        $machine_id = $request->machine_id;
        $type       = $request->type;
        $device     = $request->device;

        $other = "SUM(IF(pay_method='pay_to_card',1,0)) as total_vends, SUM(IF(remote_vend_log.status IN('3','4','5','6','7','8','00') AND (transactions.payment_status IS NULL OR transactions.payment_status<>'FAILED') AND pay_method='pay_to_card', 1, 0)) as failed_vends, SUM(IF(remote_vend_log.status IN('0','1','11'), 1, 0) AND pay_method='pay_to_card') as in_progress, SUM(IF(remote_vend_log.status='2' AND transactions.payment_status='SUCCESS' AND pay_method='pay_to_card', 1, 0)) as successfull_vends, SUM(IF(transactions.payment_status='FAILED' AND pay_method='pay_to_card', 1, 0)) as pay_failed, SUM(IF(transactions.id>0 AND pay_method IN ('google_pay','paypal','apple_pay','after_pay'),1,0)) as total_mobile_vends, SUM(IF(transactions.id>0 AND remote_vend_log.status IN('3','4','5','6','7','8','00') AND pay_method IN ('google_pay','paypal','apple_pay','after_pay') AND transactions.payment_status='SUCCESS',1,0)) as failed_mobile_vends, SUM(IF(transactions.id>0 AND payment_status='FAILED' AND pay_method IN ('google_pay','paypal','apple_pay','after_pay'),1,0)) as failed_mobile_payments, SUM(IF(remote_vend_log.status='2' AND pay_method IN ('google_pay','paypal','apple_pay','after_pay'),1,0)) as successfull_mobile_vends";


        $model = Transaction::selectRaw("$other, SUM(IF(transactions.payment_status='SUCCESS', amount, 0)) as total_amount, SUM(IF(response LIKE '%DEBIT%' AND transactions.payment_status='SUCCESS' AND pay_method='pay_to_card',amount,0)) as debit_card_amount,SUM(IF(response LIKE '%CREDIT%' AND transactions.payment_status='SUCCESS' AND pay_method='pay_to_card',amount,0)) as credit_card_amount, SUM(IF(response LIKE '%VISA%' AND transactions.payment_status='SUCCESS' AND pay_method='pay_to_card',amount,0)) as visa_amount, SUM(IF(response LIKE '%MASTERCARD%' AND transactions.payment_status='SUCCESS' AND pay_method='pay_to_card',amount,0)) as mastercard_amount, SUM(IF(response LIKE '%AMEX%' AND transactions.payment_status='SUCCESS' AND pay_method='pay_to_card',amount,0)) as amex_amount, SUM(IF(pay_method='apple_pay' AND transactions.payment_status='SUCCESS',amount,0)) as apple_amount,  SUM(IF(pay_method='google_pay' AND transactions.payment_status='SUCCESS',amount,0)) as google_amount,  SUM(IF(pay_method='paypal' AND transactions.payment_status='SUCCESS',amount,0)) as paypal_amount,  SUM(IF(pay_method='after_pay' AND transactions.payment_status='SUCCESS',amount,0)) as after_pay_amount");
        $model->leftJoin('remote_vend_log', 'transactions.transaction_id', '=', 'remote_vend_log.transaction_id');

        $badges        = Transaction::selectRaw("COUNT(*) as total_vends, SUM(IF(remote_vend_log.status='2',1,0)) as successfull_vends, SUM(IF(remote_vend_log.status NOT IN ('0','1','2','11'),1,0)) as failed_vends, FORMAT(SUM(transactions.amount),2) as total_payments, FORMAT(SUM(IF(transactions.payment_status='SUCCESS',transactions.amount,0)),2) as successfull_payments, FORMAT(SUM(IF(transactions.payment_status='FAILED',transactions.amount,0)),2) as failed_payments");

        $badges->leftJoin("remote_vend_log", "remote_vend_log.vend_id", "=", "transactions.vend_uuid");

        if (!empty($start_date) && !empty($end_date)) {
            $model->whereRaw("transactions.created_at >= '$start_date'")->whereRaw("transactions.created_at <= '$end_date'")->whereRaw("remote_vend_log.id > 0");
            $badges->whereRaw("transactions.created_at >= '$start_date'")->whereRaw("transactions.created_at <= '$end_date'")->whereRaw("remote_vend_log.id > 0");
        }

        if ($machine_id > 0) {
            $model->where("remote_vend_log.machine_id", $machine_id);
            $badges->where("remote_vend_log.machine_id", $machine_id);
        }

        $model  = $model->first();

        $model->badges  = $badges->first();


        $model->all_card_payments   = number_format($model->visa_amount + $model->mastercard_amount + $model->amex_amount, 2);
        $model->all_mobile_payments = number_format($model->apple_amount + $model->google_amount + $model->paypal_amount + $model->after_pay_amount, 2);

        // percentage code
        $model->vend_success_rate   = $model->total_vends > 0 ? number_format(($model->successfull_vends / $model->total_vends) * 100, 2) : 0;
        $model->vend_success_rate   .= "%";

        $model->vend_failed_rate    = $model->total_vends > 0 ? number_format(($model->failed_vends / $model->total_vends) * 100, 2) : 0;
        $model->vend_failed_rate   .= "%";

        $model->vend_progress_rate  = $model->total_vends > 0 ? number_format(($model->in_progress / $model->total_vends) * 100, 2) : 0;
        $model->vend_progress_rate .= "%";

        $model->pay_failed_rate     = $model->total_vends > 0 ? number_format(($model->pay_failed / $model->total_vends) * 100, 2) : 0;
        $model->pay_failed_rate    .= "%";

        $model->mbl_success_rate    = $model->total_mobile_vends > 0 ? number_format(($model->successfull_mobile_vends / $model->total_mobile_vends) * 100, 2) : 0;
        $model->mbl_success_rate   .= "%";

        $model->mbl_failed_rate     = $model->total_mobile_vends > 0 ? number_format(($model->failed_mobile_vends / $model->total_mobile_vends) * 100, 2) : 0;
        $model->mbl_failed_rate    .= "%";

        $model->mbl_failed_pay_rate  = $model->total_mobile_vends > 0 ? number_format(($model->failed_mobile_payments / $model->total_mobile_vends) * 100, 2) : 0;
        $model->mbl_failed_pay_rate .= "%";

        if ($device) {
            $cardPayments  =   [
                [
                    "name" => "Visa",
                    "color" => "#BBE409",
                    "population" => (float) $model->visa_amount,
                ],
                [
                    "name" => "Mastercard",
                    "color" => "#D5A804",
                    "population" => (float) $model->mastercard_amount,
                ],
                [
                    "name" => "Amex",
                    "color" => "#08CFD5",
                    "population" => (float) $model->amex_amount,
                ],
                [
                    "name" => "Debit Card",
                    "color" => "#D75DCC",
                    "population" => (float) $model->debit_card_amount,
                ]
            ];
            $model->card_payments = $cardPayments;

            $mobPayments  =   [
                [
                    "name" => "Apple Pay",
                    "color" => "#D75DCC",
                    "population" => (float) $model->apple_amount,
                ],
                [
                    "name" => "Gpay",
                    "color" => "#BBE409",
                    "population" => (float) $model->google_amount,
                ],
                [
                    "name" => "Paypal",
                    "color" => "#08CFD5",
                    "population" => (float) $model->paypal_amount,
                ],
                [
                    "name" => "After Pay",
                    "color" => "#D5A804",
                    "population" => (float) $model->after_pay_amount,
                ]
            ];
            $model->mobile_payments = $mobPayments;
        }

        return parent::sendResponse("Success", $model);
    }

    /**
     * @OA\Post(
     *     path="/api/payments/activities",
     *     summary="Payments Activities",
     *     tags={"Quizee"},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="machine_id", type="integer"),
     *             @OA\Property(property="type", type="string"),
     *             @OA\Property(property="pay_type", type="string"),
     *             @OA\Property(property="pay_method", type="string"),
     *             @OA\Property(property="search", type="string"),
     *             @OA\Property(property="start_date", type="string"),
     *             @OA\Property(property="end_date", type="string")
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
     *         description="Success with api information."
     *     )
     * )
     */

    public function activities(Request $request)
    {
        $machine_id = $request->machine_id;
        $type       = $request->type;
        $pay_type   = $request->pay_type;
        $pay_method = $request->pay_method;
        $search     = $request->search;
        $start_date = $request->start_date;
        $end_date   = $request->end_date;

        $model      = Transaction::selectRaw("IF(pay_method='pay at machine','pay_at_machine',pay_method) as pay_method,remote_vend_log.aisle_number, transactions.amount, transactions.payment_status, machine_id,machine_name,product_id,product_name,transactions.created_at, transactions.response, CASE WHEN response LIKE '%VISA%' THEN 'VISA' WHEN response LIKE '%MASTERCARD%' THEN 'MASTERCARD' WHEN response LIKE '%AMEX%' THEN 'AMEX' ELSE NULL END as card_type, error_log, client_name")->leftJoin('remote_vend_log', 'remote_vend_log.vend_id', '=', 'transactions.vend_uuid');
        // ->whereIn("pay_status", ["pay_to_card", "google_pay", "pay_at_machine", "paypal", "after_pay", "apple_pay", "pay at machine"])

        if (!empty($search)) {
            $model  = $model->where(function ($query) use ($search) {
                return $query->where("product_id", 'LIKE', "$search%")->orWhere("product_name", 'LIKE', "$search%")->orWhere("machine_name", 'LIKE', "$search%")->orWhere("client_name", 'LIKE', "$search%");
            });
        }

        if (!empty($start_date) && !empty($end_date)) {
            $model  = $model->whereRaw("transactions.created_at >= '$start_date'")->whereRaw("transactions.created_at <= '$end_date'");
        }

        if (!empty($pay_method)) {
            if ($pay_type === "card") {
                $model  = $model->where("transactions.response", 'LIKE', "%$pay_method%");
            } else {
                $model  = $model->where("remote_vend_log.pay_method", $pay_method);
            }
        }

        if ($machine_id > 0) {
            $model  = $model->where("remote_vend_log.machine_id", $machine_id);
        }
        if (in_array($type, ["success", "error"])) {
            if ($type === "success") {
                $model  = $model->where("transactions.payment_status", "SUCCESS");
            } else if ($type === "error") {
                $model  = $model->where("transactions.payment_status", "FAILED");
            }
        }
        if (in_array($pay_type, ["card", "mobile"])) {
            if ($pay_type === "card") {
                $model  = $model->where("pay_method", "pay_to_card");
            } else if ($pay_type === "mobile") {
                $model  = $model->whereIn("pay_method", ['google_pay', 'after_pay', 'apple_pay', 'paypal']);
            }
        }
        $model = $model->paginate($request->length ?? 10);
        foreach ($model->items() as $key => $value) {
            if ($value->payment_status !== "SUCCESS" && parent::isJson($value->response)) {
                $json = json_decode($value->error_log, true);
                if (isset($json[0]["category"])) {
                    $model->items()[$key]->error = str_replace('_', ' ', $json[0]["category"]);
                } else if (isset($json[0]["code"])) {
                    $model->items()[$key]->error = str_replace('_', ' ', $json[0]["code"]);
                } else {
                    $model->items()[$key]->error = "Unknown";
                }
            }
            unset($model->items()[$key]->response);
        }
        return parent::sendResponseWithPagination($model, "Success");
    }
}
