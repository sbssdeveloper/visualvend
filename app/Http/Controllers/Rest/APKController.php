<?php

namespace App\Http\Controllers\Rest;

use Illuminate\Http\Request;
use App\Http\Repositories\ApkRepository;

class ApkController extends BaseController
{
    public $request = null;
    public $apk = null;

    public function __construct(Request $request, ApkRepository $apk)
    {
        $this->request = $request;
        $this->apk = $apk;
    }


    public function list()
    {
        return $this->sendResponse("Success", $this->apk->list($this->request));
    }

    public function update()
    {
        $this->validate($this->request, [
            'name'    => 'required',
            'path'      => 'required',
        ]);
        return $this->apk->update($this->request);
    }
}
