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
        Schema::create('daily_backup', function (Blueprint $table) {
            $table->integer('id', true);
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent();
            $table->integer('activation_status')->default(0);
            $table->integer('admin')->default(0);
            $table->integer('admin_log')->default(0);
            $table->integer('advertisement')->default(0);
            $table->integer('advertisement_assign')->default(0);
            $table->integer('advertisement_image')->default(0);
            $table->integer('advertisement_report')->default(0);
            $table->integer('aisles')->default(0);
            $table->integer('auth_token')->default(0);
            $table->integer('auto_reset_config')->default(0);
            $table->integer('cabinet')->default(0);
            $table->integer('category')->default(0);
            $table->integer('client')->default(0);
            $table->integer('employee')->default(0);
            $table->integer('employee_group')->default(0);
            $table->integer('employee_group_product_restriction')->default(0);
            $table->integer('employee_product_quantity_restriction')->default(0);
            $table->integer('employee_product_restriction')->default(0);
            $table->integer('employee_transaction')->default(0);
            $table->integer('feed')->default(0);
            $table->integer('feedback')->default(0);
            $table->integer('gift_report')->default(0);
            $table->integer('home_config')->default(0);
            $table->integer('location_non_functional')->default(0);
            $table->integer('login_log')->default(0);
            $table->integer('machine')->default(0);
            $table->integer('machine_assign_cabinet')->default(0);
            $table->integer('machine_assign_category')->default(0);
            $table->integer('machine_assign_lockerbox')->default(0);
            $table->integer('machine_assign_product')->default(0);
            $table->integer('machine_availability')->default(0);
            $table->integer('machine_heart_beat')->default(0);
            $table->integer('machine_initial_setup')->default(0);
            $table->integer('machine_live_status')->default(0);
            $table->integer('machine_log')->default(0);
            $table->integer('machine_product_map')->default(0);
            $table->integer('product')->default(0);
            $table->integer('product_assign_category')->default(0);
            $table->integer('product_services')->default(0);
            $table->integer('receipts')->default(0);
            $table->integer('refill_history')->default(0);
            $table->integer('remote_vend_log')->default(0);
            $table->integer('remote_vend_ping_status')->default(0);
            $table->integer('report_email')->default(0);
            $table->integer('schedule_report_approval')->default(0);
            $table->integer('service_reports')->default(0);
            $table->integer('term_read_log')->default(0);
            $table->integer('total_quantity_restriction')->default(0);
            $table->integer('user')->default(0);
            $table->integer('user_status')->default(0);
            $table->integer('vend_activity_report')->default(0);
            $table->integer('zero')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('daily_backup');
    }
};
