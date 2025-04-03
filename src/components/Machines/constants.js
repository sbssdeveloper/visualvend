import { colors } from "../../Assets/native/colors";
import * as Yup from 'yup';
import { machineConfigNavigationKeys, machineNavigationKeys } from "../../Helpers/native/constants";

export const MACHINES_SORT_OPTIONS = [
    { value: 'created_at-ASC', name: 'By Creation Date' },
    { value: 'activated_at-ASC', name: 'By Activation Date' },
    { value: 'machine_name-ASC', name: 'By Alphabetical Order' },
    { value: 'viewed_at-DESC', name: 'Recently Viewed' },
    { value: 'created_at-DESC', name: 'Recently Added' },
    { value: 'machine_is_single_category-ASC', name: 'Machine Type' },
    { value: 'location-ASC', name: 'By Location' },
    { value: 'viewed_at-ASC', name: 'Last Connected' }
]


export const MACHINE_CATEGORY_TYPE = [
    { id: 0, name: "Single Category" },
    { id: 1, name: "Multiple Category" },
]

export const ALL_CLIENT_CONST = {
    id: "All client",
    machine_name: "All clients",
};

export const MACHIES_DEFAULT_VALUES = {
    machine_client_id: {
        label: 'Select Client',
        value: ''
    },

    machine_is_single_category: 0,
    machine_name: "",
    machine_row: "",
    machine_column: "",
    machine_address: "",
    machine_latitude: "",
    machine_longitude: "",
    machine_username: ""
}

export const PLANOGRAM_UPDATE_DEFAULT_VALUES = {
    machine_name: "",
    product_location: "",
    product: "",
    product_quantity: "",
    product_max_quantity:""
}

const { machine_row, machine_column, machine_is_single_category, machine_client_id, ...rest } = MACHIES_DEFAULT_VALUES

export const CLONE_MACHINE_DEFAULT_VALUES = {
    ...rest,
    need_clone_planogram: 0,
    need_clone_people: 0,
    need_clone_media_ad: 0,
    need_clone_config_setting: 0,
    machine_username: "",
    client_id: 0
}

export const screens = [
    { text: "View ||", id: 1, screen:machineNavigationKeys?.planogramlist, keyName: "Planogram" },
    { text: "Upload ||", id: 2, screen: machineNavigationKeys?.uploadplanogram, keyName: "Upload Planogram" },
    { text: "Export Planogram", id: 3, screen: true, keyName: "Export Planogram" },
    { text: "Reset Planogram", id: 4, screen: machineNavigationKeys?.resetplanogram, keyName: "Reset Planogram" },
    { text: "Configure ||", id: 5, keyName: "Configure", screen: machineConfigNavigationKeys?.machineStack },
    { text: "Clone", id: 6, screen: machineNavigationKeys?.clonemachine, keyName: "Clone Machine" },
    { text: "Initial Setup", id: 7, keyName: "Initial Setup",screen:false }
];


export const planogramListArray = [
    { id: 1, key: "name", label: "Name" },
    { id: 3, key: "name", label: "Machine Name" },
    { id: 2, key: "product_name", label: "Mode" },
    { id: 4, key: "age_verify", label: "Age Verify" },
    { id: 5, key: "duration", label: "Duration", additionalColor: true },
    { id: 6, key: "payment_status", label: "Ltd Stock" },
    { id: 7, key: "start_date", label: "Start Date/Time", additionalColor: true },
    { id: 8, key: "end_date", label: "End Date/Time", additionalColor: true },
    { id: 9, key: "date", label: "Date" },
    { id: 10, key: "status", label: "Status", additionalColor: true },
];


export const columnWidhth = Array?.from({ length: 19 }, () => ({ width: 10 }));

export const machineModalInitialState = {
    isOpen: false,
    modalHeading: "Machine Settings",
    selectedValue: "",
    selectedArray: "",
    formKey: ""
}

export const machineConfigureStates = {
    // machine_id: 1,
    // logo: "",
    machine_mode: 1,
    serial_port_number: "",
    serial_port_speed: 1,
    screen_size: 1,
    screen_orientation: "",
    // machine_passcode_screen: 1,
    advertisement_type: 1,
    machine_advertisement_mode: 1,
    // machine_is_game_enabled: 1,
    // machine_game: 1,
    machine_info_button_enabled: 1,
    machine_screensaver_enabled: 1,
    machine_volume_control_enabled: 1,
    // machine_is_asset_tracking: 1,
    machine_is_advertisement_reporting: 1,
    machine_wheel_chair_enabled: 1,
    machine_is_feed_enabled: 1,
    machine_helpline: "",
    machine_helpline_enabled: 1,
    // receipt_enabled: 1,
    machine_customer_care_number: "",
    // machine_is_job_number_enabled: 1,
    // machine_is_cost_center_enabled: 1,
    // machine_is_gift_enabled: 1,
    newsletter_enabled: 1,
    machine_is_single_category: 1,
    // machine_live_mode: 1,
    // machine_type: 1,
    // locker_box_board: "",
    // machine_controller: "",
    // screen_position: "",
    // nuber_screen: 1,
    // category_menu_support: 1,
    // product_menu_layout: "",
    // display2_screen_size: 1,
    // display2_screen_orientation: "",
    // display2_screen_position: "",
    // product_menu_formatting: 1,
    // product_menu_color: "",
    // product_menu_bg_color: "",
    // vend_comms_port: "",
    // vend_comms_baud_rate: 1,
    // shopping_cart_support: 1,
    // cnc_support: 1,
    screensaver_text: "",
    screensaver_text_position: "",
    screensaver_text_color: "",
    screensaver_text_outline: "",
    keypad: 1,
    online_survey_form: 1,
    click_n_collect_btn: 1,
    free_gift_btn: 1,
    machine_helpline2: "",
    thanks_screen_text: "",
    machine_customer_care_email: "",
    // vend_screen_text_line1: "",
    vend_screen_text_line2: "",
    vend_screen_text_line3: "",
    screensaver_text_outline_style: "",
    serial_board_type: "",
    serial_baud_rate: 1,
    banner_text: ""
}


