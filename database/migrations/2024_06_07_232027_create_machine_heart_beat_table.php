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
        Schema::create('machine_heart_beat', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('machine_id');
            $table->timestamp('last_sync_time')->useCurrent();
            $table->text('last_action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('machine_heart_beat');
    }
};
