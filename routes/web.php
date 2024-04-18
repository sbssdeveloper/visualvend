<?php

/** @var \Laravel\Lumen\Routing\Router $router */

$router->options('{all:.*}', function () {
    return response()->json(array(''), 200);
});

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['prefix' => 'api'], function () use ($router) {
    $router->group(['prefix' => 'auth'], function () use ($router) {
        //login,logout
        $router->post('login', 'AuthController@login');
    });
});