export const machineConfigureValidationScheme = Yup.object().shape({
    // machine_id: Yup.mixed().required('Machine ID is required'),
    // logo: Yup.mixed().required('Logo is required'),
    machine_mode: Yup.mixed().required('Machine mode is required'),
    serial_port_number: Yup.mixed().required('Serial port number is required'),
    serial_port_speed: Yup.mixed().required('Serial port speed field is required'),
    screen_size: Yup.mixed().required('Screen size is required'),
    screen_orientation: Yup.mixed().required('Screen orientation is required'),
    // machine_passcode_screen: Yup.mixed().required('Machine passcode screen is required'),
    advertisement_type: Yup.mixed().required('Advertisement type is required'),
    machine_advertisement_mode: Yup.mixed().required('Machine advertisement mode is required'),
    // machine_is_game_enabled: Yup.mixed().required('Machine game enabled is required'),
    // machine_game: Yup.mixed().required('Machine game is required'),
    machine_info_button_enabled: Yup.mixed().required('Machine info button enabled is required'),
    machine_screensaver_enabled: Yup.mixed().required('Machine screensaver enabled is required'),
    machine_volume_control_enabled: Yup.mixed().required('Machine volume control enabled is required'),
    // machine_is_asset_tracking: Yup.mixed().required('Machine asset tracking is required'),
    machine_is_advertisement_reporting: Yup.mixed().required('Machine advertisement reporting is required'),
    machine_wheel_chair_enabled: Yup.mixed().required('Machine wheelchair enabled is required'),
    machine_is_feed_enabled: Yup.mixed().required('Machine feed enabled is required'),
    machine_helpline: Yup.string().required('Machine helpline is required'),
    machine_helpline_enabled: Yup.mixed().required('Machine helpline enabled is required'),
    // receipt_enabled: Yup.mixed().required('Receipt enabled is required'),
    machine_customer_care_number: Yup.mixed().required('Customer care number is required'),
    machine_customer_care_email: Yup.string().email('Invalid email format').required('Customer care email is required'),
    // machine_is_job_number_enabled: Yup.mixed().required('Job number enabled is required'),
    // machine_is_cost_center_enabled: Yup.mixed().required('Cost center enabled is required'),
    // machine_is_gift_enabled: Yup.mixed().required('Gift enabled is required'),
    newsletter_enabled: Yup.mixed().required('Newsletter enabled is required'),
    machine_is_single_category: Yup.mixed().required('Single category enabled is required'),
    // machine_live_mode: Yup.mixed().required('Machine live mode is required'),
    // machine_type: Yup.mixed().required('Machine type is required'),
    // locker_box_board: Yup.mixed().required('Locker box board is required'),
    // machine_controller: Yup.mixed().required('Machine controller is required'),
    // screen_position: Yup.mixed().required('Screen position is required'),
    // nuber_screen: Yup.mixed().required('Number screen is required'),
    // category_menu_support: Yup.mixed().required('Category menu support is required'),
    // product_menu_layout: Yup.mixed().required('Product menu layout is required'),
    // display2_screen_size: Yup.mixed().required('Display2 screen size is required'),
    // display2_screen_orientation: Yup.mixed().required('Display2 screen orientation is required'),
    // display2_screen_position: Yup.mixed().required('Display2 screen position is required'),
    // product_menu_formatting: Yup.mixed().required('Product menu formatting is required'),
    // product_menu_color: Yup.mixed().required('Product menu color is required'),
    // product_menu_bg_color: Yup.mixed().required('Product menu background color is required'),
    // vend_comms_port: Yup.mixed().required('Vend comms port is required'),
    // vend_comms_baud_rate: Yup.mixed().required('Vend comms baud rate is required'),
    // shopping_cart_support: Yup.mixed().required('Shopping cart support is required'),
    // cnc_support: Yup.mixed().required('CNC support is required'),
    screensaver_text: Yup.mixed().required('Screensaver text is required'),
    screensaver_text_position: Yup.mixed().required('Screensaver text position is required'),
    screensaver_text_color: Yup.mixed().required('Screensaver text color is required'),
    screensaver_text_outline: Yup.mixed().required('Screensaver text outline is required'),
    keypad: Yup.mixed().required('Keypad is required'),
    online_survey_form: Yup.mixed().required('Online survey form is required'),
    click_n_collect_btn: Yup.mixed().required('Click-n-collect button is required'),
    free_gift_btn: Yup.mixed().required('Free gift button is required'),
    machine_helpline2: Yup.string().required('Machine helpline 2 is required'),
    thanks_screen_text: Yup.string().required('Thanks screen text is required'),
    // vend_screen_text_line1: Yup.string().required('Vend screen text line 1 is required'),
    vend_screen_text_line2: Yup.string().required('Vend screen text line 2 is required'),
    vend_screen_text_line3: Yup.string().required('Vend screen text line 3 is required'),
    screensaver_text_outline_style: Yup.mixed().required('Screensaver text outline style is required'),
    serial_board_type: Yup.mixed().required('Serial board type is required'),
    serial_baud_rate: Yup.mixed().required('Serial baud rate is required'),
    banner_text: Yup.string().required('Banner text is required')
});




