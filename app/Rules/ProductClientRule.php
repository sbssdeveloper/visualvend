<?php

namespace App\Rules;

use App\Models\Product;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Http\Request;

class ProductClientRule implements Rule
{

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function passes($attribute, $value)
    {
        $client_id = $this->request->auth->client_id;
        $client_id = $client_id > 0 ? $client_id : $this->request->client_id;
        if (Product::where("client_id", $client_id)->where("product_id", $value)->exists()) {
            return false;
        }
        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The :attribute already exists.';
    }
}
