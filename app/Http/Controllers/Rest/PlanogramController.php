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
            'type'                      => 'required|in:live,happy_hours',
            'start_date'                => 'required_if:type,happy_hours',
            'end_date'                  => 'required_if:type,happy_hours',
            'machine_id'                => 'required_if:multi_plano,true'
        ];

        $this->validate($request, $rules);

        $multi_plano   = $request->input("multi_plano");
        if ($multi_plano == TRUE) {
            return $this->repo->multi_upload();
        }

        return $this->repo->upload();
    }

    public function update(Request $request)
    {
        ["type" => $type]                 = $request->only("type");
        $table = $type == 'live' ? 'planogram' : 'happy_hours';
        $rules = [
            'type'                      => 'required|in:live,happy_hours',
            'name'                      => 'required|string|min:4|max:20',
            'file'                      => 'required|file|max:10240|mimes:xlsx',
            'uuid'                      => "required|exists:$table,uuid",
            'start_date'                => 'required_if|type,happy_hours',
            'end_date'                  => 'required_if|type,happy_hours'
        ];

        $this->validate($request, $rules);

        return $this->repo->update();
    }
}
