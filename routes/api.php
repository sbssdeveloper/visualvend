<?php

$router->group(['prefix' => 'app'], function () use ($router) {
    /**************************PUBLIC-URL*******************************/
    $router->post('login',              'AuthController@login');
    $router->get('homepage/info',       'MediaController@homeInfo');

    $router->group(['middleware' => 'jwt'], function () use ($router) {
        $router->post('info',           'DashboardController@info');
        $router->get('machine/list',    'MachineController@dropdownList');
    });
});
