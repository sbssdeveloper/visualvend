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
        Schema::create('advertisement_report', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('advertisement_id');
            $table->string('advertisement_name', 256);
            $table->integer('client_id')->default(-1);
            $table->integer('machine_id');
            $table->string('machine_name', 256);
            $table->string('advertisement_position', 256);
            $table->string('advertisement_screen', 256);
            $table->timestamp('timestamp');
            $table->tinyInteger('is_deleted')->default(0);
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
        Schema::dropIfExists('advertisement_report');
    }
};
