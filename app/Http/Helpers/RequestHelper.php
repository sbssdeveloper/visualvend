<?php

namespace App\Http\Helpers;

use Encrypt;

class RequestHelper
{
    public function productRequest($request)
    {
        $other_images = $categories = [];
        $data                           = $request->only("others", "verification_method", "product_age_verify_minimum", "product_age_verify_required", "product_size_unit", "product_size_amount", "promo_text", "more_info_text", "product_discount_code", "product_status", "vend_quantity", "product_caption", "product_classification_no", "product_sku", "product_grading_no", "product_batch_expiray_date", "product_batch_no", "product_description", "discount_price", "product_price", "product_id", "product_name");
        $client_id                      = $request->auth->client_id;
        if ($request->auth->client_id <= 0) {
            $client_id                  = $request->client_id;
        }
        $array                          = array_filter($data);
        $array["client_id"]             = $client_id;
        $array['uuid']                  = (string) Encrypt::uuid();

        $path                           = storage_path("uploads");

        if (!file_exists($path)) {
            mkdir($path, $mode = 0777, true);
        }

        $product_image              = Encrypt::uuid() . '.' . $request->product_image->extension();
        $request->product_image->move($path . "/images", $product_image);

        $product_more_info          = Encrypt::uuid() . '.' . $request->product_more_info_image->extension();
        $request->product_more_info_image->move($path . "/images", $product_more_info);

        $array['product_image']             = "uploads/images/" . $product_image;
        $array['product_more_info_image']   = "uploads/images/" . $product_more_info;

        if ($request->has("product_promo_image") && !empty($request->product_promo_image) && $request->product_promo_image != "null") {
            $product_promo_image          = Encrypt::uuid() . '.' . $request->product_promo_image->extension();
            $request->product_promo_image->move($path . "/images", $product_promo_image);
            $array['product_promo_image']   = "uploads/images/" . $product_more_info;
        }

        if ($request->has("product_more_image_1") && !empty($request->product_more_image_1) && $request->product_more_image_1 != "null") {
            dd($request->product_more_image_1);
            $product_more_image_1          = Encrypt::uuid() . '.' . $request->product_more_image_1->extension();
            $request->product_more_image_1->move($path . "/images", $product_more_image_1);
            $other_images[] = ["uuid" => $array['uuid'], "image" => "uploads/images/" . $product_more_image_1];
        }

        if ($request->has("product_more_image_2") && !empty($request->product_more_image_2) && $request->product_more_image_2 != "null") {
            $product_more_image_2          = Encrypt::uuid() . '.' . $request->product_more_image_2->extension();
            $request->product_more_image_2->move($path . "/images", $product_more_image_2);
            $other_images[] = ["uuid" => $array['uuid'], "image" => "uploads/images/" . $product_more_image_2];
        }

        if ($request->has("product_more_image_3") && !empty($request->product_more_image_3) && $request->product_more_image_3 != "null") {
            $product_more_image_3          = Encrypt::uuid() . '.' . $request->product_more_image_3->extension();
            $request->product_more_image_3->move($path . "/images", $product_more_image_3);
            $other_images[] = ["uuid" => $array['uuid'], "image" => "uploads/images/" . $product_more_image_3];
        }

        if ($request->has("product_more_image_4") && !empty($request->product_more_image_4) && $request->product_more_image_4 != "null") {
            $product_more_image_4          = Encrypt::uuid() . '.' . $request->product_more_image_4->extension();
            $request->product_more_image_4->move($path . "/images", $product_more_image_4);
            $other_images[] = ["uuid" => $array['uuid'], "image" => "uploads/images/" . $product_more_image_4];
        }

        if ($request->has("product_category") && !empty($request->product_category) && $request->product_category != "null") {
            $request->product_category = explode(",", $request->product_category);
            foreach ($request->product_category as $value) {
                $categories[] = [
                    "product_id" => $array["product_id"], "category_id" => $value, "client_id" => $client_id
                ];
            }
        }

        return ["product" => $array, "product_images" => $other_images, "product_assign_category" => $categories];
    }
}
