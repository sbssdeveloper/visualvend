<?php

namespace App\Http\Controllers\Rest;

use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;

class LinkedMachineController extends BaseController
{
    public $linked_machines;
    public $admin_logged_in;

    public function __construct(Request $request)
    {
        $this->admin_logged_in = $request->auth->admin ?? 0;
        $this->linked_machines = Cache::remember("linked_machines:$this->admin_logged_in", env('MACHINES_CACHE_TIME', 600), function () use ($request) {
            $userMachines = Admin::linkedMachines($request->auth);
            if (method_exists($userMachines, 'toArray')) {
                $userMachines = $userMachines->toArray();
            }
            return $userMachines;
        });
    }
}
