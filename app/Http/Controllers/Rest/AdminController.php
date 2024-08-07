<?php

namespace App\Http\Controllers\Rest;

use App\Http\Controllers\Controller;
use App\Http\Repositories\AdminRepository;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public $repo = null;

    public function __construct(AdminRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list()
    {
        return $this->repo->list();
    }

    public function create(Request $request)
    {
        $rules = [
            "firstname" => "required|min:3",
            "lastname" => "required|min:3",
            "role" => "required",
            "password" => "required|confirmed|min:6",
            "emailid" => "required|email|unique:admin,emailid",
            "mobilenumber" => "required|unique:admin,mobilenumber",
            "username" => "required|unique:admin,username"
        ];

        $this->validate($request, $rules);

        return $this->repo->create();
    }

    public function update(Request $request)
    {
        $rules = [
            "id" => "required|exists:admin,id",
            "firstname" => "required|min:3",
            "lastname" => "required|min:3",
            "role" => "required"
        ];

        $this->validate($request, $rules);

        return $this->repo->update();
    }

    public function remove($id)
    {
        return $this->repo->remove($id);
    }
}
