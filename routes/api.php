<?php

$router->group(['prefix' => 'app'], function () use ($router) {
    /**************************PUBLIC-URL*******************************/
    /****************************AUTH******************************/
    $router->post('login',                      'AuthController@login');

    /****************************MEDIA******************************/
    $router->get('homepage/info',               'MediaController@homeInfo');

    $router->group(['middleware' => 'jwt'], function () use ($router) {

        /****************************DASHBOARD******************************/
        $router->post('info',                   'DashboardController@info');

        /****************************MACHINE******************************/
        $router->get('machine/list',            'MachineController@dropdownList');

        /****************************ADVERTISEMENT******************************/
        $router->get('advertisement/list',      'AdvertisementController@list');

        /****************************Product******************************/
        $router->post('product/assigned',       'ProductController@assignedList');
        $router->post('product/unassigned',     'ProductController@unAssignedList');
    });
});