export const checkRequiredFields = (data) => {
    const requiredFields = [{ ...machineConfigureStates }];
    console.log(requiredFields, "=====>>REWUIRED")

    // for (const field of requiredFields) {
    //   if (!isFieldFilled(data[field])) {
    //     return { success: false, missingField: `${field} is missing` };
    //   }
    // }
    // return { success: true };
};




export const getColors = (key, innerKey) => {

    const colorObject = {
        status: {
            Backup: colors.cyan,
            Active: colors.mediummBlack,
            Inactive: colors.barRed
        },
        start_date: {
            Indefinite: colors.cyan,
        },
        end_date: {
            Indefinite: colors.cyan
        },
    };
    if (!colorObject[key]) {
        return colors.mediummBlack;
    }

    if (typeof innerKey === 'number') {
        colorObject[key][innerKey] = colors.mediummBlack;
    } else {
        colorObject[key][innerKey] = colors.cyan;
    } 
    // setFieldValue(modalStates?.formKey, { values: item, index })
    const color = colorObject[key][innerKey] || colors.mediummBlack;
    return color;
};

export const selectionData = {
    screensaverOptions: ["Enable", "Disable"],
    modeOptions: ["Single Banner Mode", "Dual Banner Mode", "Top Banner Ads Mode", "Full Screen Ads Mode", "Full Screen Slideshow Mode", "Keypad Vend Mode"],
    advertisementModeOptions: ["Fixed Media Ads", "Page Specific Media"],
    gameNameOptions: ["Memory Game", "Wheel Game"],
    advertisementTypeOptions: ["Video", "Image"],
    screenSizeOptions: ["7 inch", "10 inch", "22 inch", "32 inch", "50 inch"],
    screenOrientationOptions: ["Portrait", "Landscape"],
    machineCategoryTypeOptions: ["Single Category", "Multiple Categories"],
    keypad: "Enable",
    onlineSurveyForm: "Enable",
    clickNcollect: "Enable",
    freeGiftBtn: "Enable",
    screensaver_text_Options: ["Tap to Start", "Tap to Vend", "Out of Service", "Out of Stock", "Out of Order", "Custom Text"],
    screensaver_text_position: "Bottom",
    screensaver_text_position_Options: ["Bottom", "Top", "Center"],
    screensaver_text_color: "",
    screensaver_text_color_Options: ["Yellow", "Green", "Green Light", "Grey", "Orange", "Orange Accent", "Orange Deep", "Blue", "Cyan Accent", "Purple", "Black", "White", "Main Color", "Main Grey"],
    screensaver_text_outline: "",
    machine_mode: "",
    machine_mode_Options: ["Traditional Vend Mode", "Asset Tracking", "Gift Vending"],
    is_customized_screensaver: false,
    customized_screensaver: "",
    screensaver_text_outline_style: "",
    screensaver_text_outline_style_Options: ["Outline Only", "Filled Text", "No Outline"],
    serial_board_type: "",
    serial_board_type_options: ["Red", "Green"],
    serial_baud_rate: "",
    serial_port_number_options: ["/dev/ttyS0", "/dev/ttyS1", "/dev/ttyS2", "/dev/ttyS3", "/dev/ttyS4", "/dev/ttymcx0", "/dev/ttymcx1", "/dev/ttymcx2", "/dev/ttymcx3", "/dev/ttymcx4", "/dev/ttyUSB0", "/dev/ttyUSB1", "/dev/ttyUSB2", "/dev/ttyUSB3", "/dev/ttyUSB4"]
};

export const selectArrayForModal = (key) => selectionData[key];


export const isObjectkeysExists = objectData => {

    return { isAllFieldValid: Object?.keys(objectData)?.length > 0 ? true : false }
}

export const modifyFiledValues = (array = [], fieldValue = "") => {
    console.log(fieldValue,"====Filed", array?.indexOf(fieldValue))
    const index = array?.indexOf(fieldValue);
    return index !== -1 ? { index, values: array[index] } : { values: array[0], index: 0 }
};
