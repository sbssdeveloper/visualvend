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
        Schema::create('cabinet', function (Blueprint $table) {
            $table->integer('id', true);
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent();
            $table->string('uuid', 36);
            $table->string('user_uuid', 36);
            $table->string('name', 30);
            $table->string('style', 20);
            $table->tinyInteger('max_rows');
            $table->tinyInteger('max_columns');
            $table->string('aisles_format', 10);
            $table->enum('priority', ['1', '2', '3', '4'])->default('1');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cabinet');
    }
};
