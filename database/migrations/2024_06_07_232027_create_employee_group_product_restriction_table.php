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
        Schema::create('employee_group_product_restriction', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('uuid', 36)->nullable()->index('uuid');
            $table->integer('group_id');
            $table->string('group_name', 256);
            $table->integer('client_id')->default(-1);
            $table->string('client_name', 100)->nullable();
            $table->string('product_id', 256);
            $table->string('product_name', 256);
            $table->string('product_image', 256);
            $table->text('machines');
            $table->string('added_by', 256);
            $table->timestamp('added_on')->useCurrent();
            $table->string('frequency', 50);
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employee_group_product_restriction');
    }
};
