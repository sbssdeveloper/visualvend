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
        Schema::create('service_reports', function (Blueprint $table) {
            $table->integer('id', true);
            $table->timestamp('date_returned', 6)->nullable();
            $table->integer('machine_id')->nullable()->index('service_reports_machine_id_fk');
            $table->string('machine_name', 256)->nullable();
            $table->string('aisle_no', 50)->nullable();
            $table->string('category_id', 256)->nullable();
            $table->string('product_id', 256)->nullable();
            $table->string('product_name', 256)->nullable();
            $table->double('product_price')->nullable()->default(-1);
            $table->integer('client_id')->nullable()->index('service_reports_client_id_fk');
            $table->date('last_serviced_at')->nullable();
            $table->string('service_status', 50)->nullable();
            $table->string('service_type')->nullable();
            $table->string('locker_box')->nullable();
            $table->string('locker_status', 50)->nullable();
            $table->integer('days_past')->nullable();
            $table->integer('product_quantity')->nullable();
            $table->date('product_batch_expiray_date')->nullable();
            $table->date('date_to_service')->nullable();
            $table->tinyInteger('product_delivery')->default(2);
            $table->tinyInteger('product_status')->default(1);
            $table->double('product_size_amount', 10, 2)->nullable();
            $table->string('product_size_unit', 10)->nullable();
            $table->integer('product_max_quantity')->nullable();
            $table->timestamp('created_at', 6)->nullable();
            $table->softDeletes('deleted_at', 6);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('service_reports');
    }
};
