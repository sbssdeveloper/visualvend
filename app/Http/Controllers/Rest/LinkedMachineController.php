<?php

namespace App\Http\Controllers\Rest;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class LinkedMachineController extends BaseController
{
    public $linked_machines;
    public $admin_logged_in;
    public function __construct(Request $request)
    {
        $this->admin_logged_in = $request->auth->admin ?? 0;
        $this->linked_machines = Cache::remember("linked_machines:$this->admin_logged_in", env('MACHINES_CACHE_TIME', 600), function () use ($request) {
            $userMachines = Admin::linkedMachines($request->auth);
            print_r($userMachines);
            if (method_exists($userMachines, 'toArray')) {
                $userMachines = $userMachines->toArray();
            }
            return $userMachines;
        });
    }
}
