<?php

namespace App\Http\Controllers\Rest;

use App\Models\APK;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class APKController extends BaseController
{
    public $request = null;
    public function __construct(Request $request)
    {
        parent::__construct($request);
        $this->request = $request;
    }

    public function list(Request $request, APK $apk){
        return $this->sendResponse("Success", $apk->list($request));
    }
}
