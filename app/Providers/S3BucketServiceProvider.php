<?php

namespace App\Providers;

use Aws\S3\S3Client;
use Illuminate\Support\ServiceProvider;

class S3BucketServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(S3Client::class, function ($app) {
            return new S3Client([
                'version' => 'latest',
                'region' => env('S3_REGION'),
                'endpoint' => env('S3_URL'),
                'credentials' => [
                    'key' => env('S3_ACCESS_KEY'),
                    'secret' => env('S3_SECRET_KEY'),
                ],
            ]);
        });
    }
}
