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
        Schema::create('advertisement_image', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('client_id');
            $table->string('machine_id', 256);
            $table->text('image_advertisement_title');
            $table->text('image_advertisement_url');
            $table->string('image_position', 256);
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamp('added_on')->useCurrent();
            $table->string('added_by', 256);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('advertisement_image');
    }
};
