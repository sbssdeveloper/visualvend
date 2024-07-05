<?php

namespace App\Http\Repositories;

use App\Http\Controllers\Rest\BaseController;
use App\Models\Planogram;
use Illuminate\Http\Request;

class PlanogramRepository
{
    public $request = null;
    public $controller = null;
    public function __construct(Request $request, BaseController $controller)
    {
        $this->request      = $request;
        $this->controller   = $controller;
        $this->role         = $request->auth->role;
        $this->client_id    = $request->auth->client_id;
        $this->admin_id     = $request->auth->admin_id;
    }
    public function list()
    {
        $machine_id = $this->request->machine_id;
        $search     = $this->request->search;
        $type       = $this->request->type;
        
        $planogram = Planogram::select("planogram.*", "machine_name", "0 as duration", "1 as is_default", "'live' as planogram_type");

        //"TIMESTAMPDIFF(HOUR,planogram.start_date,planogram.end_date) as duration"
        $m1 = $this->db->select(["planogram.*", "machine_name", "0 as duration", "1 as is_default", "'live' as planogram_type"])->join("machine", "machine.id=planogram.machine_id", "left");
        if ($machine_id > 0) {
            $m1 = $m1->where("machine_id", $machine_id);
        }
        if ($this->clientID > 0) {
            $m1 = $m1->where_in("machine_id", $this->machines);
        }
        if (!empty($search)) {
            $m1 =  $m1->group_start()->like("name", $search, "after")->or_like("machine.machine_name", $search, "after")->group_end();
        }

        $m1 = $m1->where("machine.is_deleted", 0)->order_by("planogram.id", "DESC")->limit($length, $offset)->get("planogram")->result_array();

        $m2 = $this->db->select(["happy_hours.*", "machine_name", "TIMESTAMPDIFF(HOUR,happy_hours.start_date,happy_hours.end_date) as duration", "0 as is_default", "'happy_hours' as planogram_type"])->join("machine", "machine.id=happy_hours.machine_id", "left");
        if ($machine_id > 0) {
            $m2 = $m2->where("machine_id", $machine_id);
        }
        if ($this->clientID > 0) {
            $m2 = $m2->where_in("machine_id", $this->machines);
        }
        if (!empty($search)) {
            $m2 =  $m2->group_start()->like("name", $search, "after")->or_like("machine.machine_name", $search, "after")->group_end();
        }
        $m2 = $m2->where("machine.is_deleted", 0)->order_by("happy_hours.id", "DESC")->limit($length, $offset)->get("happy_hours")->result_array();
        $model = array_merge($m1, $m2);
        $formattedData = $pairs = $allIds = $pairedIds = [];
        if (in_array($type, ["machine", "status"])) {
            $keyName        = $type === "machine" ? "machine_id" : "status";
            $valName        = $type === "machine" ? "machine_name" : "status";
            foreach ($model as $key => $value) {
                $allIds[] = $value["id"];
                $pairs[$value[$keyName]] = $value[$valName];
                if (isset($formattedData[$value[$keyName]])) {
                    $pairedIds[$value[$keyName]] = [...$pairedIds[$value[$keyName]], $value["id"]];
                    $formattedData[$value[$keyName]] = [...$formattedData[$value[$keyName]], $value];
                } else {
                    $pairedIds[$value[$keyName]] = [$value["id"]];
                    $formattedData[$value[$keyName]] = [$value];
                }
            }
        } else {
            $formattedData = $model;
            foreach ($formattedData as $value) {
                $allIds[] = $value["id"];
            }
        }
        $paginate["showingRecords"]         = count($model);
        $paginate["data"]                   = $formattedData;
        $paginate["pairs"]                  = $pairs;
        $paginate["all"]                    = $allIds;
        $paginate["paired"]                 = $pairedIds;
        return $this->output
            ->set_content_type('application/json')
            ->set_status_header(200)
            ->set_output(json_encode($paginate));
    }
}
