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
        Schema::create('home_config', function (Blueprint $table) {
            $table->integer('id', true);
            $table->text('header_text');
            $table->text('catch_phrase');
            $table->text('dash_media');
            $table->boolean('dash_media_type')->default(false)->comment('0: image, 1: video');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('home_config');
    }
};
