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
        Schema::create('report_email', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('client_id');
            $table->string('type', 256);
            $table->text('email');
            $table->string('frequency', 256);
            $table->string('created_by', 256);
            $table->timestamp('timestamp')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('report_email');
    }
};
