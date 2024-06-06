<?php

$router->group(['prefix' => 'v1'], function () use ($router) {
    /**************************PUBLIC-URL*******************************/
    /****************************AUTH******************************/
    $router->post('login',                      'AuthController@login');
    
    /****************************MEDIA******************************/
    $router->get('homepage/info',               'MediaController@homeInfo');
    
    /**************************PRIVATE-URL*******************************/
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
        $router->post('product/archive',        'ProductController@archivedList');
        
        /****************************CATEGORY******************************/
        $router->get('category/list',          'CategoryController@dropdownList');
    });
});
