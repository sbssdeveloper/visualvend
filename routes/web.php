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
        $router->post('list',       'MachineController@list');
        $router->post('products',   'MachineController@products');
    });

    $router->group(['prefix' => 'payments'], function () use ($router) {
        $router->post('list', 'PaymentsController@list');
        $router->post('activities', 'PaymentsController@activities');
    });

    $router->group(['prefix' => 'stock'], function () use ($router) {
        $router->post('list',       'StockController@list');
        $router->post('reset',      'StockController@reset');
        $router->post('refill',     'StockController@refill');
    });

    $router->group(['prefix' => 'product', 'middleware' => 'jwt'], function () use ($router) {
        $router->post('list',       'ProductController@list');
        $router->post('create',     'ProductController@create');
        $router->post('update',     'ProductController@update');
        $router->post('delete',     'ProductController@delete');
    });
    $router->group(['prefix' => 'category', 'middleware' => 'jwt'], function () use ($router) {
        $router->get('list',          'CategoryController@dropdownList');
        $router->post('list',         'CategoryController@list');
    });
    /****************************CLIENT******************************/
    $router->group(['prefix' => 'client', 'middleware' => 'jwt'], function () use ($router) {
        $router->get('list',             'ClientController@dropdownList');
    });
});
