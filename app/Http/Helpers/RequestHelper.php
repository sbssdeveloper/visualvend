<?php

namespace App\Http\Helpers;

use App\Http\Controllers\Rest\BaseController;
use Encrypt;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

class RequestHelper
{

    /**
     * @OA\Post(
     *     path="/v1/product/create",
     *     summary="Products Create",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *          @OA\JsonContent(
     *             required={"product_name","product_id","product_price","discount_price","product_description","product_image","product_more_info_image"},
     *             @OA\Property(property="product_name", type="string", default="product_name"),
     *             @OA\Property(property="product_id", type="string", default="product_id"),
     *             @OA\Property(property="product_price", type="float", default="10.00"),
     *             @OA\Property(property="discount_price", type="float", default="08.00"),
     *             @OA\Property(property="product_description", type="string", default="product_description"),
     *             @OA\Property(property="product_image", type="string", default="product_image"),
     *             @OA\Property(property="product_more_info_image", type="string", default="product_more_info_image"),
     *             @OA\Property(property="client_id", type="integer", default="196"),
     *             @OA\Property(property="product_sku", type="string", default="product_sku"),
     *             @OA\Property(property="product_batch_expiray_date", type="string", default="2024-01-01"),
     *             @OA\Property(property="product_batch_no", type="string", default="product_batch_no"),
     *             @OA\Property(property="product_caption", type="string", default="product_caption"),
     *             @OA\Property(property="product_status", type="string", default="1"),
     *             @OA\Property(property="product_discount_code", type="string", default="product_discount_code"),
     *             @OA\Property(property="promo_text", type="string", default="promo_text"),
     *             @OA\Property(property="product_size_amount", type="integer", default="10"),
     *             @OA\Property(property="product_size_unit", type="string", default="ml"),
     *             @OA\Property(property="product_classification_no", type="string", default="product_classification_no"),
     *             @OA\Property(property="product_grading_no", type="string", default="product_grading_no"),
     *             @OA\Property(property="vend_quantity", type="integer", default="10"),
     *             @OA\Property(property="more_info_text", type="string", default="more_info_text"),
     *             @OA\Property(property="product_category", type="string", default="product_category"),
     *             @OA\Property(property="product_age_verify_required", type="integer", enum= {0, 1}, default="1"),
     *             @OA\Property(property="product_age_verify_minimum", type="integer", default="15"),
     *             @OA\Property(property="more_product_images",
     *                  type="array", 
     *                  @OA\Items(
     *                     type="string",
     *                     default="default-image.jpg"
     *                 )
     *              ),
     *             @OA\Property(property="others", type="object"),
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

    public function productRequest($request)
    {
        $other_images = $categories = $surcharge_fees = $product_surcharges = [];

        $data                           = $request->only("verification_method", "product_age_verify_minimum", "product_age_verify_required", "product_size_unit", "product_size_amount", "promo_text", "more_info_text", "product_discount_code", "product_status", "vend_quantity", "product_caption", "product_classification_no", "product_sku", "product_grading_no", "product_batch_expiray_date", "product_batch_no", "product_description", "discount_price", "product_price", "product_id", "product_name", "product_image", "product_more_info_image", "product_promo_image");

        $client_id                      = $request->auth->client_id;

        if ($request->auth->client_id <= 0) {
            $client_id                  = $request->client_id;
        }
        $array                          = array_filter($data, function ($var) {
            return !empty($var) && $var != "null";
        });
        $array["client_id"]                         = $client_id;
        $array['uuid']                              = (string) Encrypt::uuid();
        $array['product_image_thumbnail']           = $array['product_image'];
        $array['product_more_info_image_thumbnail'] = $array['product_more_info_image'];

        if (!empty($request->others)) {
            $array["others"]            = json_encode($request->others);
        }

        if ($request->has("more_product_images") && count($request->more_product_images) > 0) {
            foreach ($request->more_product_images as $value) {
                $other_images[] = ["uuid" => $array['uuid'], "image" => $value];
            }
        }

        if ($request->has("product_category") && !empty($request->product_category) && $request->product_category != "null") {
            $request->product_category = explode(",", $request->product_category);
            foreach ($request->product_category as $value) {
                $categories[] = [
                    "product_id" => $array["product_id"],
                    "category_id" => $value,
                    "client_id" => $client_id,
                    "uuid" => $array['uuid']
                ];
            }
        }
        if ($request->has("product_surcharges") && count($request->product_surcharges) > 0) {
                $product_surcharges[] = [
                    'product_id' => $array["product_id"],
                    'client_id' => $client_id,
                    'surcharge_value' => $request->product_surcharges['surcharge_value'],
                    'surcharge_type' => $request->product_surcharges['surcharge_type']
                ];
        }
        if ($request->has("surcharge_fees") && count($request->surcharge_fees) > 0) {
            foreach ($request->surcharge_fees as $key => $fees) {
                if ($fees['type'] == 'amount') {
                    $surcharge_fees[] = [
                        "name" => $fees['name'],
                        "amount" => $fees['amount'],
                        "min_price" => $fees['min_price'],
                        "percentage" => 0,
                        "type" => $fees['type'],
                        "max_price" => $fees['max_price'],
                        "description" => $fees['description'],
                        "from_date" => $fees['from_date'],
                        "to_date" => $fees['to_date'],
                        "client_id" => $client_id,
                        "product_id" => $request->product_id
                    ];
                } else if ($fees['type'] == 'amount-percentage') {
                    $surcharge_fees[] = [
                        "name" => $fees['name'],
                        "amount" => $fees['amount'],
                        "percentage" => $fees['percentage'],
                        "min_price" => $fees['min_price'],
                        "type" => $fees['type'],
                        "max_price" => $fees['max_price'],
                        "description" => $fees['description'],  // Fixed typo here
                        "client_id" => $client_id,
                        "product_id" => $request->product_id,
                        "from_date" => $fees['from_date'],
                        "to_date" => $fees['to_date'],
                    ];
                } else if ($fees['type'] == 'percentage') {
                    $surcharge_fees[] = [
                        "name" => $fees['name'],
                        "amount" => 0,
                        "percentage" => $fees['percentage'],
                        "type" => $fees['type'],
                        "min_price" => $fees['min_price'],
                        "max_price" => $fees['max_price'],
                        "description" => $fees['description'],  // Fixed typo here
                        "client_id" => $client_id,
                        "product_id" => $request->product_id,
                        "from_date" => $fees['from_date'],
                        "to_date" => $fees['to_date'],
                    ];
                }
            }
        }

        return ["product" => $array, "product_images" => $other_images, "product_assign_category" => $categories, "surcharge_fees" => $surcharge_fees, "product_surcharges" => $product_surcharges];
    }

    /**
     * @OA\Post(
     *     path="/v1/product/update",
     *     summary="Products Update",
     *     tags={"V1"},
     *     @OA\RequestBody(
     *         required=true,
     *          @OA\JsonContent(
     *             required={"product_name","uuid","product_price","discount_price","product_description","product_image","product_more_info_image"},
     *             @OA\Property(property="uuid", type="string", default="uuid"),
     *             @OA\Property(property="product_name", type="string", default="product_name"),
     *             @OA\Property(property="product_price", type="float", default="10.00"),
     *             @OA\Property(property="discount_price", type="float", default="08.00"),
     *             @OA\Property(property="product_description", type="string", default="product_description"),
     *             @OA\Property(property="product_image", type="string", default="product_image"),
     *             @OA\Property(property="product_more_info_image", type="string", default="product_more_info_image"),
     *             @OA\Property(property="client_id", type="integer", default="196"),
     *             @OA\Property(property="product_sku", type="string", default="product_sku"),
     *             @OA\Property(property="product_batch_expiray_date", type="string", default="2024-01-01"),
     *             @OA\Property(property="product_batch_no", type="string", default="product_batch_no"),
     *             @OA\Property(property="product_caption", type="string", default="product_caption"),
     *             @OA\Property(property="product_status", type="string", default="1"),
     *             @OA\Property(property="product_discount_code", type="string", default="product_discount_code"),
     *             @OA\Property(property="promo_text", type="string", default="promo_text"),
     *             @OA\Property(property="product_size_amount", type="integer", default="10"),
     *             @OA\Property(property="product_size_unit", type="string", default="ml"),
     *             @OA\Property(property="product_classification_no", type="string", default="product_classification_no"),
     *             @OA\Property(property="product_grading_no", type="string", default="product_grading_no"),
     *             @OA\Property(property="vend_quantity", type="integer", default="10"),
     *             @OA\Property(property="more_info_text", type="string", default="more_info_text"),
     *             @OA\Property(property="product_category", type="string", default="product_category"),
     *             @OA\Property(property="product_age_verify_required", type="integer", enum= {0, 1}, default="1"),
     *             @OA\Property(property="product_age_verify_minimum", type="integer", default="15"),
     *             @OA\Property(property="more_product_images",
     *                  type="array", 
     *                  @OA\Items(
     *                     type="string",
     *                     default="default-image.jpg"
     *                 )
     *              ),
     *             @OA\Property(property="others", type="object"),
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

    public function productUpdateRequest($request)
    {

        $categories = $other_images = $surcharge_fees = $product_surcharges = [];
        $data                           = $request->only("verification_method", "product_age_verify_minimum", "product_age_verify_required", "product_size_unit", "product_size_amount", "promo_text", "more_info_text", "product_discount_code", "product_status", "vend_quantity", "product_caption", "product_classification_no", "product_sku", "product_grading_no", "product_batch_expiray_date", "product_batch_no", "product_description", "discount_price", "product_price", "product_name", "uuid", "product_image", "product_more_info_image", "product_promo_image");

        $array                          = array_filter($data, function ($var) {
            return $var != "" && $var != "null";
        });

        if (!empty($request->others)) {
            $array["others"]            = json_encode($request->others);
        }

        $array['product_image_thumbnail']           = $array['product_image'];

        $array['product_more_info_image_thumbnail'] = $array['product_more_info_image'];

        if ($request->has("more_product_images") && count($request->more_product_images) > 0) {
            foreach ($request->more_product_images as $value) {
                $other_images[] = ["uuid" => $array['uuid'], "image" => $value];
            }
        }

        if ($request->has("product_surcharges") && count($request->product_surcharges) > 0) {
            $product_surcharges[] = [
                'product_id' => $request->product_id,
                'client_id' => $request->client_id,
                'surcharge_value' => $request->product_surcharges['surcharge_value'],
                'surcharge_type' => $request->product_surcharges['surcharge_type']
            ];
        }

        if ($request->has("surcharge_fees") && count($request->surcharge_fees) > 0) {
            foreach ($request->surcharge_fees as $key => $fees) {
                if ($fees['type'] == 'amount') {
                    $surcharge_fees[] = [
                        "name" => $fees['name'],
                        "amount" => $fees['amount'],
                        "min_price" => $fees['min_price'],
                        "percentage" => 0,
                        "type" => $fees['type'],
                        "max_price" => $fees['max_price'],
                        "description" => $fees['description'],
                        "from_date" => $fees['from_date'],
                        "to_date" => $fees['to_date'],
                        "client_id" => $request->client_id,
                        "product_id" => $request->product_id
                    ];
                } else if ($fees['type'] == 'amount-percentage') {
                    $surcharge_fees[] = [
                        "name" => $fees['name'],
                        "amount" => $fees['amount'],
                        "percentage" => $fees['percentage'],
                        "min_price" => $fees['min_price'],
                        "type" => $fees['type'],
                        "max_price" => $fees['max_price'],
                        "description" => $fees['description'],  // Fixed typo here
                        "client_id" => $request->client_id,
                        "product_id" => $request->product_id,
                        "from_date" => $fees['from_date'],
                        "to_date" => $fees['to_date'],
                    ];
                } else if ($fees['type'] == 'percentage') {
                    $surcharge_fees[] = [
                        "name" => $fees['name'],
                        "amount" => 0,
                        "percentage" => $fees['percentage'],
                        "type" => $fees['type'],
                        "min_price" => $fees['min_price'],
                        "max_price" => $fees['max_price'],
                        "description" => $fees['description'],  // Fixed typo here
                        "client_id" => $request->client_id,
                        "product_id" => $request->product_id,
                        "from_date" => $fees['from_date'],
                        "to_date" => $fees['to_date'],
                    ];
                }
            }
        }

        return ["product" => $array, "product_assign_category" => $categories, "product_images" => $other_images, "surcharge_fees" => $surcharge_fees, "product_surcharges" => $product_surcharges];
    }

    public function file_extension($request)
    {
        return !empty($request->getClientOriginalExtension()) ? $request->getClientOriginalExtension() : File::guessExtension($request);;
    }

    private function isBase64($string)
    {
        $decoded = base64_decode($string, true);
        if ($decoded === false) {
            return false;
        }
        return base64_encode($decoded) === $string;
    }
}
