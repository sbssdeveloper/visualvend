<?php

namespace App\Http\Controllers\Rest;

use App\Http\Controllers\Controller;
use App\Http\Repositories\PlanogramRepository;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Calculation\Logical\Boolean;

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

    public function info($uuid = null, $type = null, Request $request)
    {
        if ($uuid && $type) {
            $request->merge([
                'uuid' => $uuid,
                'type' => $type,
            ]);
        }

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
            'file'                      => 'required|file|max:10240|mimes:xlsx',
            'type'                      => 'required|in:live,happy_hours',
            'start_date'                => 'required_if:type,happy_hours',
            'end_date'                  => 'required_if:type,happy_hours'
        ];

        $multi_plano   = $request->multi_plano;
        if ((bool) $multi_plano == TRUE) {
            $rules['machine_id']    = 'required';
            $rules['name']          = 'required|string|min:4|max:50';
        } else {
            $rules['machine_id']    = 'required|exists:machine,id';
        }

        $this->validate($request, $rules);

        if ((bool) $multi_plano == TRUE) {
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
            'name'                      => 'required|string|min:4|max:50',
            'file'                      => 'required|file|max:10240|mimes:xlsx',
            'uuid'                      => "required|exists:$table,uuid",
            'start_date'                => 'required_if:type,happy_hours',
            'end_date'                  => 'required_if:type,happy_hours'
        ];

        $this->validate($request, $rules);

        return $this->repo->update();
    }

    public function reset(Request $request)
    {
        $rules = [
            'machine_id'                => 'required|exists:machine,id'
        ];

        $this->validate($request, $rules);

        return $this->repo->reset();
    }

    public function view(Request $request)
    {
        ['type' => $type] = $request->only("type");
        $rules = [
            'type'  => 'required|in:planogram,happy_hours',
            'uuid'  => "required|exists:$type,uuid",
        ];

        $this->validate($request, $rules);

        return $this->repo->view();
    }

    public function delete(Request $request)
    {
        ['type' => $type] = $request->only("type");
        $rules = [
            'type'  => 'required|in:planogram,happy_hours',
            'uuid'  => "required|exists:$type,uuid",
        ];

        $this->validate($request, $rules);

        return $this->repo->delete();
    }
}
