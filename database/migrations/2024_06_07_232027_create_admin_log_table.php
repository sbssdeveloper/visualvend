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
        Schema::create('admin_log', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('mobilenumber', 20);
            $table->string('upt_no', 256);
            $table->timestamp('time')->useCurrent();
            $table->string('ip_address', 256);
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
        Schema::dropIfExists('admin_log');
    }
};
