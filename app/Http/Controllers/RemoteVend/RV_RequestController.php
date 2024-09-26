<?php

namespace App\Http\Controllers\RemoteVend;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\BaseController;
use Illuminate\Http\Request;

class RV_RequestController extends BaseController
{
    /**
     * @OA\Post(
     *     path="/remote/vend/request",
     *     summary="Vend Request",
     *     tags={"Remote Vend"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="machine_id", type="integer", example="firstname"),
     *             @OA\Property(property="aisle_number", type="string", example="lastname"),
     *             @OA\Property(property="email", type="string", example="email"),
     *             @OA\Property(property="prefix", type="string", example="prefix"),
     *             @OA\Property(property="phone", type="string", example="phone"),
     *             @OA\Property(property="password", type="string", example="password"),
     *             @OA\Property(property="password_confirmation", type="string", example="confirm_password")
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

    public function generate(Request $request)
    {
        $machineId = $this->input->post('machine_id');
        $aisleNumber = $this->input->post('aisle_number');
        $timeOfCreation = date("Y-m-d H:i:s");
        $customerName = $this->input->post('customer_name');
        $vendId = $this->input->post('vend_id');
        $pickupCode = $this->input->post('pickup_code');
        $expiryDate = $this->input->post('expiry_date');

        $data = array();
        $data["machine_id"] = $machineId;
        $data["aisle_number"] = $aisleNumber;
        $data["timeOfCreation"] = $timeOfCreation;
        $data["customer_name"] = $customerName;
        $data["vend_id"] = $vendId;
    }
}
