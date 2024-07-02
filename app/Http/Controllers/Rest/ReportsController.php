<?php

namespace App\Http\Controllers\Rest;

use DB;
use App\Http\Controllers\Controller;
use App\Http\Repositories\ReportsRepository;
use Illuminate\Http\Request;

class ReportsController extends LinkedMachineController
{
    public $request     = null;
    public $repo        = null;

    public function __construct(Request $request, ReportsRepository $repo)
    {
        parent::__construct($request);
        DB::statement("SET SQL_MODE=''");
        $this->request      = $request;
        $this->repo         = $repo;
    }

    public function sales()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->sales($this->linked_machines);
    }

    public function refill()
    {
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->refill($this->linked_machines);
    }
    
    public function stock(){
        $this->validate($this->request, [
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);
        return $this->repo->stock($this->linked_machines);
    }
}
