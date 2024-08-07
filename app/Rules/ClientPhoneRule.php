<?php

namespace App\Rules;

use App\Models\Client;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Http\Request;

class ClientPhoneRule implements Rule
{

    public function __construct()
    {
        $this->message = null;
    }

    public function passes($attribute, $value)
    {
        $phone = str_replace("+", "", $value);
        $model = Client::whereRaw("REPLACE(client_phone,'+','')=$phone")->first();
        if ($model) {
            $this->message = 'Client phone should always be unique".';
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
        return $this->message;
    }
}
