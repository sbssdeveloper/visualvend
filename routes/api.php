<?php

$router->group(['prefix' => 's3'], function () use ($router) {
    $router->get('media/{type}/{filename}', 'S3BucketController@fetchUrl');
    $router->group(['middleware' => 'jwt'], function () use ($router) {
        $router->post('preassigned/url',            'S3BucketController@getPresignedUrl');
        $router->post('preassigned/multiple/url',   'S3BucketController@getPresignedMultipleUrls');
        $router->post('file/delete',                'S3BucketController@deleteFile');
        $router->post('file/exists',                'S3BucketController@fileExists');
        $router->post('file/url',                   'S3BucketController@getFileUrl');
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
        $router->get('machine/list[/{cid}]',    'MachineController@dropdownList');
        $router->post('machine/list',           'MachineController@list');
        $router->post('machine/info',           'MachineController@info');
        $router->post('machine/create',         'MachineController@create');
        $router->post('machine/update',         'MachineController@update');
        $router->post('machine/delete',         'MachineController@delete');
        $router->post('machine/clone',          'MachineController@cloning');
        $router->post('machine/configuration',  'MachineController@configure');
        $router->post('machine/products/reset', 'MachineController@reset');
        $router->post('machine/refill/info',    'MachineController@refillInfo');

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
        $router->post('client/list',            'ClientController@listing');
        $router->post('client/info',            'ClientController@info');
        $router->post('client/update',          'ClientController@update');

        /****************************USER******************************/
        $router->post('user/available/list',    'UserController@availableList');
        $router->post('user/request/login',     'UserController@requestLogin');

        /****************************REPORTS******************************/
        $router->post('reports/sales',          'ReportsController@sales');
        $router->post('reports/refill',         'ReportsController@refill');
        $router->post('reports/stock',          'ReportsController@stock');
        $router->post('reports/vend/activity',  'ReportsController@vend_activity');
        $router->post('reports/expiry/products', 'ReportsController@expiryProducts');
        $router->post('reports/vend/error',     'ReportsController@vend_error');
        $router->post('reports/feedback',       'ReportsController@feedback');
        $router->post('reports/email',          'ReportsController@getEmail');
        $router->post('reports/staff',          'ReportsController@staff');
        $router->post('reports/service',        'ReportsController@service');
        $router->post('reports/receipts',       'ReportsController@receipts');
        $router->post('reports/gift',           'ReportsController@gift');
        $router->post('reports/payment',        'ReportsController@payment');
        $router->post('reports/vend/queue',     'ReportsController@vend_queue');

        /****************************Planogram******************************/
        $router->group(['prefix' => 'planogram'], function () use ($router) {
            $router->post('list',               'PlanogramController@list');
            $router->get('info[/{uuid}/{type}]','PlanogramController@info');
            $router->post('upload',             'PlanogramController@upload');
            $router->post('update',             'PlanogramController@update');
            $router->post('reset',              'PlanogramController@reset');
            $router->post('view',               'PlanogramController@view');
            $router->post('delete',             'PlanogramController@delete');
            $router->post('status/update',      'PlanogramController@status');
        });
    });
});
