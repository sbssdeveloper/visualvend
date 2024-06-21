<?php

namespace App\Rules;

use App\Models\MachineUser;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Http\Request;

class MachineUserRule implements Rule
{

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function passes($attribute, $value)
    {
        if (MachineUser::where("username", $this->request->auth->client_id)->where("product_id", $value)->exists()) {
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
        return 'The :attribute already exists for the client.';
    }
}
