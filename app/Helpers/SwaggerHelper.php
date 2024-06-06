<?php

namespace App\Http\Helpers;

class SwaggerHelper
{
    public static function authLogin(){
        /**
        * @OA\Get(
        *     path="/app/login",
        *     summary="Login user",
        *     tags={"Auth"},
        *     @OA\Response(
        *         response=200,
        *         description="A list of users",
        *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/User"))
        *     )
        * )
        */
    }
}