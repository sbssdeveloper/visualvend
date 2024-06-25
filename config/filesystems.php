<?php

return [

    'default' => env('FILESYSTEM_PRIVATE', 'local'),

    'disks' => [

        'private' => [
            'driver' => 'local',
            'root' => storage_path('storage/uploads/restricted'),
            'visibility' => 'private',
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('storage/uploads'),
            'url' => env('APP_URL') . '/uploads',
            'visibility' => 'public',
        ],


        'wasabi' => [
            'driver' => 's3',
            'key' => env('S3_ACCESS_KEY'),
            'secret' => env('S3_SECRET_KEY'),
            'region' => env('S3_REGION'),
            'bucket' => env('S3_BUCKET'),
            'endpoint' => env('S3_URL')
        ],

    ]

];
