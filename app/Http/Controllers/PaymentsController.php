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

        $badgeCount = "COUNT(*) as vend_total_pay_total_count, SUM(IF(remote_vend_log.status='2',1,0)) as vend_success_pay_success_count,  SUM(IF(remote_vend_log.status NOT IN ('0','1','2','11') AND transactions.payment_status='SUCCESS',1,0)) as vend_fail_pay_success_count, SUM(IF(transactions.payment_status='FAILED',1,0)) as vend_fail_pay_fail_count, SUM(IF(transactions.payment_status='SUCCESS',1,0)) as pay_success_count";

        $badgeSelector = $badgeCount . ",FORMAT(SUM(transactions.amount),2) as vend_total_pay_total_amount, FORMAT(SUM(IF(remote_vend_log.status='2',transactions.amount,0)),2) as vend_success_pay_success_amount,  FORMAT(SUM(IF(remote_vend_log.status NOT IN ('0','1','2','11') AND transactions.payment_status='SUCCESS',transactions.amount,0)),2) as vend_fail_pay_success_amount, FORMAT(SUM(IF(transactions.payment_status='FAILED',transactions.amount,0)),2) as vend_fail_pay_fail_amount, FORMAT(SUM(IF(transactions.payment_status='SUCCESS',transactions.amount,0)),2) as pay_success_amount";

        $modalVendCount = "SUM(IF(pay_method='pay_to_card',1,0)) as total_card_vends, SUM(IF(pay_method IN ('google_pay','paypal','apple_pay','after_pay'),1,0)) as total_mobile_vends,";

        $modalVendCount .= "SUM(IF(pay_method='pay_to_card' AND transactions.payment_status='SUCCESS',transactions.amount,0)) as total_card_payment_success, SUM(IF(pay_method IN ('google_pay','paypal','apple_pay','after_pay') AND transactions.payment_status='SUCCESS',transactions.amount,0)) as total_mobile_payment_success,";

        $modalVendCount .= "SUM(IF(pay_method='pay_to_card' AND remote_vend_log.status='2',1,0)) as total_card_vend_success, SUM(IF(pay_method IN ('google_pay','paypal','apple_pay','after_pay') AND remote_vend_log.status='2',1,0)) as total_mobile_vend_success,";

        $modalVendCount .= "SUM(IF(pay_method='pay_to_card' AND remote_vend_log.status IN('3','4','5','6','7','8','00'))) as total_card_vend_fail, SUM(IF(pay_method IN ('google_pay','paypal','apple_pay','after_pay') AND remote_vend_log.status IN('3','4','5','6','7','8','00'))) as total_mobile_vend_fail,";

        $modalVendCount .= "SUM(IF(pay_method='pay_to_card' AND transactions.payment_status='FAILED')) as total_card_payment_fail, SUM(IF(pay_method IN ('google_pay','paypal','apple_pay','after_pay') AND transactions.payment_status='FAILED')) as total_mobile_payment_fail,";

        $modelSelector = $modalVendCount . "FORMAT(SUM(IF(pay_method='pay_to_card' AND response LIKE '%MASTERCARD%' AND transactions.payment_status='SUCCESS',transactions.amount,0)),2) as master_card, FORMAT(SUM(IF(pay_method='pay_to_card' AND response LIKE '%VISA%' AND transactions.payment_status='SUCCESS',transactions.amount,0)),2) as visa, FORMAT(SUM(IF(pay_method='pay_to_card' AND response LIKE '%DEBIT%' AND transactions.payment_status='SUCCESS',transactions.amount,0)),2) as debit_card, FORMAT(SUM(IF(pay_method='pay_to_card' AND response LIKE '%AMEX%' AND transactions.payment_status='SUCCESS',transactions.amount,0)),2) as amex, FORMAT(SUM(IF(pay_method='apple_pay' AND transactions.payment_status='SUCCESS',amount,0)),2) as apple, FORMAT(SUM(IF(pay_method='google_pay' AND transactions.payment_status='SUCCESS',amount,0)),2) as google_pay, FORMAT(SUM(IF(pay_method='after_pay' AND transactions.payment_status='SUCCESS',amount,0)),2) as after_pay, FORMAT(SUM(IF(pay_method='apple_pay' AND transactions.payment_status='SUCCESS',amount,0)),2) as paypal";

        $badges        = Transaction::selectRaw($badgeSelector);

        $badges->leftJoin("remote_vend_log", "remote_vend_log.vend_id", "=", "transactions.vend_uuid");

        $model = Transaction::selectRaw($modelSelector);

        $model->leftJoin("remote_vend_log", "remote_vend_log.vend_id", "=", "transactions.vend_uuid");

        if (!empty($start_date) && !empty($end_date)) {
            $model->whereRaw("transactions.created_at >= '$start_date'")->whereRaw("transactions.created_at <= '$end_date'");
            $badges->whereRaw("transactions.created_at >= '$start_date'")->whereRaw("transactions.created_at <= '$end_date'");
        }

        if ($machine_id > 0) {
            $model->where("remote_vend_log.machine_id", $machine_id);
            $badges->where("remote_vend_log.machine_id", $machine_id);
        }

        $model  = $model->first();

        $model->badges = $badges->first();

        if ($device) {
            $cardPayments  =   [
                [
                    "name" => "Visa",
                    "color" => "#BBE409",
                    "population" => (float) $model->visa,
                ],
                [
                    "name" => "Mastercard",
                    "color" => "#D5A804",
                    "population" => (float) $model->mastercard,
                ],
                [
                    "name" => "Amex",
                    "color" => "#08CFD5",
                    "population" => (float) $model->amex,
                ],
                [
                    "name" => "Debit Card",
                    "color" => "#D75DCC",
                    "population" => (float) $model->debit_card,
                ]
            ];
            $model->card_payments = $cardPayments;

            $mobPayments  =   [
                [
                    "name" => "Apple Pay",
                    "color" => "#D75DCC",
                    "population" => (float) $model->apple,
                ],
                [
                    "name" => "Gpay",
                    "color" => "#BBE409",
                    "population" => (float) $model->google_pay,
                ],
                [
                    "name" => "Paypal",
                    "color" => "#08CFD5",
                    "population" => (float) $model->paypal,
                ],
                [
                    "name" => "After Pay",
                    "color" => "#D5A804",
                    "population" => (float) $model->after_pay,
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
