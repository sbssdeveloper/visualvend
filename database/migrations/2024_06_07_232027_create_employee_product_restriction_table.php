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
        Schema::create('employee_product_restriction', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('uuid', 36)->nullable()->index('uuid');
            $table->integer('client_id')->default(-1);
            $table->string('client_name', 100)->nullable();
            $table->string('product_id', 256);
            $table->string('product_name', 100)->nullable();
            $table->string('employee_id');
            $table->string('employee_name', 100)->nullable();
            $table->string('added_by', 256);
            $table->timestamp('added_on');
            $table->text('machine_ids');
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->string('frequency', 50);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employee_product_restriction');
    }
};
