<?php

namespace App\Http\Controllers\Rest;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends BaseController
{

    /**
     * @OA\Get(
     *     path="/v2/client/list",
     *     summary="Clients List",
     *     tags={"V1"},
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
            return self::sendResponse($client->dropdownList());
        }
        return self::sendError("Authentication failed");
    }
}
