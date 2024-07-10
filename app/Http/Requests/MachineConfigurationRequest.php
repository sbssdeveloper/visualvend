<?php

namespace App\Http\Requests;

class MachineConfigurationRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(){
        return [
            "machine_id"                            => "required|exists:machine,id",
            "machine_mode"                          => "required",
            "serial_port_number"                    => "required",
            "serial_port_speed"                     => "required|integer",
            "screen_size"                           => "required",
            "screen_orientation"                    => "required",
            "machine_passcode_screen"               => "required",
            "advertisement_type"                    => "required",
            "machine_advertisement_mode"            => "required",
            "machine_is_game_enabled"               => "required",
            "machine_game"                          => "required",
            "machine_info_button_enabled"           => "required",
            "machine_screensaver_enabled"           => "required",
            "machine_volume_control_enabled"        => "required",
            "machine_is_asset_tracking"             => "required",
            "machine_is_advertisement_reporting"    => "required",
            "machine_wheel_chair_enabled"           => "required",
            "machine_is_feed_enabled"               => "required",
            "machine_helpline"                      => "required",
            "machine_helpline_enabled"              => "required",
            "receipt_enabled"                       => "required",
            "machine_customer_care_number"          => "required",
            "machine_is_job_number_enabled"         => "required",
            "machine_is_cost_center_enabled"        => "required",
            "machine_is_gift_enabled"               => "required",
            "newsletter_enabled"                    => "required",
            "machine_is_single_category"            => "required",
            "screensaver_text"                      => "required",
            "screensaver_text_position"             => "required",
            "screensaver_text_color"                => "required",
            "screensaver_text_outline"              => "required",
            "keypad"                                => "required",
            "online_survey_form"                    => "required",
            "click_n_collect_btn"                   => "required",
            "free_gift_btn"                         => "required",
            "machine_helpline2"                     => "required",
            "thanks_screen_text"                    => "required",
            "machine_customer_care_email"           => "required",
            "vend_screen_text_line1"                => "required",
            "vend_screen_text_line2"                => "required",
            "vend_screen_text_line3"                => "required",
            "screensaver_text_outline_style"        => "required",
            "serial_board_type"                     => "required",
            "serial_baud_rate"                      => "required|integer",
            "banner_text"                           => "required"
        ];
    }

    public function messages(){
        return [];
    }
}
