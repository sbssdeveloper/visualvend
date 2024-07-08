<?php

namespace App\Http\Controllers\Rest;

use App\Http\Controllers\Controller;
use App\Http\Repositories\PlanogramRepository;
use Illuminate\Http\Request;

class PlanogramController extends Controller
{
    public $repo;

    public function __construct(PlanogramRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list(Request $request)
    {
        return $this->repo->list($request);
    }

    public function info(Request $request)
    {
        $rules = [
            'type'                      => 'required|in:planogram,happy_hours',
            'uuid'                      => 'required',
        ];

        $this->validate($request, $rules);
        return $this->repo->info($request);
    }

    public function upload(Request $request)
    {
        $rules = [
            'machine_id'                => 'required|exists:machine,id',
            'file'                      => 'required|file|max:10240|mimes:xlsx',
        ];

        $this->validate($request, $rules);
        
        return $this->repo->upload();
    }
}
