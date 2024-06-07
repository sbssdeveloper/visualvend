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
        Schema::create('login_log', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('username');
            $table->string('upt_no')->nullable();
            $table->timestamp('time')->useCurrent();
            $table->string('ip_address');
            $table->string('device_imei_number', 128);
            $table->boolean('terms_and_condition_accepted');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('login_log');
    }
};
