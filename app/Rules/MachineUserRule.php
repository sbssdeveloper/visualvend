<?php

namespace App\Rules;

use App\Models\MachineUser;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Http\Request;

class MachineUserRule implements Rule
{

    public function __construct()
    {
        $this->message = null;
    }

    public function passes($attribute, $value)
    {
        $model = MachineUser::where("username", $value)->first();
        if ($model) {
            if (!empty($model->machines)) {
                $this->message = 'Machine username should always be unique".';
                return false;
            }
            return true;
        }
        $this->message = 'Machine username not found".';
        return false;
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
