<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Rules\ProductClientRule;
use Illuminate\Http\Request;

class ProductController extends BaseController
{

    public function list(Request $request)
    {
        $client_id  = $request->auth->client_id;
        $products   = Product::where("is_deleted", 0);

        if ($client_id != 1) {
            $products->where("client_id", $client_id);
        }
        if (!empty($request->search)) {
            $products->where(function ($query) use ($request) {
                $query->where("product_id", "LIKE", $request->search . "%")->orWhere("product_name", "LIKE", $request->search . "%");
            });
        }
        $products = $products->paginate($request->length ?? 10);
        return $this->sendResponse($products, 'Products retrieved successfully');
    }

    public function create(Request $request, ProductClientRule $rule)
    {
        $client_id                      = $request->auth->client_id;
        $rules = [
            'product_name'              => 'required|string',
            'product_id'                => ['required', $rule],
            'product_price'             => 'required|numeric',
            'discount_price'            => 'required|numeric',
            'product_description'       => 'required|string|max:255',
            'product_image'             => 'required|file|max:2048|mimes:jpg,png,jpeg',
            'product_more_info_image'   => 'required|file|max:2048|mimes:jpg,png,jpeg'
        ];
        if ($request->auth->client_id <= 0) {
            $rules["client_id"]   = 'required|exists:client,id';
        }
        $this->validate($request, $rules);
        $array                              = $request->all();
        $product_image                      = $request->file('product_image')->store('images', 'public/assets');
        $product_more_info                  = $request->file('product_more_info_image')->store('images', 'public/assets');
        $array['product_image']             = $product_image;
        $array['product_more_info_image']   = $product_more_info;

        try {
            Product::insert($array);
            return $this->sendResponse([], 'Product created successfully');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
            //throw $th;
        }
    }
}
