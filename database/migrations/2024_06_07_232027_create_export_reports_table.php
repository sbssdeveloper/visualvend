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
        Schema::create('export_reports', function (Blueprint $table) {
            $table->integer('id', true);
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent();
            $table->integer('client_id');
            $table->integer('admin_id')->nullable()->default(0);
            $table->enum('type', ['SALES', 'REFILL', 'STOCK_LEVEL', 'VEND_ACTIVITY', 'VEND_ERROR', 'CLIENT_FEEDBACK', 'EMPLOYEE_REPORT', 'PAYMENT'])->default('SALES');
            $table->integer('machine_id')->nullable();
            $table->string('search', 30)->default('');
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->text('path')->nullable();
            $table->boolean('status')->default(false);
            $table->string('report_type', 100)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('export_reports');
    }
};
