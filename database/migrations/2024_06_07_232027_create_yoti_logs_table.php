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
        Schema::create('yoti_logs', function (Blueprint $table) {
            $table->integer('id', true);
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent();
            $table->string('timestamp', 20)->nullable();
            $table->string('uuid', 36);
            $table->integer('machine_id');
            $table->string('product_id', 30);
            $table->string('aisle_number', 5);
            $table->tinyInteger('age_threshold')->nullable();
            $table->string('method', 20)->nullable();
            $table->string('session_uuid', 36)->nullable();
            $table->string('result', 10)->nullable();
            $table->string('status', 20)->nullable();
            $table->string('evidence_uuid', 36)->nullable();
            $table->tinyInteger('sequence_number')->nullable();
            $table->json('data')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('yoti_logs');
    }
};
