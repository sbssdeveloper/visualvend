<?php

namespace App\Http\Controllers\Rest;

use App\Models\Admin;
use App\Models\Machine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class MachineController extends LinkedMachineController
{
    public function dropdownList(Request $request)
    {
        $response = Cache::remember("machine-listing:$this->admin_logged_in", env('LISTING_TIME_LIMIT', 300), function () use ($request) {
            $admin_id   = $request->auth->admin_id;
            $client_id  = $request->auth->client_id;
            $machines   = $this->linked_machines;

            $model      = Machine::select("id", "machine_name")->where("is_deleted", "0");

            if ($client_id > 0) {
                $model  = $model->where("machine_client_id", $client_id)->whereIn("id", $machines);
            }

            return ($model  = $model->get());
        });

        return parent::sendResponseWithPagination($response, "Success");
    }
}
