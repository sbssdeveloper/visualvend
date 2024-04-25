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
        $router->post('login', 'AuthController@login');
    });

    $router->group(['prefix' => 'dashboard'], function () use ($router) {
        $router->post('info', 'DashboardController@info');
        $router->post('list', 'DashboardController@dashboard');
    });

    $router->group(['prefix' => 'machine'], function () use ($router) {
        $router->post('list', 'MachineController@list');
    });

    $router->group(['prefix' => 'payments'], function () use ($router) {
        $router->post('list', 'PaymentsController@list');
    });
});
