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
        Schema::table('machine_product_map', function (Blueprint $table) {
            $table->foreign(['machine_id'], 'fk_machine_product_map_machine_id')->references(['id'])->on('machine')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('machine_product_map', function (Blueprint $table) {
            $table->dropForeign('fk_machine_product_map_machine_id');
        });
    }
};
