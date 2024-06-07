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
        Schema::create('advertisement', function (Blueprint $table) {
            $table->string('ads_path', 1024);
            $table->integer('id', true);
            $table->string('ads_name', 256);
            $table->string('ads_resolution', 256)->nullable();
            $table->integer('client_id')->default(-1);
            $table->dateTime('added_on')->useCurrent();
            $table->boolean('orientation')->default(false)->comment('0: landscape, 1: portrait');
            $table->tinyInteger('is_deleted')->default(0);
            $table->integer('delete_user_id');
            $table->dateTime('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('advertisement');
    }
};
