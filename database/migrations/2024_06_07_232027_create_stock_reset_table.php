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
        Schema::create('stock_reset', function (Blueprint $table) {
            $table->integer('id', true);
            $table->dateTime('created_at')->useCurrent();
            $table->string('uuid', 36);
            $table->string('aisle', 5);
            $table->integer('client_id');
            $table->string('client_name', 60);
            $table->integer('machine_id');
            $table->string('machine_name', 60);
            $table->string('product_id', 50);
            $table->string('product_name', 60);
            $table->integer('original_amount');
            $table->integer('reset_by')->default(-1)->comment('adminID. If user is super admin, value would be -1');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stock_reset');
    }
};
