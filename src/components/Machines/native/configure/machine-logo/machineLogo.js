import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ValidatonErroMsg } from '../../../../../Widgets/native/ValidationErrors'
import { handleValues } from '../../../../../Widgets/native/commonNativeFunctions'
import CustTextInput from '../../../../../Widgets/native/customTextInput'
import CustomButton from '../../../../../Widgets/native/customButton'
import appStyles from '../../../../../Assets/native/appStyles'
import MachineModal from '../machine-modals/machineModal'
import { isObjectkeysExists, machineModalInitialState } from '../../../constants'
import { colors } from '../../../../../Assets/native/colors'
import { Add, CalenderIcon, DownArrowBlack, RedStar } from '../../../../../Assets/native/images'
import { productStyles } from '../../../../Products/native/productstyle'
import Headings from '../../../../Products/native/Headings'
import { TouchableOpacity } from 'react-native'
import RowLayout from '../../../../Products/native/RowLayout'
import { getDimensions } from '../../../../../Helpers/native/constants'
import useImagePicker from '../../../../../Hooks/useImagePicker'
import FastImage from 'react-native-fast-image'

const MachineLogo = ({ formikInstace, dataReset, loader }) => {
 const [modalStates, setModalStates] = useState(machineModalInitialState);
 const { handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm, setValues, handleSubmit: formikSubmit, handleChange, isValid } = formikInstace;
 const manageModalStates = () => setModalStates(prev => ({ ...prev, isOpen: true }));
 const { height } = getDimensions();
 const thirdOfFullHeight = height * 0.25;
 const imageLogo = useImagePicker();


 return (
  <>
   <View style={[{ flex: 1, backgroundColor: colors.appBackground, rowGap: thirdOfFullHeight },]}>
    <View style={[productStyles.container, productStyles.gap_5]}>

     <View style={[{ borderWidth: 2, borderColor: colors.appThinGrey, borderRadius: 10, height: 300, justifyContent: "center", alignItems: "center" }]}>
      <TouchableOpacity onPress={() => imageLogo?.openGallery()}>
       {imageLogo?.image ?
        <FastImage source={{ uri: imageLogo?.image?.path }} style={{ height: 100, width: 100, borderRadius: 10 }} />
        : <Add height={50} width={50} />}
      </TouchableOpacity>
     </View>

    </View>
    <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
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

   <MachineModal
    modalStates={modalStates}
    setModalStates={setModalStates}
    array={[]}
    modalHeading={"Display Settings"}
   />
  </>
 )
}

export default MachineLogo
