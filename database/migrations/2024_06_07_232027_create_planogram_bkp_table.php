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
        Schema::create('planogram_bkp', function (Blueprint $table) {
            $table->integer('id', true);
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent();
            $table->string('uuid', 40);
            $table->integer('client_id');
            $table->integer('machine_id');
            $table->string('name', 50);
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->enum('status', ['Active', 'Inactive', 'Live'])->default('Inactive');
            $table->boolean('is_default')->default(false);
            $table->string('mode', 15)->nullable();
            $table->enum('age_verify', ['Y', 'N'])->default('Y');
            $table->string('parent_uuid', 36)->nullable();
            $table->enum('is_uploaded', ['Y', 'N'])->default('N');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('planogram_bkp');
    }
};
