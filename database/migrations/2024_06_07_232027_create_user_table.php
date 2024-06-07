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
        Schema::create('user', function (Blueprint $table) {
            $table->integer('id', true);
            $table->dateTime('activated_on')->useCurrent();
            $table->timestamp('last_updated');
            $table->string('uuid', 36);
            $table->integer('client_id')->default(-1);
            $table->string('firstname', 128);
            $table->string('lastname', 128);
            $table->string('username');
            $table->string('emailid', 128);
            $table->string('mobilenumber', 20);
            $table->string('upt_no', 256)->nullable();
            $table->string('token', 1024);
            $table->string('password', 128);
            $table->text('machines');
            $table->text('machines_bkp')->nullable();
            $table->integer('status')->default(-1);
            $table->string('is_deactivated', 1)->default('0');
            $table->enum('mode', ['M', 'I'])->default('M');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user');
    }
};
