<?php

$router->group(['prefix' => 's3'], function () use ($router) {
    $router->get('media/{type}/{filename}', 'S3BucketController@fetchUrl');
    $router->group(['middleware' => 'jwt'], function () use ($router) {
        $router->post('preassigned/url', 'S3BucketController@getPresignedUrl');
        $router->post('preassigned/multiple/url', 'S3BucketController@getPresignedMultipleUrls');
        $router->post('file/delete', 'S3BucketController@deleteFile');
        $router->post('file/exists', 'S3BucketController@fileExists');
        $router->post('file/url', 'S3BucketController@getFileUrl');
    });
});

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
        $router->post('machine/info',           'MachineController@info');
        $router->post('machine/create',         'MachineController@create');
        $router->post('machine/update',         'MachineController@update');
        $router->post('machine/edit',           'MachineController@edit');
        $router->post('machine/delete',         'MachineController@delete');
        $router->post('machine/clone',          'MachineController@cloning');
        $router->post('machine/configuration',  'MachineController@configure');
        $router->post('machine/products/reset', 'MachineController@reset');

        /****************************ADVERTISEMENT******************************/
        $router->get('advertisement/list',      'AdvertisementController@list');

        /****************************Product******************************/
        $router->post('product/list',           'ProductController@allActiveProducts');
        $router->post('product/assigned',       'ProductController@assignedList');
        $router->post('product/unassigned',     'ProductController@unAssignedList');
        $router->post('product/archive',        'ProductController@archivedList');
        $router->post('product/delete',         'ProductController@delete');
        $router->post('product/delete/bulk',    'ProductController@bulkDelete');
        $router->post('product/upload',         'ProductController@upload');
        $router->post('product/bulk/update',    'ProductController@bulkUpdate');
        $router->post('product/create',         'ProductController@create');
        $router->post('product/update',         'ProductController@update');
        $router->post('product/info',           'ProductController@info');
        $router->post('product/upload/image',   'ProductController@uploadImage');
        $router->post('product/demo/image',     'ProductController@demoImage');

        /****************************CATEGORY******************************/
        $router->get('category/list[/{cid}]',   'CategoryController@dropdownList');
        $router->post('category/list',          'CategoryController@list');
        $router->post('category/create',        'CategoryController@create');
        $router->post('category/update',        'CategoryController@update');
        $router->post('category/delete',        'CategoryController@delete');
        $router->post('category/upload/list',   'CategoryController@uploadlist');

        /****************************CLIENT******************************/
        $router->get('client/list',             'ClientController@dropdownList');

        /****************************USER******************************/
        $router->post('user/list',              'UserController@list');

        /****************************REPORTS******************************/
        $router->post('reports/sales',          'ReportsController@sales');
        $router->post('reports/refill',         'ReportsController@refill');
        $router->post('reports/stock',          'ReportsController@stock');
        $router->post('reports/vend/activity',  'ReportsController@vend_activity');
        $router->post('reports/expiry/products','ReportsController@expiryProducts');
        $router->post('reports/vend/error',     'ReportsController@vend_error');
    });
});
