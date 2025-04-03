import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ValidatonErroMsg } from '../../../../../Widgets/native/ValidationErrors'
import { handleValues } from '../../../../../Widgets/native/commonNativeFunctions'
import CustTextInput from '../../../../../Widgets/native/customTextInput'
import CustomButton from '../../../../../Widgets/native/customButton'
import appStyles from '../../../../../Assets/native/appStyles'
import MachineModal from '../machine-modals/machineModal'
import { isObjectkeysExists, machineModalInitialState, modifyFiledValues, selectArrayForModal, selectionData } from '../../../constants'
import { colors } from '../../../../../Assets/native/colors'
import { CalenderIcon, DownArrowBlack } from '../../../../../Assets/native/images'
import { productStyles } from '../../../../Products/native/productstyle'
import Headings from '../../../../Products/native/Headings'
import { TouchableOpacity } from 'react-native'
import RowLayout from '../../../../Products/native/RowLayout'
import { getDimensions } from '../../../../../Helpers/native/constants'

const DisplaySetting = ({ formikInstace, dataReset, loader, machineInformation }) => {
 const [modalStates, setModalStates] = useState(machineModalInitialState);
 const { handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm, setValues, handleSubmit: formikSubmit, isValid } = formikInstace;
 const manageModalStates = (selectedArray, formKey) => setModalStates(prev => ({ ...prev, isOpen: true, selectedArray, formKey }));

 const { screenHeight } = getDimensions();
 const selectArray = selectArrayForModal(modalStates?.selectedArray);

 const handler = (selectedValue = {}) => {
  const { item, index } = selectedValue;
  setModalStates(prev => ({ ...prev, selectedValue: item, isOpen: false }));
  if (modalStates?.formKey === "screen_orientation") setFieldValue(modalStates?.formKey, { values: item, index: item })
  else setFieldValue(modalStates?.formKey, { values: item, index })
 }



 // useEffect(() => {
 //  if (selectionData && machineInformation) {

 //   const screenOrientation = machineInformation?.screen_orientation === "Portrait"
 //    ? { values: "Portrait", index: "Portrait" }
 //    : { values: "Landscape", index: "Landscape" };

 //   const machineScreensaverEnabled = selectionData?.screensaverOptions?.[machineInformation?.machine_screensaver_enabled] || null
 //   setFieldValue("screen_size", modifyFiledValues(selectionData?.screenSizeOptions, machineInformation?.screen_size));
 //   setFieldValue("screen_orientation", screenOrientation);
 //   setFieldValue("machine_screensaver_enabled", { values: machineScreensaverEnabled || selectionData?.screensaverOptions[0], index: machineScreensaverEnabled ? machineInformation?.machine_screensaver_enabled : 0 });
 //   setFieldValue("screensaver_text", modifyFiledValues(selectionData?.screensaver_text_Options, machineInformation?.screensaver_text));
 //   setFieldValue("screensaver_text_position", modifyFiledValues(selectionData?.screensaver_text_position_Options, machineInformation?.screensaver_text_position));
 //   setFieldValue("screensaver_text_color", modifyFiledValues(selectionData?.screensaver_text_color_Options, machineInformation?.screensaver_text_color));
 //   setFieldValue("screensaver_text_outline_style", modifyFiledValues(selectionData?.screensaver_text_outline_style_Options, machineInformation?.screensaver_text_outline_style));
 //   setFieldValue("screensaver_text_outline", modifyFiledValues(selectionData?.screensaver_text_color_Options, machineInformation?.screensaver_text_outline));
 //  }

 // }, [machineInformation]);

 return (
  <>
   <ScrollView>
    <View style={[{ flex: 1, backgroundColor: colors.appBackground, height: screenHeight },]}>
     <View style={[productStyles.container, productStyles.gap_5]}>

      <Headings heading={"Screen Size"} />
      <TouchableOpacity onPress={() => manageModalStates("screenSizeOptions", "screen_size")}>
       <RowLayout text={values?.screen_size?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>

      <Headings heading={"Screen Orientation"} />
      <TouchableOpacity onPress={() => manageModalStates("screenOrientationOptions", "screen_orientation")}>
       <RowLayout text={values?.screen_orientation?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>

      <Headings heading={"Screensaver"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaverOptions", "machine_screensaver_enabled")}>
       <RowLayout text={values?.machine_screensaver_enabled?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>

      <Headings heading={"Screensaver Text"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaver_text_Options", "screensaver_text")}>
       <RowLayout text={values?.screensaver_text?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>

      <Headings heading={"Screensaver Text Position"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaver_text_position_Options", "screensaver_text_position")}>
       <RowLayout text={values?.screensaver_text_position?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>

      <Headings heading={"Screensaver Text Color"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaver_text_color_Options", "screensaver_text_color")}>
       <RowLayout text={values?.screensaver_text_color?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>

      <Headings heading={"Screensaver Text Outline Style"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaver_text_outline_style_Options", "screensaver_text_outline_style")}>
       <RowLayout text={values?.screensaver_text_outline_style?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>

      <Headings heading={"Screensaver Text Outline Blue"} />
      <TouchableOpacity onPress={() => manageModalStates("screensaver_text_color_Options", "screensaver_text_outline")}>
       <RowLayout text={values?.screensaver_text_outline?.values} Icon={<DownArrowBlack />} />
      </TouchableOpacity>
     </View>
     <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.gap_10]}>
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

export default DisplaySetting
