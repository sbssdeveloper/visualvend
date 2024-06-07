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
        Schema::create('employee_transaction', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('transaction_id', 256);
            $table->string('job_number', 127)->default('');
            $table->string('cost_center', 127)->default('');
            $table->integer('client_id')->default(-1);
            $table->integer('employee_id');
            $table->string('employee_full_name', 256);
            $table->string('product_id');
            $table->string('product_name');
            $table->string('product_sku', 100)->default('');
            $table->integer('machine_id');
            $table->string('machine_name', 256);
            $table->string('timestamp');
            $table->boolean('is_deleted')->default(false);
            $table->integer('delete_user_id');
            $table->boolean('pickup_or_return')->default(false);
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employee_transaction');
    }
};
