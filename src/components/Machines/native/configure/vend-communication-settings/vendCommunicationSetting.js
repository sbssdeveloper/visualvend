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
import { CalenderIcon, DownArrowBlack, RedStar } from '../../../../../Assets/native/images'
import { productStyles } from '../../../../Products/native/productstyle'
import Headings from '../../../../Products/native/Headings'
import { TouchableOpacity } from 'react-native'
import RowLayout from '../../../../Products/native/RowLayout'
import { getDimensions } from '../../../../../Helpers/native/constants'

const VendCommunicationSetting = ({ formikInstace, dataReset, loader, machineInformation }) => {
  const [modalStates, setModalStates] = useState(machineModalInitialState);
  const { handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm, setValues, handleSubmit: formikSubmit, handleChange,isValid } = formikInstace;
  const { height } = getDimensions();
  const manageModalStates = (selectedArray, formKey) => setModalStates(prev => ({ ...prev, isOpen: true, selectedArray, formKey }));
  const selectArray = selectArrayForModal(modalStates?.selectedArray);
  const thirdOfFullHeight = height * 0.28;

  const handler = (selectedValue = {}) => {
    const { item, index } = selectedValue;
    setModalStates(prev => ({ ...prev, selectedValue: item, isOpen: false }));
    setFieldValue(modalStates?.formKey, { values: item, index })
  }



  // useEffect(() => {
  //   if (selectionData && machineInformation) {
  //     setFieldValue("serial_board_type",modifyFiledValues(selectionData?.serial_board_type_options, machineInformation?.serial_board_type));
  //     setFieldValue("serial_baud_rate", machineInformation?.serial_baud_rate ? machineInformation?.serial_baud_rate?.toString() : "");
  //     setFieldValue("serial_port_number", modifyFiledValues(selectionData?.serial_port_number_options, machineInformation?.serial_port_number));
  //     setFieldValue("serial_port_speed", machineInformation?.serial_port_speed ? machineInformation?.serial_port_speed.toString() : "");
  //   }
  // }, [machineInformation]);




  return (
    <>
      <View style={[{ flex: 1, backgroundColor: colors.appBackground, rowGap: thirdOfFullHeight },]}>
        <View style={[productStyles.container, productStyles.gap_5]}>

          <Headings heading={"Serial Based Type"} />
          <TouchableOpacity onPress={() => manageModalStates("serial_board_type_options", "serial_board_type")}>
            <RowLayout text={values?.serial_board_type?.values} Icon={<DownArrowBlack />} />
          </TouchableOpacity>

          <Headings heading={"Serial Based Rate"} />
          <CustTextInput
            handleChange={handleChange('serial_baud_rate')}
            textinputText={values?.serial_baud_rate}
            handleBlur={handleBlur("serial_baud_rate")}
            style={appStyles.customInputStyles}
          />
          {touched.serial_baud_rate && errors?.serial_baud_rate && <ValidatonErroMsg text={errors?.serial_baud_rate} />}



          <Headings heading={"Serial Port Number"} />
          <TouchableOpacity onPress={() => manageModalStates("serial_port_number_options", "serial_port_number")}>
            <RowLayout text={values?.serial_port_number?.values} Icon={<DownArrowBlack />} />
          </TouchableOpacity>


          <Headings heading={"Serial Port Speed"} />

          <CustTextInput
            handleChange={handleChange('serial_port_speed')}
            textinputText={values?.serial_port_speed}
            handleBlur={handleBlur("serial_port_speed")}
            style={appStyles.customInputStyles}
          />
          {touched.serial_port_speed && errors?.serial_port_speed && <ValidatonErroMsg text={errors?.serial_port_speed} />}


        </View>
        <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
          <View style={{ flex: 0.5 }}>
            <CustomButton
              text={"Cancel"}
              onPress={() => dataReset()}
              style={[loader   ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan, { backgroundColor: "white" }]}
              disabled={loader  }
              isPending={false}
              textClr={colors.appLightGrey}
            />
          </View>

          <View style={{ flex: 0.5 }}>
            <CustomButton
              text={"Save"}
              onPress={() => formikSubmit()}
              style={[loader  || !isValid ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan]}
              disabled={loader  || !isValid}
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

export default VendCommunicationSetting
