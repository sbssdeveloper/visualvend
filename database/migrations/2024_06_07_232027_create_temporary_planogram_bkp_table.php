<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('temporary_planogram_bkp', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('uuid', 36);
            $table->integer('client_id');
            $table->string('category_id', 256);
            $table->string('product_id', 256)->index('product_id');
            $table->string('product_name', 256);
            $table->float('product_price', 5)->nullable()->default(0);
            $table->string('product_image', 1024)->default('ngapp/assets/images/product/thumbnail/no_product.png');
            $table->string('product_image_thumbnail', 150)->nullable();
            $table->string('product_more_info_image', 150)->nullable();
            $table->string('product_detail_image', 150)->nullable();
            $table->string('ad_primary_landscape', 150)->nullable();
            $table->string('ad_secondary_landscape', 150)->nullable();
            $table->string('ad_primary_portrait', 150)->nullable();
            $table->string('ad_secondary_portrait', 150)->nullable();
            $table->string('product_more_info_video', 150)->nullable();
            $table->string('product_detail_video', 150)->nullable();
            $table->string('product_location', 64)->index('product_location_idx');
            $table->integer('product_quantity');
            $table->integer('product_max_quantity');
            $table->integer('show_order');
            $table->string('s2s')->nullable();
            $table->string('aisles_included', 100)->nullable();
            $table->tinyInteger('vend_quantity')->default(0);
            $table->string('bundle_includes')->nullable();
            $table->float('bundle_price', 5)->default(0);
            $table->string('machine_sub_id')->default('');
            $table->boolean('container_type')->default(false);
            $table->enum('currency', ['AUD', 'USD', 'EUR', 'GBP'])->default('AUD');
            $table->dateTime('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('temporary_planogram_bkp');
    }
};
