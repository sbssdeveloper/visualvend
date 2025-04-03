import { View, SafeAreaView, } from 'react-native'
import React, { useEffect } from 'react'
import NavigationHeader from '../../../../Widgets/native/navigationHeader'
import CurrentMachineHeader from '../../../../Widgets/native/currentMachineHeader'
import { useFormik } from 'formik'
import { machineConfigureStates, machineConfigureValidationScheme, modifyFiledValues, selectionData, } from '../../constants'
import { colors } from '../../../../Assets/native/colors'
import { machineConfigNavigationKeys, } from '../../../../Helpers/native/constants'

import appStyles, { fonts } from '../../../../Assets/native/appStyles'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MachineSetting from './machine-settings/machineSetting'
import MediaSettings from './media-add-settings/mediaSetting'
import DisplaySetting from './display-settings/displaySetting'
import ContentManagementSettings from './content-managment-settings/contentManagmentSetting'
import VendCommunicationSetting from './vend-communication-settings/vendCommunicationSetting'
import NotificationSetting from './notifications-settings/notificationSettings'
import MachineLogo from './machine-logo/machineLogo'
import InputSettings from './input-settings/InputSettings'
import { showToaster } from '../../../../Widgets/native/commonFunction'
import useMutationData from '../../../../Hooks/useCommonMutate'
import { machineConfiguration, machineInfo } from '../../actions'
import useFetchData from '../../../../Hooks/fetchCustomData/useFetchData'
import { useNavigation } from '@react-navigation/native'

const TopTab = createMaterialTopTabNavigator();


