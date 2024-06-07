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
        Schema::create('schedule_report_approval', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('client_code');
            $table->string('client_name');
            $table->string('report_type');
            $table->timestamp('requested_on')->useCurrent();
            $table->tinyInteger('is_approval')->default(0);
            $table->integer('client_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedule_report_approval');
    }
};
