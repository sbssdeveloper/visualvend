import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ValidatonErroMsg } from '../../../../../Widgets/native/ValidationErrors'
import { checkRequiredFields, handleValues } from '../../../../../Widgets/native/commonNativeFunctions'
import CustTextInput from '../../../../../Widgets/native/customTextInput'
import CustomButton from '../../../../../Widgets/native/customButton'
import appStyles from '../../../../../Assets/native/appStyles'
import MachineModal from '../machine-modals/machineModal'
import { isObjectkeysExists, machineModalInitialState, selectArrayForModal, selectionData } from '../../../constants'
import { colors } from '../../../../../Assets/native/colors'
import { CalenderIcon, DownArrowBlack } from '../../../../../Assets/native/images'
import { productStyles } from '../../../../Products/native/productstyle'
import Headings from '../../../../Products/native/Headings'
import { TouchableOpacity } from 'react-native'
import RowLayout from '../../../../Products/native/RowLayout'
import { getDimensions } from '../../../../../Helpers/native/constants'

const InputSettings = ({ formikInstace, dataReset, loader, setLoader, machineInformation }) => {
 const [modalStates, setModalStates] = useState(machineModalInitialState);
 const { handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm, setValues, handleSubmit: formikSubmit, isValid } = formikInstace;
 const { height } = getDimensions();

 const manageModalStates = (selectedArray, formKey) => setModalStates(prev => ({ ...prev, isOpen: true, selectedArray, formKey }));
 const selectArray = selectArrayForModal(modalStates?.selectedArray);

 const handler = (selectedValue = {}) => {
  const { item, index } = selectedValue;
  setModalStates(prev => ({ ...prev, selectedValue: item, isOpen: false }));
  modalStates?.formKey && setFieldValue(modalStates?.formKey, { values: item, index })
 }


 // useEffect(() => {
 //  if (selectionData && machineInformation) {
 //   const keypad = selectionData?.screensaverOptions?.[machineInformation?.keypad] || null;
 //   const onlineSurveyForm = selectionData?.screensaverOptions?.[machineInformation?.online_survey_form] || null;
 //   const click_n_collect_btn = selectionData?.screensaverOptions?.[machineInformation?.click_n_collect_btn] || null;
 //   const free_gift_btn = selectionData?.screensaverOptions?.[machineInformation?.free_gift_btn] || null;
 //   const machineInfoButtonEnabled = selectionData?.screensaverOptions?.[machineInformation?.machine_info_button_enabled] || null;
 //   const machineVolumeControlEnabled = selectionData?.screensaverOptions?.[machineInformation?.machine_volume_control_enabled] || null;
 //   const machineWheelChairEnabled = selectionData?.screensaverOptions?.[machineInformation?.machine_wheel_chair_enabled] || null;

 //   setFieldValue("keypad", { values: keypad || selectionData?.screensaverOptions[0], index: keypad ? machineInformation?.keypad : 0 });
 //   setFieldValue("online_survey_form", { values: onlineSurveyForm || selectionData?.screensaverOptions[0], index: onlineSurveyForm ? machineInformation?.online_survey_form : 0 });
 //   setFieldValue("click_n_collect_btn", { values: click_n_collect_btn || selectionData?.screensaverOptions[0], index: click_n_collect_btn ? machineInformation?.click_n_collect_btn : 0 });
 //   setFieldValue("free_gift_btn", { values: free_gift_btn || selectionData?.screensaverOptions[0], index: free_gift_btn ? machineInformation?.free_gift_btn : 0 });
 //   setFieldValue("machine_info_button_enabled", { values: machineInfoButtonEnabled || selectionData?.screensaverOptions[0], index: machineInfoButtonEnabled ? machineInformation?.machine_info_button_enabled : 0 });
 //   setFieldValue("machine_volume_control_enabled", { values: machineVolumeControlEnabled || selectionData?.screensaverOptions[0], index: machineVolumeControlEnabled ? machineInformation?.machine_volume_control_enabled : 0 });
 //   setFieldValue("machine_wheel_chair_enabled", { values: machineWheelChairEnabled || selectionData?.screensaverOptions[0], index: machineWheelChairEnabled ? machineInformation?.machine_wheel_chair_enabled : 0 });

 //  }
 // }, [machineInformation]);

 const { isAllFieldValid } = isObjectkeysExists(values) || {}

 return (
  <>
   <ScrollView>
    <View style={[{ flex: 1, backgroundColor: colors.appBackground, height: height + 50 }]}>
     <View style={[productStyles.container, productStyles.gap_5,]}>

      <Headings heading={"Keypad"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaverOptions", "keypad")}>
       <RowLayout text={values?.keypad.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>

      <Headings heading={"Online Survey Form"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaverOptions", "online_survey_form")}>
       <RowLayout text={values?.online_survey_form?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>


      <Headings heading={"Click n Collect Button"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaverOptions", "click_n_collect_btn")}>
       <RowLayout text={values?.click_n_collect_btn?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>

      <Headings heading={"Free Gift Button"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaverOptions", "free_gift_btn")}>
       <RowLayout text={values?.free_gift_btn?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>

      <Headings heading={"Info Button"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaverOptions", "machine_info_button_enabled")}>
       <RowLayout text={values?.machine_info_button_enabled?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>

      <Headings heading={"Volume Control"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaverOptions", "machine_volume_control_enabled")}>
       <RowLayout text={values?.machine_volume_control_enabled?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>

      <Headings heading={"Wheel Chair Button"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaverOptions", "machine_wheel_chair_enabled")}>
       <RowLayout text={values?.machine_wheel_chair_enabled?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>

      {/* <Headings heading={"Play to Win Button"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaverOptions")}>
       <RowLayout text={values?.product_batch_expiry_date} Icon={<DownArrowBlack />} />
      </TouchableOpacity> */}

     </View>
     <View style={[appStyles.rowSpaceBetweenAlignCenter, { marginVertical: 20, gap: 10 }]}>
      <View style={{ flex: 0.5 }}>
       <CustomButton
        text={"Cancel"}
        onPress={() => dataReset()}
        style={[loader ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan, { backgroundColor: "white" }]}
        disabled={loader}
        isPending={false}
        textClr={colors.appLightGrey}
       />
      </View>

      <View style={{ flex: 0.5 }}>
       <CustomButton
        text={"Save"}
        onPress={() => formikSubmit()}
        style={[loader || !isValid ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan]}
        disabled={loader || !isValid}
        isPending={loader}
       />
      </View>
     </View>
    </View>
   </ScrollView>

   <MachineModal
    modalStates={modalStates}
    setModalStates={setModalStates}
    array={selectArray}
    selectedValue={modalStates?.selectedValue}
    handler={handler}
   />
  </>
 )
}

export default InputSettings
