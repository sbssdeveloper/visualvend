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
        Schema::create('client', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('client_code', 256);
            $table->string('client_name', 256);
            $table->string('business_registration_number', 256);
            $table->string('client_username', 256)->nullable();
            $table->string('client_address', 2048);
            $table->string('client_email', 256);
            $table->string('client_phone', 256);
            $table->string('role', 256)->default('Full Access');
            $table->string('client_password', 128);
            $table->boolean('enable_mail_report')->default(false);
            $table->boolean('enable_mail_sale_report')->default(false);
            $table->boolean('enable_mail_feedback')->default(false);
            $table->boolean('enable_mail_e_receipt')->default(false);
            $table->boolean('enable_mail_non_functional')->default(false);
            $table->boolean('enable_mail_gift')->default(false);
            $table->boolean('enable_mail_refill')->default(false);
            $table->boolean('enable_mail_ad')->default(false);
            $table->string('created_by', 256);
            $table->timestamp('created_on')->useCurrent();
            $table->dateTime('updated_at')->useCurrent();
            $table->enum('status', ['A', 'I', 'S', 'D'])->default('A')->comment('A=>Active,I=>Inactive,S=>Suspended,D=>Deleted	');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('client');
    }
};
