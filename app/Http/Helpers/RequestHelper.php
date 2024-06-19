<?php

namespace App\Http\Helpers;

use Encrypt;

class RequestHelper
{
    public function productRequest($request)
    {
        $data                           = $request->only("others", "verification_method", "product_age_verify_minimum", "product_age_verify_required", "product_size_unit", "product_size_amount", "promo_text", "more_info_text", "product_discount_code", "product_status", "vend_quantity", "product_caption", "product_classification_no", "product_sku", "product_grading_no", "product_batch_expiry_date", "product_batch_no", "product_description", "discount_price", "product_price", "product_id", "product_name");
        $client_id                      = $request->auth->client_id;
        if ($request->auth->client_id <= 0) {
            $client_id                  = $request->client_id;
        }
        $array                          = array_filter($data);
        $array["client_id"]             = $client_id;
        $array['uuid']                  = (string) Encrypt::uuid();
        return $array;
    }
}
