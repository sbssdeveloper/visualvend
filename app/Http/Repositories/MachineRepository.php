<?php

namespace App\Http\Repositories;

use App\Http\Controllers\Rest\BaseController;

class MachineRepository
{
    public $controller;
    public function __construct(BaseController $controller)
    {
        $this->controller = $controller;
    }

    public function refillInfo($request)
    {
    }
}
