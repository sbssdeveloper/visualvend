<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ClientController extends BaseController
{
    /**
     * @OA\Get(
     *     path="/api/client/list",
     *     summary="Clients List",
     *     tags={"Quizee"},
     *     @OA\Parameter(
     *         name="X-Auth-Token",
     *         in="header",
     *         required=true,
     *         description="Authorization token",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success with api information."
     *     )
     * )
     */

    public function dropdownList(Request $request, Client $client)
    {
        if ($request->auth->client_id < 0) {
            $response = Cache::remember("client-listing:$this->admin_logged_in", env('LISTING_TIME_LIMIT', 300), function () {
                return $client->dropdownList();
            });
            return $this->sendResponse($response, "Success");
        }
        return self::sendError("Authentication failed");
    }
}