const MachineConfigure = ({ route: { params } = {} }) => {
  const navigation = useNavigation();


  const dataReset = () => {
    formikInstace?.resetForm();
    navigation?.goBack()
  }

  const handleSuccess = (data) => {
    setLoader(false);
    const { success, message, status } = data?.data || {};
    if (success) {
      dataReset();
      showToaster("success", message);
    }
  }

  const configErrorHandler = () => {
    showToaster("error", "Some field are missing or repeated ...Please try again");
    //  dataReset();
  }
  const { data: { data: machineInformation } = {} } = useFetchData({ key: "GETMACHINEINFO", fn: machineInfo, machine_id: params?.id, });
  const machineConfigurationMution = useMutationData(machineConfiguration, (data) => handleSuccess(data), (error) => configErrorHandler(error));


  const formikInstace = useFormik({
    initialValues: machineConfigureStates,
    validationSchema: machineConfigureValidationScheme,
    onSubmit: values => {
      let extraData = {
        machine_is_gift_enabled: 1,
        machine_is_asset_tracking: 1,
        receipt_enabled: 1,
        newsletter_enabled: 1,
        machine_id: params?.id || 0
      }
      if (transformedData?.machine_mode == 2) {
        extraData.receipt_enabled = 1;
        extraData.newsletter_enabled = 1;
        extraData.machine_is_gift_enabled = 1;
      } else {
        extraData.machine_is_gift_enabled = 0;
      }
      if (transformedData?.machine_mode == 1) {
        extraData.machine_is_asset_tracking = 1;
      } else {
        extraData.machine_is_asset_tracking = 0;
      }
      if (transformedData?.machine_mode == 0) {
        extraData.machine_is_asset_tracking = 0;
        extraData.machine_is_gift_enabled = 0;
      }

      const transformedData = Object?.fromEntries(Object?.entries(values)?.map(([key, value]) => value?.index !== undefined ? [key, value.index] : [key, value]));

      //  console.log({...extraData, ...transformedData, machine_id: params?.id});
      //  return


      machineConfigurationMution.mutate({ ...extraData, ...transformedData, machine_id: params?.id, })
    }
  })

  const loader = false;

  const setLoader = param => null;


  // console.log(formikInstace?.errors,"=========ss92")

  return (
    <>

      <SafeAreaView>
        <NavigationHeader />
        <CurrentMachineHeader text={"Machines"} />

        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground, }]}>
          <TopTab.Navigator
            initialRouteName='machineStack'
            screenOptions={{
              tabBarLabelStyle: [{ fontSize: 11, textTransform: 'none', color: "#222222", width: 200 }, fonts.semiBold],
              tabBarItemStyle: { width: 120, paddingHorizontal: 5, },
              tabBarActiveTintColor: colors.appBackground,
              tabBarInactiveTintColor: colors.appBackground,
              tabBarIndicatorStyle: { backgroundColor: colors.cyan },
              tabBarStyle: { backgroundColor: colors.appBackground, elevation: 0, marginBottom: 20 },
              tabBarScrollEnabled: true
            }}
          >
            <TopTab.Screen name={machineConfigNavigationKeys?.machineSettings}>
              {() => <MachineSetting formikInstace={formikInstace}
                dataReset={dataReset} loader={loader}
              // machineInformation={machineInformation?.data}
              />}
            </TopTab.Screen>

            <TopTab.Screen name={machineConfigNavigationKeys?.mediaSetting}>
              {() => <MediaSettings formikInstace={formikInstace}
                dataReset={dataReset} loader={loader}
              // machineInformation={machineInformation?.data}
              />}
            </TopTab.Screen>

            <TopTab.Screen name={machineConfigNavigationKeys?.displaySetting}>
              {() => <DisplaySetting formikInstace={formikInstace}
                loader={loader}
                dataReset={dataReset}
              // machineInformation={machineInformation?.data}

              />}
            </TopTab.Screen>
            <TopTab.Screen name={machineConfigNavigationKeys?.contentManagement} >
              {() => <ContentManagementSettings dataReset={dataReset} loader={loader} formikInstace={formikInstace}

              // machineInformation={machineInformation?.data}
              />}
            </TopTab.Screen>

            <TopTab.Screen name={machineConfigNavigationKeys.vendCommunicationSetting}>
              {() => <VendCommunicationSetting formikInstace={formikInstace} dataReset={dataReset}
                loader={loader} setLoader={setLoader}

              // machineInformation={machineInformation?.data}
              />}
            </TopTab.Screen>

            <TopTab.Screen name={machineConfigNavigationKeys.notificationSetting}>
              {() => <NotificationSetting formikInstace={formikInstace} dataReset={dataReset}
                loader={loader} setLoader={setLoader}

              // machineInformation={machineInformation?.data}
              />}
            </TopTab.Screen>

            <TopTab.Screen name={machineConfigNavigationKeys.mahcineLogo}>
              {() => <MachineLogo formikInstace={formikInstace} dataReset={dataReset}
                loader={loader} setLoader={setLoader}

              // machineInformation={machineInformation?.data}
              />}
            </TopTab.Screen>

            <TopTab.Screen name={machineConfigNavigationKeys.inputSettings}>
              {() => <InputSettings formikInstace={formikInstace} dataReset={dataReset}
                loader={loader} setLoader={setLoader}
              // machineInformation={machineInformation?.data}
              />}
            </TopTab.Screen>
          </TopTab.Navigator>
        </View>
      </SafeAreaView>
      <MachineConfigurationInformation machineInformation={machineInformation?.data}
        setValues={formikInstace?.setValues}
        setFieldValue={formikInstace?.setFieldValue} />
    </>
  )
}

export default MachineConfigure;





