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
        Schema::create('transactions', function (Blueprint $table) {
            $table->integer('id', true);
            $table->dateTime('created_at')->useCurrent();
            $table->string('vend_uuid', 40);
            $table->string('transaction_id', 50);
            $table->string('amount', 10);
            $table->string('status', 20);
            $table->enum('payment_status', ['FAILED', 'SUCCESS', 'PENDING']);
            $table->string('type', 20);
            $table->text('response');
            $table->text('error_log')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
};
