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
        Schema::create('total_quantity_restriction', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('uuid', 36)->nullable();
            $table->integer('client_id');
            $table->integer('group_id');
            $table->string('group_name', 100)->nullable();
            $table->string('client_name', 100)->nullable();
            $table->string('product_id');
            $table->string('product_name', 100)->nullable();
            $table->integer('quantity');
            $table->string('added_by', 256);
            $table->string('frequency', 50);
            $table->string('start_date', 50);
            $table->string('end_date', 50);
            $table->timestamp('added_on')->useCurrent();
            $table->text('machines')->comment('comma sepearated machine id list');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('total_quantity_restriction');
    }
};
