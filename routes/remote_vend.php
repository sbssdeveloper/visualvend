<?php

/** @var \Laravel\Lumen\Routing\Router $router */

$router->group(['prefix' => 'remote/vend'], function () use ($router) {
    $router->get('/', function () use ($router) {
        return "Welcome to Remote Vend API Portal";
    });
    $router->post('signup',                             'RV_CustomerController@signup');
    $router->post('login',                              'RV_CustomerController@login');
    $router->get('categories[/{machine_id}/{type}]',    'RV_CategoryController@list');
    $router->get('products[/{machine_id}]',             'RV_ProductController@list');
    $router->get('product/info[/{mid}/{pid}/{aid}]',    'RV_ProductController@info');
});
