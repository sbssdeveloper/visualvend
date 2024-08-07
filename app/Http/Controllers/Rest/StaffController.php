<?php

namespace App\Http\Controllers\Rest;

use App\Http\Controllers\Controller;
use App\Http\Repositories\StaffRepository;


class StaffController extends Controller
{
    public $repo = null;

    public function __construct(StaffRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list()
    {
        return $this->repo->list();
    }
}
