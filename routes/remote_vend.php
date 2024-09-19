<?php

/** @var \Laravel\Lumen\Routing\Router $router */

$router->group(['prefix' => 'remote/vend'], function () use ($router) {
    $router->get('/', function () use ($router) {
        return $router->app->version();
    });
    $router->post('signup', 'CustomerController@signup');
});
