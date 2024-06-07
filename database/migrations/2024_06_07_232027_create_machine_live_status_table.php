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
        Schema::create('machine_live_status', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('machine_name', 256);
            $table->integer('machine_id');
            $table->string('user_name', 256);
            $table->string('imei_number', 256);
            $table->string('ip_address', 256);
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
        Schema::dropIfExists('machine_live_status');
    }
};
