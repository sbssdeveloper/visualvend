<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\AuthSignupRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\Machine;
use App\Models\MachineProductMap;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Repositories\BaseRepository;
use Validator;
use App\Models\User;
use DB;
use Illuminate\Support\Facades\Hash;
use PhpParser\Node\Expr\Cast\Object_;

class MachineController extends BaseController
{
    public function __construct()
    {
        $this->middleware('jwt'); //['except' => ['login']]
    }    

    public function list(Request $request)
    {
        $this->validate($request, ['type' => 'required|in:list,pagination', 'length' => 'required_if:type,pagination', 'page' => 'required_if:type,pagination']);
        $client_id = $request->auth->client_id;
        $model = Machine::where('is_deleted', 0);
        if ($client_id > 0) {
            $list   = explode(",", $request->auth->machines);
            $model = $model->whereIn("id", $list);
        }
        $model = $model->orderBy('machine_name', "ASC");
        if ($request->type === "list") {
            $model = $model->select(["id", "machine_name as name"])->get();
            return parent::sendResponse($model, "Success");
        } else {
            $model = $model->paginate($request->length);
            return parent::sendResponseWithPagination($model, "Success");
        }
    }

    public function products(Request $request, MachineProductMap $model)
    {
        $this->validate($request, ['machine_id' => 'required||exists:machine,id']);
        return $this->sendResponse($model->machineProducts($request), "Success");
    }
}
