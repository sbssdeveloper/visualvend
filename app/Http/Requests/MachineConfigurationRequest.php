<?php

namespace App\Http\Requests;

class MachineConfigurationRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "machine_id"                            => "required|exists:machine,id",
            "machine_mode"                          => "required",
            "serial_port_number"                    => "required",
            "serial_port_speed"                     => "required|integer|min:1|max:1000",
            "screen_size"                           => "required",
            "screen_orientation"                    => "required",
            "machine_passcode_screen"               => "required",
            "advertisement_type"                    => "required",
            "machine_advertisement_mode"            => "required",
            "machine_is_game_enabled"               => "required",
            "machine_game"                          => "required",
            "machine_info_button_enabled"           => "required|integer|in:0,1",
            "machine_screensaver_enabled"           => "required|integer|in:0,1",
            "machine_volume_control_enabled"        => "required|integer|in:0,1",
            "machine_is_asset_tracking"             => "required|integer|in:0,1",
            "machine_is_advertisement_reporting"    => "required|integer|in:0,1",
            "machine_wheel_chair_enabled"           => "required|integer|in:0,1",
            "machine_is_feed_enabled"               => "required|integer|in:0,1",
            "machine_helpline"                      => "required",
            "machine_helpline_enabled"              => "required|integer|in:0,1",
            "receipt_enabled"                       => "required|integer|in:0,1",
            "machine_customer_care_number"          => "required",
            "machine_is_job_number_enabled"         => "required|integer|in:0,1",
            "machine_is_cost_center_enabled"        => "required|integer|in:0,1",
            "machine_is_gift_enabled"               => "required|integer|in:0,1",
            "newsletter_enabled"                    => "required|integer|in:0,1",
            "machine_is_single_category"            => "required|integer|in:0,1",
            "screensaver_text"                      => "required",
            "screensaver_text_position"             => "required",
            "screensaver_text_color"                => "required",
            "screensaver_text_outline"              => "required",
            "keypad"                                => "required|integer|in:0,1",
            "online_survey_form"                    => "required|integer|in:0,1",
            "click_n_collect_btn"                   => "required|integer|in:0,1",
            "free_gift_btn"                         => "required|integer|in:0,1",
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

    public function messages()
    {
        return [];
    }
}
