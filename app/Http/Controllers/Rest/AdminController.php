<?php

namespace App\Http\Controllers\Rest;

use App\Http\Controllers\Controller;
use App\Http\Repositories\AdminRepository;

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
}
