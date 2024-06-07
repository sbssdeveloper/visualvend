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
        Schema::create('remote_vend_log', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('vend_id', 36);
            $table->integer('machine_id')->index('machine_id');
            $table->string('machine_name', 60)->nullable();
            $table->integer('client_id')->nullable();
            $table->string('client_name', 50)->nullable();
            $table->string('product_name', 60)->nullable();
            $table->string('aisle_number', 20);
            $table->string('product_id', 20);
            $table->string('customer_name', 40);
            $table->text('customer_email');
            $table->text('customer_mobile');
            $table->dateTime('timeOfCreation');
            $table->string('status', 10)->default('0');
            $table->string('pay_status', 5);
            $table->string('pay_method', 32)->nullable();
            $table->boolean('auto_reset')->default(false);
            $table->boolean('is_deleted')->default(false);
            $table->dateTime('updated_at')->useCurrent();
            $table->dateTime('created_at')->useCurrent();
            $table->integer('duplicate_index')->default(0);
            $table->string('transaction_id', 36)->nullable();
            $table->string('transaction_status', 10)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('remote_vend_log');
    }
};
