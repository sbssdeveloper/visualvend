<?php

namespace App\Http\Controllers\Rest;

use App\Models\HomeConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class MediaController extends BaseController
{
    /**
     * @OA\Get(
     *     path="/v1/homepage/info",
     *     summary="Homepage Media Information",
     *     tags={"V1"},
     *     @OA\Response(
     *         response=200,
     *         description="Success with media information."
     *     )
     * )
     */

    public function homeInfo(HomeConfig $homeConfig)
    {
        $model = Cache::remember("homepage-info", env('GLOBAL_CACHE_TIME', 600), function () use ($homeConfig) {
            return $homeConfig->fetch();
        });

        return self::sendResponse($model, "Success");
    }
}
