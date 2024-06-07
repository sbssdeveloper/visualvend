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
        Schema::create('admin', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('mobilenumber', 20)->unique('mobilenumber');
            $table->string('firstname', 128);
            $table->string('lastname', 128);
            $table->string('username', 256)->nullable();
            $table->string('organization', 128);
            $table->string('emailid', 128);
            $table->string('role', 128);
            $table->string('upt_no', 256);
            $table->integer('client_id')->default(-1);
            $table->string('password', 128);
            $table->text('machines');
            $table->text('menus');
            $table->text('reports');
            $table->boolean('is_activated')->default(false);
            $table->date('show_data_after')->nullable();
            $table->dateTime('timestamp')->useCurrent();
            $table->dateTime('updated_at')->useCurrent();
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
        Schema::dropIfExists('admin');
    }
};
