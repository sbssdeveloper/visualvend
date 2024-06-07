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
        Schema::create('vend_activity_report', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('transaction_id', 256);
            $table->string('product_id', 256);
            $table->string('product_name', 256);
            $table->string('product_price', 256);
            $table->integer('client_id')->default(-1);
            $table->integer('machine_id');
            $table->string('machine_name', 256);
            $table->string('aisle_no', 50);
            $table->integer('aisle_remain_qty');
            $table->integer('transaction_status')->default(2);
            $table->integer('employee_id')->nullable()->index('fk_vend_activity_report_employee_id');
            $table->boolean('pickup_or_return')->default(false)->comment('-1: pickup or vended, 1: return, 0: faulty return');
            $table->string('timestamp', 256);
            $table->boolean('is_deleted')->default(false);
            $table->integer('delete_user_id')->default(0);
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
        Schema::dropIfExists('vend_activity_report');
    }
};
