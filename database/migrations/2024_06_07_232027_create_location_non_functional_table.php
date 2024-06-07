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
        Schema::create('location_non_functional', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('defect_id');
            $table->integer('machine_id')->index('machine_id');
            $table->string('machine_name', 256);
            $table->string('defective_location', 256);
            $table->string('error_code', 512);
            $table->string('status', 256)->default('Set');
            $table->string('product_name', 256);
            $table->timestamp('timestamp')->useCurrent();
            $table->timestamp('update_server_timestamp')->useCurrent();
            $table->boolean('is_deleted')->default(false);
            $table->integer('delete_user_id');
            $table->softDeletes();
            $table->string('machine_sub_id')->default('vending_machine');
            $table->string('error_description');
            $table->boolean('container_type')->default(false);
            $table->timestamp('cleared_at')->nullable();
            $table->boolean('is_cleared_by_machine')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('location_non_functional');
    }
};
