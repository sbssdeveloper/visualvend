<?php

namespace App\Http\Helpers;

use Encrypt;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

class RequestHelper
{
    public function productRequest($request)
    {
        $product_image = $product_more_info = $product_promo_image = $product_more_image_1 = $product_more_image_2 = $product_more_image_3 = $product_more_image_4 = null;

        $other_images = $categories = [];

        $data                           = $request->only("others", "verification_method", "product_age_verify_minimum", "product_age_verify_required", "product_size_unit", "product_size_amount", "promo_text", "more_info_text", "product_discount_code", "product_status", "vend_quantity", "product_caption", "product_classification_no", "product_sku", "product_grading_no", "product_batch_expiray_date", "product_batch_no", "product_description", "discount_price", "product_price", "product_id", "product_name", "product_image", "product_more_info", "product_promo_image");

        $client_id                      = $request->auth->client_id;

        if ($request->auth->client_id <= 0) {
            $client_id                  = $request->client_id;
        }
        $array                          = array_filter($data, function ($var) {
            return !empty($var) && $var != "null";
        });
        $array["client_id"]             = $client_id;
        $array['uuid']                  = (string) Encrypt::uuid();

        if ($request->has("product_more_image_1") && !empty($request->product_more_image_1) && $request->product_more_image_1 != "null") {
            $other_images[] = ["uuid" => $array['uuid'], "image" => $request->product_more_image_1];
        }

        if ($request->has("product_more_image_2") && !empty($request->product_more_image_2) && $request->product_more_image_2 != "null") {
            $other_images[] = ["uuid" => $array['uuid'], "image" => $request->product_more_image_2];
        }

        if ($request->has("product_more_image_3") && !empty($request->product_more_image_3) && $request->product_more_image_3 != "null") {
            $other_images[] = ["uuid" => $array['uuid'], "image" => $request->product_more_image_3];
        }

        if ($request->has("product_more_image_4") && !empty($request->product_more_image_4) && $request->product_more_image_4 != "null") {
            $other_images[] = ["uuid" => $array['uuid'], "image" => $request->product_more_image_4];
        }

        if ($request->has("product_category") && !empty($request->product_category) && $request->product_category != "null") {
            $request->product_category = explode(",", $request->product_category);
            foreach ($request->product_category as $value) {
                $categories[] = [
                    "product_id" => $array["product_id"], "category_id" => $value, "client_id" => $client_id, "uuid" => $array['uuid']
                ];
            }
        }

        return ["product" => $array, "product_images" => $other_images, "product_assign_category" => $categories];
    }

    public function productUpdateRequest($request)
    {

        $categories                     = [];
        $data                           = $request->only("others", "verification_method", "product_age_verify_minimum", "product_age_verify_required", "product_size_unit", "product_size_amount", "promo_text", "more_info_text", "product_discount_code", "product_status", "vend_quantity", "product_caption", "product_classification_no", "product_sku", "product_grading_no", "product_batch_expiray_date", "product_batch_no", "product_description", "discount_price", "product_price", "product_id", "product_name");

        $client_id                      = $request->auth->client_id;

        if ($request->auth->client_id <= 0) {
            $client_id                  = $request->client_id;
        }
        $array                          = array_filter($data, function ($var) {
            return $var != "" && $var != "null";
        });

        return ["product" => $array, "product_assign_category" => $categories];
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
