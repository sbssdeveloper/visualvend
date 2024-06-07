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
        Schema::create('machine_availability', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('machine_id');
            $table->string('availability_status', 2);
            $table->string('faulty_aisles_list');
            $table->boolean('is_reset')->default(false);
            $table->boolean('auto_reset')->default(false);
            $table->boolean('is_deleted')->default(false);
            $table->dateTime('updated_at')->useCurrent();
            $table->dateTime('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('machine_availability');
    }
};
