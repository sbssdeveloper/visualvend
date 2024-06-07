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
        Schema::create('product_services', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('product_id')->nullable()->index('product_services_product_id_fk')->comment('primary key - id field (int) in product table');
            $table->string('product_id_str', 256)->nullable()->comment('product_id field (string) in product table');
            $table->string('product_name', 256)->nullable();
            $table->double('product_size_amount', 10, 2)->nullable();
            $table->string('product_size_unit', 10)->nullable();
            $table->date('product_batch_expiray_date')->nullable();
            $table->date('date_to_service')->nullable();
            $table->tinyInteger('product_delivery')->default(2)->comment('0: Pickup, 1: Return, 2: Both');
            $table->tinyInteger('product_status')->default(1)->comment('1: Active, 0: Suspended, 2: Recalled');
            $table->integer('product_max_quantity')->nullable();
            $table->string('aisle_no', 50)->nullable();
            $table->timestamp('date_returned', 6)->nullable();
            $table->boolean('is_service')->default(true)->comment('1: is service, 2: is not service');
            $table->boolean('is_fault_reported')->default(false)->comment('1: fault reported, 0: fault not reported');
            $table->string('fault', 256)->nullable();
            $table->string('transaction_service_id', 256)->nullable();
            $table->integer('reported_staff_id')->nullable();
            $table->string('action')->nullable();
            $table->timestamp('action_at', 6)->nullable();
            $table->timestamp('reviewed_at', 6)->nullable();
            $table->string('review_result', 50)->nullable()->comment('possible values: faulty - repair, faulty - replace, no faulty found');
            $table->string('resolution', 50)->nullable()->comment('possible values: repaired, replaced, removed, waiting on parts');
            $table->integer('machine_id')->nullable()->index('product_services_machine_id_fk');
            $table->string('machine_name', 256)->nullable();
            $table->string('category_id', 256)->nullable();
            $table->double('product_price')->nullable()->default(-1);
            $table->integer('client_id')->nullable()->index('product_services_client_id_fk');
            $table->date('last_serviced_at')->nullable();
            $table->integer('days_past')->nullable();
            $table->integer('product_quantity')->nullable();
            $table->timestamps(6);
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
        Schema::dropIfExists('product_services');
    }
};
