<?php

namespace App\Http\Controllers\Rest;

use App\Http\Repositories\ClientRepository;
use App\Models\Client;
use App\Rules\ClientPhoneRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ClientController extends BaseController
{
    public $admin_logged_in;
    public $repo;
    public function __construct(ClientRepository $repo)
    {
        $this->admin_logged_in = $request->auth->admin ?? "client";
        $this->repo = $repo;
    }
    /**
     * @OA\Get(
     *     path="/v1/client/list",
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
            $response = Cache::remember("client-listing:$this->admin_logged_in", env('LISTING_TIME_LIMIT', 300), function () use ($client) {
                return $client->dropdownList();
            });
            return $this->sendResponse("Success", $response);
        }
        return self::sendError("Authentication failed");
    }

    public function listing(Request $request)
    {
        if ($request->auth->client_id > 0)
            abort(401);
        return $this->repo->listing($request);
    }

    public function info(Request $request)
    {
        if ($request->auth->client_id > 0)
            abort(401);
        $rules = [
            "client_id" => "required|exists:client,id"
        ];

        $this->validate($request, $rules);

        return $this->repo->info($request);
    }

    public function update(Request $request)
    {
        if ($request->auth->client_id > 0)
            abort(401);
        $rules = [
            "client_id" => "required|exists:client,id",
            "client_name" => "required|string|min:4|max:20",
            "business_registration_number" => "required|string|min:4|max:20",
            // "client_email"                  => "required|email",
            "client_address" => "required|string|min:10|max:50",
        ];

        $this->validate($request, $rules);

        return $this->repo->update($request);
    }

    public function create(Request $request, ClientPhoneRule $rule)
    {
        if ($request->auth->client_id > 0)
            abort(401);
        $rules = [
            "client_name" => "required|string|min:4|max:20|unique:client,client_name",
            "client_code" => "required|string|min:4|max:20|unique:client,client_code",
            "business_registration_number" => "required|string|min:4|max:50",
            "client_email" => "required|email|unique:client,client_email",
            "client_phone" => ["required", $rule],
            "client_address" => "required|string|min:4|max:100",
            "password" => "required_if:enable_portal,1|confirmed|min:4",
        ];

        $this->validate($request, $rules);
        return $this->repo->create($request);
    }
}
