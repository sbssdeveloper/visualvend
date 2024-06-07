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
        Schema::create('activation_status', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('machine_id');
            $table->string('machine_name', 256);
            $table->string('user_name', 256);
            $table->string('imei_number', 256);
            $table->string('wifi_mac', 256);
            $table->string('ip_address', 256);
            $table->boolean('is_activated');
            $table->timestamp('timestamp')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('activation_status');
    }
};
