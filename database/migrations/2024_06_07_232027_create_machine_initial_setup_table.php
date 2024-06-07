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
        Schema::create('machine_initial_setup', function (Blueprint $table) {
            $table->integer('#', true);
            $table->integer('id');
            $table->string('machine_username');
            $table->integer('machine_row');
            $table->integer('machine_column');
            $table->string('machine_upt_no');
            $table->string('machine_name');
            $table->integer('machine_client_id');
            $table->string('machine_address');
            $table->string('default_ip_connection')->default('wifi');
            $table->integer('keep_app_foreground')->default(1);
            $table->integer('restart_android')->default(0);
            $table->integer('home_btn')->default(0);
            $table->boolean('settings_menu')->default(true);
            $table->integer('upload_log_time_freq')->default(10);
            $table->string('default_time_to_upload_logs')->default('When Full');
            $table->integer('default_upload_log_filesize')->default(500);
            $table->double('machine_latitude');
            $table->double('machine_longitude');
            $table->boolean('machine_is_single_category');
            $table->boolean('machine_live_mode')->default(true);
            $table->boolean('machine_type')->default(false);
            $table->string('locker_box_board')->default('green');
            $table->longText('cabinet_setting')->nullable();
            $table->longText('planogram_settting')->nullable();
            $table->longText('temperature_settings')->nullable();
            $table->boolean('temperature_mode')->default(false);
            $table->boolean('drop_sensor')->default(false);
            $table->boolean('glass_defrost_settings')->default(false);
            $table->tinyInteger('led_settings')->default(0);
            $table->boolean('vend_machine_mode')->default(false);
            $table->string('vendportal_server_option', 20)->default('vv.vendportal.com	');
            $table->integer('update_freq')->default(60);
            $table->string('updates_server', 20)->default('vv.vendportal.com	');
            $table->integer('check_for_update_freq')->default(600);
            $table->string('data_sync_master', 20)->default('portal');
            $table->string('serial_board_type', 20)->default('red');
            $table->integer('serial_baud_rate')->default(38400);
            $table->string('serial_port', 20)->default('ttyS1');
            $table->string('cabinet_style');
            $table->string('text_style')->default('Black');
            $table->boolean('qr_code_status')->default(false);
            $table->string('qr_link');
            $table->string('qr_code_position', 20)->default('Top');
            $table->string('screens_to_show_qr');
            $table->string('web_link');
            $table->string('instruction_text');
            $table->string('item_style', 20)->default('None');
            $table->string('item_bg_color', 30)->default('Yellow');
            $table->string('item_selection_color', 20)->default('Green');
            $table->boolean('screensaver')->default(true);
            $table->boolean('bg_image')->default(true);
            $table->boolean('screensaver_text_overlay')->default(true);
            $table->string('floating_text_position', 20)->default('Bottom');
            $table->string('floating_text_color', 20)->default('White');
            $table->string('text_floating_pattern')->default('Fixed');
            $table->boolean('screen_border_outline')->default(true);
            $table->boolean('border_status')->default(true);
            $table->string('border_color', 20)->default('Yellow');
            $table->string('border_line_weight', 30)->default('1/4');
            $table->string('text_outline_color', 30)->default('Yellow');
            $table->longText('product_style')->nullable();
            $table->longText('screen_saver')->nullable();
            $table->longText('outline_style')->nullable();
            $table->longText('QR_code_setup')->nullable();
            $table->boolean('media_ad_playback_format')->default(false);
            $table->string('media_ad_placement', 20)->default('top');
            $table->integer('media_display_timing')->default(10);
            $table->integer('screen_size')->default(22);
            $table->string('media_ad_display_size', 20)->default('1/3');
            $table->integer('items_per_line')->default(2);
            $table->string('scroll_direction', 10)->default('up');
            $table->string('banner_logo_content');
            $table->string('screen_saver_content');
            $table->string('landing_page_content');
            $table->string('thanks_screen_email');
            $table->string('thanks_screen_phone');
            $table->string('status_screen_text_color');
            $table->string('status_screen_time');
            $table->string('bottom_banner_cc_text');
            $table->string('bottom_banner_web_text');
            $table->boolean('bottom_banner_same_for_all')->default(false);
            $table->string('age_verification_title');
            $table->string('age_verification_line1');
            $table->string('sorry_out_of_stock_screen');
            $table->integer('freq_data_retrieval')->default(60);
            $table->boolean('on_screen_survey')->default(false);
            $table->boolean('feedback_btn')->default(false);
            $table->boolean('shopping_cart_btn')->default(false);
            $table->boolean('virtual_keypad_btn')->default(false);
            $table->boolean('cnc_btn')->default(false);
            $table->boolean('free_gift_btn')->default(false);
            $table->boolean('play_to_win_btn')->default(false);
            $table->boolean('special_access_btn')->default(false);
            $table->boolean('volume_btn')->default(false);
            $table->boolean('start_btn')->default(false);
            $table->boolean('main_menu_btn')->default(false);
            $table->boolean('product_detail_page')->default(false);
            $table->boolean('did_it_vend_page')->default(false);
            $table->boolean('qr_and_web_link')->default(false);
            $table->boolean('keep_add_in_foreground')->default(false);
            $table->boolean('view_logs')->default(false);
            $table->boolean('screen_switching')->default(false);
            $table->boolean('menu_scrolling')->default(false);
            $table->boolean('user_touch_while_scrolling')->default(false);
            $table->boolean('user_touch_while_switch_screens')->default(false);
            $table->boolean('user_touch_while_selection')->default(false);
            $table->boolean('vend_status')->default(false);
            $table->boolean('serial_port_activity')->default(false);
            $table->boolean('api_activity_sent')->default(false);
            $table->boolean('api_activity_received')->default(false);
            $table->boolean('black_screen_prevention')->default(false);
            $table->boolean('upload_logs')->default(false);
            $table->string('visualvend_version', 20);
            $table->string('android_os_version', 20);
            $table->string('asset_id', 20);
            $table->string('machine_location');
            $table->string('machine_firmware_version', 20);
            $table->string('card_reader_id', 20);
            $table->string('remote_id', 20);
            $table->integer('actual_stock_level_quantity')->default(0);
            $table->integer('max_stock_level_quantity')->default(0);
            $table->longText('refill_all_option');
            $table->longText('part_fill_option');
            $table->boolean('refill_all_button')->default(true);
            $table->boolean('has_extra_lockerbox')->default(false);
            $table->integer('lockerbox_lamp_start_row')->default(1);
            $table->boolean('lockerbox_lamp_end_row')->default(true);
            $table->boolean('lockerbox_support_return')->default(true);
            $table->boolean('lockerbox_support_return_same_locker')->default(true);
            $table->boolean('lockerbox_service_support_question')->default(true);
            $table->string('lockerbox_service_email')->default('');
            $table->boolean('has_extra_cabinets')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('machine_initial_setup');
    }
};
