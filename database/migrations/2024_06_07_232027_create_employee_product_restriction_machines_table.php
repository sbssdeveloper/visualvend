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
        Schema::create('employee_product_restriction_machines', function (Blueprint $table) {
            $table->integer('pid', true);
            $table->string('uuid', 36)->index('uuid');
            $table->integer('machine_id');
            $table->string('machine_name', 100)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employee_product_restriction_machines');
    }
};
