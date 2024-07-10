<?php

namespace App\Http\Controllers\Rest;

use App\Http\Repositories\MachineUserRepository;
use App\Models\MachineUser;
use Illuminate\Http\Request;

class UserController extends LinkedMachineController
{
    public $repo;

    public function __construct(MachineUserRepository $repo)
    {
        $this->repo = $repo;
    }

    public function availableList(Request $request)
    {
        if ($request->auth->client_id <= 0) {
            $this->validate($request, ["client_id" => "required|exists:client,id"]);
        }
        return $this->repo->availableList();
    }

    public function requestLogin(Request $request)
    {
        $rules = [
            "firstname"         => "required|string|min:4|max:20",
            "lastname"          => "required|string|min:4|max:20",
            "mobilenumber"      => "required|string|min:8|max:15",
            "emailid"           => "required|email",
            "username"          => "required|unique:user,username",
            "password"          => "required",
            "confirm_password"  => "required|confirmed:password_confirmation",
            "cabinet_style"     => "required",
            "machine_name"      => "required|string|min:4|max:20",
            "cabinet_rows"      => "required|integer|min_digits:1|max_digits:10",
            "cabinet_columns"   => "required|integer|min_digits:1|max_digits:16",
            "start_end_aisle"   => "required|in:01-99,1-99",
        ];

        if ($request->auth->client_id <= 0) {
            $rules["client_id"] = "required|exists:client,id";
        }

        $this->validate($request, $rules);

        return $this->repo->requestLogin();
    }
}
