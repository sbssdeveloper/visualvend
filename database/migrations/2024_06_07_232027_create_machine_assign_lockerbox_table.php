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
        Schema::create('machine_assign_lockerbox', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('machine_id');
            $table->string('machine_sub_id');
            $table->integer('lockerbox_from')->default(1);
            $table->integer('lockerbox_to')->default(1);
            $table->string('direction', 20)->default('left');
            $table->boolean('active')->default(true);
            $table->boolean('pickup')->default(false);
            $table->boolean('is_return')->default(false);
            $table->string('lockerbox_numbering_start', 10)->default('100');
            $table->string('lockerbox_numbering_end', 10)->default('399');
            $table->boolean('is_deleted')->default(false);
            $table->softDeletes();
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('machine_assign_lockerbox');
    }
};
