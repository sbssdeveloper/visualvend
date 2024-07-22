<?php

namespace App\Http\Controllers\Rest;

use DB;
use App\Http\Controllers\Controller;
use App\Http\Repositories\LatestReportsRepository;
use Illuminate\Http\Request;

class LatestReportsController extends LinkedMachineController
{
    public $request     = null;
    public $repo        = null;

    public function __construct(Request $request, LatestReportsRepository $repo)
    {
        parent::__construct($request);
        DB::statement("SET SQL_MODE=''");
        $this->request      = $request;
        $this->repo         = $repo;
    }

    public function sales()
    {
        $this->validate($this->request, [
            'start_date'    => 'required|date',
            'end_date'      => 'required|date',
            'type'          => 'required|in:product,machine,employee,pickup_or_return',
        ]);
        return $this->repo->sales($this->linked_machines);
    }

    public function salesData()
    {
        $rules = [
            'start_date'    => 'required|date',
            'end_date'      => 'required|date',
            'type'          => 'required|in:product,machine,pickup_or_return',
            'value'         => 'required'
        ];
        // die("===>".$this->request->auth->client_id);
        if (!$this->request->auth->client_id || $this->request->auth->client_id <= 0) {
            $rules["client_id"] = "required";
        }
        $this->validate($this->request, $rules);
        return $this->repo->salesData($this->linked_machines);
    }

    public function refill()
    {
        $this->validate($this->request, [
            'start_date'    => 'required|date',
            'end_date'      => 'required|date',
            'type'          => 'required|in:product,machine,category,aisle,quantity',
        ]);
        return $this->repo->refill($this->linked_machines);
    }

    public function refillData()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'type'      => 'required|in:product,machine,category,aisle,quantity',
            'value'     => 'required',
        ]);
        return $this->repo->refillData($this->linked_machines);
    }

    public function stock()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->stock($this->linked_machines);
    }

    public function stockData()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->stockData($this->linked_machines);
    }

    public function vend_activity()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->vend_activity($this->linked_machines);
    }

    public function expiryProducts()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->expiryProducts($this->linked_machines);
    }

    public function vend_error()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->vend_error($this->linked_machines);
    }

    public function feedback()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->feedback($this->linked_machines);
    }

    public function getEmail()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->getEmail();
    }

    public function staff()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->staff($this->linked_machines);
    }

    public function service()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->service($this->linked_machines);
    }

    public function receipts()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->receipts($this->linked_machines);
    }

    public function gift()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->gift($this->linked_machines);
    }

    public function payment()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->payment($this->linked_machines);
    }

    public function vend_queue()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->vend_queue($this->linked_machines);
    }
}
