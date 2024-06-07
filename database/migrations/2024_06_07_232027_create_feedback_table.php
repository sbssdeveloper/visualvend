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
        Schema::create('feedback', function (Blueprint $table) {
            $table->integer('feedback_id', true);
            $table->string('transaction_id', 256);
            $table->integer('client_id')->default(-1);
            $table->string('machine_id', 10)->index('machine_id');
            $table->string('machine_name', 150)->nullable();
            $table->string('product_id', 50)->index('product_id');
            $table->string('product_name', 256);
            $table->string('customer_name', 256);
            $table->string('customer_phone', 256);
            $table->string('customer_email', 256);
            $table->string('complaint', 256);
            $table->integer('complaint_type');
            $table->text('feedback');
            $table->string('location')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->integer('delete_user_id')->default(0);
            $table->timestamp('timestamp')->useCurrent();
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
        Schema::dropIfExists('feedback');
    }
};
