<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use App\Models\User;
// use App\Models\Machine;
use DB;
use Firebase\JWT\Key;
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;

class JWTAuthenticate
{
    public function handle($request, Closure $next, $guard = null)
    {
        $token = $request->header('X-Auth-Token');

        if (!$token) {
            return response()->json([
                'error' => 'Token not provided.'
            ], 400);
        }
        try {

            $credentials =  JWT::decode($token, new Key(env('JWT_TOKEN'), env('JWT_ALGORITHM')));
        } catch (ExpiredException $e) {
            return response()->json([
                'error' => 'Provided token is expired.'
            ], 401);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'An error while decoding token.'
            ], 401);
        }
        $user = User::where('id', $credentials->sub->admin_id)->first();

        if (!$user) {
            return response()->json([
                'ResponseCode' => '0',
                'ResponseText' => 'Unauthorized request,Invalid token'
            ], 401);
        }
        $request->auth = $user;

        // if ($user->client_id > 0) {
        //     $list   = explode(",", $user->machines);
        //     $select = [];
        //     $machines = Machine::select(["id", "machine_name"])->whereIn("id", $list)->orderBy('machine_name', "ASC")->get();
        // } else {
        //     $machines = Machine::select(["id", "machine_name"])->orderBy('machine_name', "ASC")->get();
        // }
        // $request->auth->machines = $machines;
        return $next($request);
    }
}
