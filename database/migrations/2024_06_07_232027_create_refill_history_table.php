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
        Schema::create('refill_history', function (Blueprint $table) {
            $table->integer('id', true);
            $table->dateTime('created_at')->useCurrent();
            $table->integer('client_id');
            $table->integer('machine_id')->index('fk_refill_history_machine_id');
            $table->string('machine_name', 150)->nullable();
            $table->string('product_id', 50)->index('product_id');
            $table->string('product_name', 150)->nullable();
            $table->string('category_id', 50)->index('category_id');
            $table->string('category_name', 150)->nullable();
            $table->string('aisle_number', 50);
            $table->integer('refill_amount');
            $table->integer('origin_amount');
            $table->boolean('is_deleted')->default(false);
            $table->integer('delete_user_id');
            $table->softDeletes()->useCurrentOnUpdate()->nullable(false);

            $table->unique(['id'], 'machine_id_idx');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('refill_history');
    }
};
