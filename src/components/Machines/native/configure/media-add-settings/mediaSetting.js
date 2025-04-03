import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ValidatonErroMsg } from '../../../../../Widgets/native/ValidationErrors'
import { handleValues } from '../../../../../Widgets/native/commonNativeFunctions'
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

const MediaSettings = ({ formikInstace, dataReset, loader, machineInformation }) => {
 const [modalStates, setModalStates] = useState(machineModalInitialState);
 const { handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm, setValues, handleSubmit: formikSubmit,isValid } = formikInstace;
 const manageModalStates = (selectedArray, formKey) => setModalStates(prev => ({ ...prev, isOpen: true, selectedArray, formKey }));
 const { height } = getDimensions();
 const thirdOfFullHeight = height * 0.38;
 const selectArray = selectArrayForModal(modalStates?.selectedArray);

 const handler = (selectedValue = {}) => {
  const { item, index } = selectedValue;
  setModalStates(prev => ({ ...prev, selectedValue: item, isOpen: false }));
  setFieldValue(modalStates?.formKey, { values: item, index })
 }






 return (
  <>
   <View style={[{ flex: 1, backgroundColor: colors.appBackground, rowGap: thirdOfFullHeight },]}>
    <View style={[productStyles.container, productStyles.gap_5]}>
     <Headings heading={"Advertisement Type"} />
     <TouchableOpacity onPress={() => manageModalStates("advertisementTypeOptions", "advertisement_type")}>
      <RowLayout text={values?.advertisement_type?.values} Icon={<DownArrowBlack />} />
     </TouchableOpacity>

     <Headings heading={"Advertisement Mode"} />
     <TouchableOpacity onPress={() => manageModalStates("advertisementModeOptions", "machine_advertisement_mode")}>
      <RowLayout text={values?.machine_advertisement_mode?.values} Icon={<DownArrowBlack />} />
     </TouchableOpacity>

     <Headings heading={"Advertisement Reporting"} />
     <TouchableOpacity onPress={() => manageModalStates("screensaverOptions", "machine_is_advertisement_reporting")}>
      <RowLayout text={values?.machine_is_advertisement_reporting.values} Icon={<DownArrowBlack />} />
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
       style={[loader || !isValid ?  appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan]}
       disabled={loader || !isValid}
       isPending={loader}
      />
     </View>
    </View>
   </View>

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

export default MediaSettings