const MachineConfigurationInformation = ({ machineInformation, setFieldValue, setValues }) => {


  useEffect(() => {

    const machineScreensaverEnabled = selectionData?.screensaverOptions?.[machineInformation?.machine_screensaver_enabled] || null
    //   setFieldValue("screen_size", modifyFiledValues(selectionData?.screenSizeOptions, machineInformation?.screen_size));
    //   setFieldValue("screen_orientation", screenOrientation);
    //   setFieldValue("machine_screensaver_enabled", { values: machineScreensaverEnabled || selectionData?.screensaverOptions[0], index: machineScreensaverEnabled ? machineInformation?.machine_screensaver_enabled : 0 });
    //   setFieldValue("screensaver_text", modifyFiledValues(selectionData?.screensaver_text_Options, machineInformation?.screensaver_text));
    //   setFieldValue("screensaver_text_position", modifyFiledValues(selectionData?.screensaver_text_position_Options, machineInformation?.screensaver_text_position));
    //   setFieldValue("screensaver_text_color", modifyFiledValues(selectionData?.screensaver_text_color_Options, machineInformation?.screensaver_text_color));
    //   setFieldValue("screensaver_text_outline_style", modifyFiledValues(selectionData?.screensaver_text_outline_style_Options, machineInformation?.screensaver_text_outline_style));
    //   setFieldValue("screensaver_text_outline", modifyFiledValues(selectionData?.screensaver_text_color_Options, machineInformation?.screensaver_text_outline));
    // { values: advertisementType || selectionData?.advertisementTypeOptions[0], index: advertisementType ? machineInformation?.advertisement_type : 0 }
    if (machineInformation) {
      const advertisementType = selectionData?.advertisementTypeOptions?.[machineInformation?.advertisement_type] || null;
      const machineAdverMode = selectionData?.advertisementModeOptions?.[machineInformation?.machine_advertisement_mode] || null;
      const machineAdverReporting = selectionData?.screensaverOptions?.[machineInformation?.machine_is_advertisement_reporting] || null;
      const screenOrientation = machineInformation?.screen_orientation === "Portrait" ? { values: "Portrait", index: "Portrait" } : { values: "Landscape", index: "Landscape" };
      const screenSize = modifyFiledValues(selectionData?.screenSizeOptions, machineInformation?.screen_size)
      const machineScreensaverEnabled = selectionData?.screensaverOptions?.[machineInformation?.machine_screensaver_enabled] || null;
      const screensaverText = modifyFiledValues(selectionData?.screensaver_text_Options, machineInformation?.screensaver_text)
      const screensaverTextPosition = modifyFiledValues(selectionData?.screensaver_text_position_Options, machineInformation?.screensaver_text_position)
      const screensaverTextColor = modifyFiledValues(selectionData?.screensaver_text_color_Options, machineInformation?.screensaver_text_color)
      const screensaverTextOutlineStyle = modifyFiledValues(selectionData?.screensaver_text_outline_style_Options, machineInformation?.screensaver_text_outline_style)
      const screensaverTextOutline = modifyFiledValues(selectionData?.screensaver_text_color_Options, machineInformation?.screensaver_text_outline)
      const bannerText = machineInformation?.banner_text || null;
      const helpEnabled = selectionData?.screensaverOptions?.[machineInformation?.machine_helpline_enabled] || null;
      const machineHelpline = machineInformation?.machine_helpline || null;
      const machineHelpline2 = machineInformation?.machine_helpline2 || null;
      const thanksScreenText = machineInformation?.thanks_screen_text || null;
      const machineCustomerCareNumber = machineInformation?.machine_customer_care_number || null;
      const machineCustomerCareEmail = machineInformation?.machine_customer_care_email || null;
      const vendScreenTextLine1 = machineInformation?.vend_screen_text_line1 || null;
      const vendScreenTextLine2 = machineInformation?.vend_screen_text_line2 || null;
      const vendScreenTextLine3 = machineInformation?.vend_screen_text_linmachineInformation
      const serialBaesedType = selectionData?.serial_board_type_options?.[machineInformation?.serial_board_type] || null;
      const serialBaesedRate = machineInformation?.serial_baud_rate ? machineInformation?.serial_baud_rate?.toString() : null;
      const serialPortNumber = selectionData?.serial_port_number_options?.[machineInformation?.serial_port_number] || null;
      const serialPortSpeed = machineInformation?.serial_port_speed ? machineInformation?.serial_port_speed.toString() : null;
      const machineisFeedEnabled = selectionData?.screensaverOptions?.[machineInformation?.machine_is_feed_enabled] || null;
      const newsletterEnabled = selectionData?.screensaverOptions?.[machineInformation?.newsletter_enabled] || null;
      const keypad = selectionData?.screensaverOptions?.[machineInformation?.keypad] || null;
      const onlineSurveyForm = selectionData?.screensaverOptions?.[machineInformation?.online_survey_form] || null;
      const click_n_collect_btn = selectionData?.screensaverOptions?.[machineInformation?.click_n_collect_btn] || null;
      const free_gift_btn = selectionData?.screensaverOptions?.[machineInformation?.free_gift_btn] || null;
      const machineInfoButtonEnabled = selectionData?.screensaverOptions?.[machineInformation?.machine_info_button_enabled] || null;
      const machineVolumeControlEnabled = selectionData?.screensaverOptions?.[machineInformation?.machine_volume_control_enabled] || null;
      const machineWheelChairEnabled = selectionData?.screensaverOptions?.[machineInformation?.machine_wheel_chair_enabled] || null;
      const modeValue = selectionData?.machine_mode_Options?.[machineInformation?.machine_mode] || null;
      const selectedCategory = selectionData?.machineCategoryTypeOptions?.[machineInformation?.machine_is_single_category] || null;


      const updatedValues = {
        machine_mode: { values: modeValue || selectionData?.machine_mode_Options?.[0], index: modeValue ? machineInformation?.machine_mode : 0 },
        machine_is_single_category: { values: selectedCategory || selectionData?.machineCategoryTypeOptions[0], index: selectedCategory ? machineInformation?.machine_is_single_category : 0 },
        keypad: { values: keypad, index: machineInformation?.keypad },
        online_survey_form: { values: onlineSurveyForm, index: machineInformation?.online_survey_form },
        click_n_collect_btn: { values: click_n_collect_btn, index: machineInformation?.click_n_collect_btn },
        free_gift_btn: { values: free_gift_btn, index: machineInformation?.free_gift_btn },
        machine_info_button_enabled: { values: machineInfoButtonEnabled, index: machineInformation?.machine_info_button_enabled },
        machine_volume_control_enabled: { values: machineVolumeControlEnabled, index: machineInformation?.machine_volume_control_enabled },
        machine_wheel_chair_enabled: { values: machineWheelChairEnabled, index: machineInformation?.machine_wheel_chair_enabled },
        machine_is_feed_enabled: { values: machineisFeedEnabled, index: machineInformation?.machine_is_feed_enabled },
        newsletter_enabled: { values: newsletterEnabled, index: machineInformation?.newsletter_enabled },
        serial_board_type: { values: serialBaesedType, index: machineInformation?.serial_board_type },
        serial_baud_rate: serialBaesedRate,
        serial_port_number: { values: serialPortNumber, index: machineInformation?.serial_port_number },
        serial_port_speed: serialPortSpeed,
        banner_text: bannerText,
        machine_helpline_enabled: { values: helpEnabled, index: machineInformation?.machine_helpline_enabled },
        machine_helpline: machineHelpline,
        machine_helpline2: machineHelpline2,
        thanks_screen_text: thanksScreenText,
        machine_customer_care_number: machineCustomerCareNumber,
        machine_customer_care_email: machineCustomerCareEmail,
        vend_screen_text_line1: vendScreenTextLine1,
        vend_screen_text_line2: vendScreenTextLine2,
        vend_screen_text_line3: vendScreenTextLine3,
        screen_size: screenSize,
        screen_orientation: screenOrientation,
        machine_screensaver_enabled: { values: machineScreensaverEnabled, index: machineInformation?.screensaverOptions },
        screensaver_text: screensaverText,
        screensaver_text_position: screensaverTextPosition,
        screensaver_text_color: screensaverTextColor,
        screensaver_text_outline_style: screensaverTextOutlineStyle,
        screensaver_text_outline: screensaverTextOutline,
        advertisement_type: { values: advertisementType, index: machineInformation?.advertisement_type },
        machine_advertisement_mode: { values: machineAdverMode, index: machineInformation?.advertisement_type },
        machine_is_advertisement_reporting: { values: machineAdverReporting, index: machineInformation?.machine_is_advertisement_reporting },
      };



      setValues(updatedValues);


    }
  }, [machineInformation]);
}


