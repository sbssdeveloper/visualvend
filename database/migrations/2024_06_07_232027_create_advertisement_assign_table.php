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
        Schema::create('advertisement_assign', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('advertisement_id');
            $table->integer('client_id');
            $table->integer('machine_id');
            $table->string('position', 256);
            $table->tinyInteger('position_type')->comment('{name:\'All Positions\', id:\'-1\'},         {name:\'Home Screen\', id:\'0\'},         {name:\'Screensaver\', id:\'1\'},         {name:\'Product Screen\', id:\'2\'},         {name:\'Product Detail Screen\', id:\'3\'},         {name:\'On Selection of Category\', id:\'4\'},         {name:\'On Selection of Product\', id:\'5\'},         {name:\'Info Button Media ads to Play\', id:\'6\'},         {name:\'Failed to vend page\', id:\'7\'},         {name:\'Vending Screen\', id:\'8\'},         {name:\'Vend Success Screen\', id:\'9\'},         {name:\'Vend Failed Screen\', id:\'10\'},         {name:\'Free Gift Button Page Media ads to Play\', id:\'11\'},         {name:\'Special Needs Button Page Media ads\', id:\'12\'},         {name:\'Tap visual vend or other logo\', id:\'13\'},         {name:\'Tap Help To See Media ad Instructions\', id:\'14\'},');
            $table->string('position_relation');
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->boolean('is_suspend')->default(false)->comment('0:no 1:yes');
            $table->dateTime('added_on')->useCurrent();
            $table->boolean('is_already_pulled')->comment('0: new/updated data, 1: old data');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('advertisement_assign');
    }
};
