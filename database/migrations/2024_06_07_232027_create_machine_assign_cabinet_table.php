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
        Schema::create('machine_assign_cabinet', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('machine_id');
            $table->string('machine_sub_id');
            $table->integer('max_rows')->default(6);
            $table->integer('max_aisles')->default(8);
            $table->integer('max_qty')->default(10);
            $table->string('vending_brand');
            $table->string('release_type');
            $table->string('motors_used', 20)->default('single');
            $table->boolean('motors_door_unlock')->default(true);
            $table->boolean('motors_direction')->default(true);
            $table->boolean('elevator_door_status')->default(false);
            $table->integer('delivery_door_locktime')->default(20);
            $table->string('aisle_no_format_start', 10)->default('01');
            $table->string('aisle_no_format_end', 10)->default('99');
            $table->boolean('is_deleted')->default(false);
            $table->softDeletes();
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('machine_assign_cabinet');
    }
};
