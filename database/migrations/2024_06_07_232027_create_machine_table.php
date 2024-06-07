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
        Schema::create('machine', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('machine_username');
            $table->string('machine_upt_no');
            $table->string('machine_name', 256);
            $table->string('serial_port_number', 512)->default('/dev/ttyS1');
            $table->integer('serial_port_speed')->default(38400);
            $table->integer('machine_client_id');
            $table->integer('machine_mode')->default(1);
            $table->boolean('machine_passcode_screen')->default(true);
            $table->integer('advertisement_type')->default(1);
            $table->string('screen_size', 127)->default('7 inch');
            $table->string('screen_orientation', 127)->default('Portrait');
            $table->integer('machine_advertisement_mode')->default(0);
            $table->boolean('machine_is_game_enabled')->default(false);
            $table->integer('machine_game')->default(1);
            $table->boolean('machine_info_button_enabled')->default(false);
            $table->boolean('machine_screensaver_enabled')->default(false);
            $table->boolean('machine_volume_control_enabled')->default(true);
            $table->boolean('machine_wheel_chair_enabled')->default(false);
            $table->boolean('machine_is_asset_tracking')->default(false);
            $table->boolean('machine_is_advertisement_reporting')->default(false);
            $table->boolean('machine_is_feed_enabled')->default(false);
            $table->boolean('machine_is_job_number_enabled')->default(false);
            $table->boolean('machine_is_cost_center_enabled')->default(false);
            $table->boolean('machine_is_gift_enabled')->default(false);
            $table->boolean('newsletter_enabled')->default(false);
            $table->integer('machine_row');
            $table->integer('machine_column');
            $table->string('machine_address', 256);
            $table->double('machine_latitude');
            $table->double('machine_longitude');
            $table->boolean('machine_is_single_category');
            $table->string('machine_token', 512);
            $table->boolean('machine_helpline_enabled')->default(false);
            $table->boolean('receipt_enabled')->default(false);
            $table->string('machine_helpline', 512)->default('Please call (028) 197-2733 for technical support');
            $table->string('machine_customer_care_number', 512)->default('(028) 197-2733');
            $table->string('banner_text', 100)->default('');
            $table->string('logo')->default('');
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('activated_at')->useCurrent();
            $table->dateTime('viewed_at')->useCurrent();
            $table->tinyInteger('is_deleted')->default(0);
            $table->integer('delete_user_id')->default(0);
            $table->softDeletes();
            $table->integer('machine_live_mode')->default(1);
            $table->integer('machine_type')->default(0);
            $table->string('locker_box_board')->default('green');
            $table->string('machine_controller', 15)->default('red');
            $table->string('screen_position', 15)->default('full');
            $table->integer('nuber_screen')->default(0);
            $table->integer('category_menu_support')->default(0);
            $table->string('product_menu_layout', 10)->default('1p');
            $table->integer('display2_screen_size')->default(10);
            $table->string('display2_screen_orientation', 20)->default('portrait');
            $table->string('display2_screen_position', 20)->default('right');
            $table->integer('product_menu_formatting')->default(0);
            $table->string('product_menu_color', 20)->nullable();
            $table->string('product_menu_bg_color', 20)->nullable();
            $table->string('vend_comms_port', 20)->nullable();
            $table->integer('vend_comms_baud_rate')->default(38400);
            $table->integer('shopping_cart_support')->default(0);
            $table->integer('cnc_support')->default(0);
            $table->string('screensaver_text')->default('Tap to Start');
            $table->string('screensaver_text_position', 20)->default('Bottom');
            $table->string('screensaver_text_color')->default('Blue');
            $table->string('screensaver_text_outline_style')->default('Outline Only');
            $table->string('screensaver_text_outline')->default('Blue');
            $table->boolean('keypad')->default(false);
            $table->boolean('online_survey_form')->default(false);
            $table->boolean('click_n_collect_btn')->default(false);
            $table->boolean('free_gift_btn')->default(false);
            $table->string('machine_helpline2');
            $table->string('thanks_screen_text');
            $table->string('machine_customer_care_email');
            $table->string('vend_screen_text_line1');
            $table->string('vend_screen_text_line2');
            $table->string('vend_screen_text_line3');
            $table->string('serial_board_type')->default('Red');
            $table->integer('serial_baud_rate')->default(38400);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('machine');
    }
};
