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
        Schema::create('employee', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('uuid', 36)->nullable()->index('uuid');
            $table->string('first_name', 256);
            $table->string('last_name', 256);
            $table->string('mobile_number', 13);
            $table->string('job_number', 20);
            $table->string('employee_id', 20);
            $table->string('emp_card_no', 256);
            $table->integer('client_id')->default(-1)->index('client_id');
            $table->string('client_name', 100)->nullable();
            $table->integer('group_id');
            $table->string('group_name', 256);
            $table->text('machines')->comment('comma separated machine id list');
            $table->string('account_created_by', 256);
            $table->timestamp('created_at')->useCurrent();
            $table->boolean('is_deleted')->default(false);
            $table->integer('delete_user_id');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employee');
    }
};
