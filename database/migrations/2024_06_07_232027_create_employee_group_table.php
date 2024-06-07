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
        Schema::create('employee_group', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('uuid', 36)->nullable()->index('uuid');
            $table->integer('client_id')->default(-1);
            $table->string('group_name', 256);
            $table->text('machines')->comment('comma sepearated machine id list');
            $table->string('created_by', 256);
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->dateTime('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employee_group');
    }
};
