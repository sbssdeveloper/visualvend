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
        Schema::create('zero', function (Blueprint $table) {
            $table->integer('reg_id', true);
            $table->string('fname', 20);
            $table->string('lname', 20);
            $table->string('email');
            $table->string('pcode', 50);
            $table->date('dob');
            $table->boolean('already_pulled')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('zero');
    }
};
