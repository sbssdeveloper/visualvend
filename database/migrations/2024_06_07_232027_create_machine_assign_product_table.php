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
        Schema::create('machine_assign_product', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('machine_id', 256);
            $table->string('category_id', 256);
            $table->string('product_id', 256);
            $table->float('product_price', 5)->default(0);
            $table->integer('product_map_id')->default(-1);
            $table->integer('product_location');
            $table->integer('product_quantity');
            $table->integer('product_max_quantity');
            $table->integer('show_order')->nullable();
            $table->string('s2s')->nullable();
            $table->string('aisles_included', 100)->nullable();
            $table->tinyInteger('vend_quantity')->default(0);
            $table->string('bundle_includes')->nullable();
            $table->float('bundle_price', 5)->default(0);
            $table->enum('currency', ['AUD', 'USD', 'EUR', 'GBP'])->default('AUD');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('machine_assign_product');
    }
};
