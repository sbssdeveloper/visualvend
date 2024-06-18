<?php

$router->group(['prefix' => 'v1'], function () use ($router) {
    $router->get('documentation', '\SwaggerLume\Http\Controllers\SwaggerLumeController@api');
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
        $router->post('machine/list',           'MachineController@list');

        /****************************ADVERTISEMENT******************************/
        $router->get('advertisement/list',      'AdvertisementController@list');

        /****************************Product******************************/
        $router->post('product/assigned',       'ProductController@assignedList');
        $router->post('product/unassigned',     'ProductController@unAssignedList');
        $router->post('product/archive',        'ProductController@archivedList');
        $router->post('product/delete',         'ProductController@delete');
        $router->post('product/delete/bulk',    'ProductController@bulkDelete');
        $router->post('product/upload',         'ProductController@upload');
        $router->post('product/bulk/update',    'ProductController@bulkUpdate');

        /****************************CATEGORY******************************/
        $router->get('category/list',          'CategoryController@dropdownList');
        $router->post('category/list',         'CategoryController@list');

        /****************************CLIENT******************************/
        $router->get('client/list',             'ClientController@dropdownList');
    });
});
