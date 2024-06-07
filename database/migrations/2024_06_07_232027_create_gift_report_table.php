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
        Schema::create('gift_report', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('transaction_id', 256);
            $table->string('product_id', 256);
            $table->string('product_name', 256);
            $table->string('product_price', 256);
            $table->string('name', 256);
            $table->string('last_name', 256);
            $table->string('email', 256);
            $table->string('mobile', 15);
            $table->text('concern');
            $table->integer('client_id');
            $table->integer('machine_id');
            $table->string('timestamp', 256);
            $table->timestamp('server_update_timestamp')->useCurrent();
            $table->boolean('is_deleted')->default(false);
            $table->integer('delete_user_id');
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
        Schema::dropIfExists('gift_report');
    }
};
