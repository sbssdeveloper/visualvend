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
        Schema::create('receipts', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('machine_id');
            $table->string('transaction_id', 256);
            $table->string('name', 256);
            $table->string('email', 256);
            $table->string('mobile_number', 256);
            $table->string('product', 256);
            $table->string('price', 256);
            $table->string('url', 256);
            $table->string('date_time', 256);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('receipts');
    }
};
