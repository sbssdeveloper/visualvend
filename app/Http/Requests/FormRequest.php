<?php

namespace App\Http\Requests;

use Illuminate\Http\Request;
use Illuminate\Validation\UnauthorizedException;
use Laravel\Lumen\Routing\ProvidesConvenienceMethods;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class FormRequest
{
    use ProvidesConvenienceMethods;

    //public Request $req;
    public $validator = null;

    public function __construct(Request $request, array $messages = [], array $customAttributes = [])
    {
        $this->req = $request;

        $this->prepareForValidation();

        if (!$this->authorize()) {
            throw new UnauthorizedException();
        }

        $this->validator = Validator::make($this->req->all(), $this->rules(), $this->messages(), $customAttributes);

        $this->failedValidation($this->validator);
    }

    protected function failedValidation()
    {
        if ($this->validator->fails()) {
            $response = [
                'success' => false,
                'message' => $this->validator->errors()->first(),
            ];


            throw (new ValidationException($this->validator, response()->json($response, 422)));
        }
    }

    public function all()
    {
        return $this->req->all();
    }

    public function get(string $key, $default = null)
    {
        return $this->req->get($key, $default);
    }

    protected function prepareForValidation()
    {
    }

    protected function authorize()
    {
        return true;
    }

    protected function rules()
    {
        return [];
    }

    protected function messages()
    {
        return [];
    }
}
