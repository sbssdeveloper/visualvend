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
import { CalenderIcon, DownArrowBlack, RedStar } from '../../../../../Assets/native/images'
import { productStyles } from '../../../../Products/native/productstyle'
import Headings from '../../../../Products/native/Headings'
import { TouchableOpacity } from 'react-native'
import RowLayout from '../../../../Products/native/RowLayout'
import { getDimensions } from '../../../../../Helpers/native/constants'

const NotificationSetting = ({ formikInstace, dataReset, loader, machineInformation }) => {
  const [modalStates, setModalStates] = useState(machineModalInitialState);
  const { handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm, setValues, handleSubmit: formikSubmit, handleChange,isValid } = formikInstace;
  const { height } = getDimensions();
  const thirdOfFullHeight = height * 0.45;


  const manageModalStates = (selectedArray, formKey) => setModalStates(prev => ({ ...prev, isOpen: true, selectedArray, formKey }));
  const selectArray = selectArrayForModal(modalStates?.selectedArray);

  const handler = (selectedValue = {}) => {
    const { item, index } = selectedValue;
    setModalStates(prev => ({ ...prev, selectedValue: item, isOpen: false }));
    setFieldValue(modalStates?.formKey, { values: item, index })
  }


  // useEffect(() => {
  //   if (selectionData && machineInformation) {
  //     const machineisFeedEnabled = selectionData?.screensaverOptions?.[machineInformation?.machine_is_feed_enabled] || null;
  //     const newsletterEnabled = selectionData?.screensaverOptions?.[machineInformation?.newsletter_enabled] || null;
  //     setFieldValue("machine_is_feed_enabled", { values: machineisFeedEnabled || selectionData?.screensaverOptions[0], index: machineisFeedEnabled ? machineInformation?.machine_is_feed_enabled : 0 });
  //     setFieldValue("newsletter_enabled", { values: newsletterEnabled || selectionData?.screensaverOptions[0], index: newsletterEnabled ? machineInformation?.newsletter_enabled : 0 });
  //   }
  // }, [machineInformation]);






  return (
    <>
      <View style={[{ flex: 1, backgroundColor: colors.appBackground, rowGap: thirdOfFullHeight },]}>
        <View style={[productStyles.container, productStyles.gap_5]}>

          <Headings heading={"Feed"} />
          <TouchableOpacity onPress={() => manageModalStates("screensaverOptions", "machine_is_feed_enabled")}>
            <RowLayout text={values?.machine_is_feed_enabled?.values} Icon={<DownArrowBlack />} />
          </TouchableOpacity>

          <Headings heading={"Newsletter"} />
          <TouchableOpacity onPress={() => manageModalStates("screensaverOptions", 'newsletter_enabled')}>
            <RowLayout text={values?.newsletter_enabled?.values} Icon={<DownArrowBlack />} />
          </TouchableOpacity>

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
              style={[loader  || !isValid  ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan]}
              disabled={loader  || !isValid }
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

export default NotificationSetting
