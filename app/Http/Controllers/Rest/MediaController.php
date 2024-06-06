<?php

namespace App\Http\Controllers\Rest;

use App\Http\Controllers\BaseController;
use App\Models\HomeConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class MediaController extends BaseController
{
    public function homeInfo()
    {
        $model = Cache::remember("homepage-info", env('GLOBAL_CACHE_TIME', 600), function () {
            return HomeConfig::first();
        });
                
        return self::sendResponse($model, "Success");
    }
}
