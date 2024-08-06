<?php

namespace App\Http\Controllers\Rest;

use Illuminate\Http\Request;
use App\Http\Repositories\StaffRepository;

class StaffController extends BaseController
{
    public $request = null;
    public $staff = null;

    public function __construct(Request $request, StaffRepository $staff)
    {
        $this->request = $request;
        $this->staff = $staff;
    }


    public function list()
    {
        return $this->staff->list($this->request);
    }
}
