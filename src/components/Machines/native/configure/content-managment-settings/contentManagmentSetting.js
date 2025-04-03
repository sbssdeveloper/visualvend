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

const ContentManagementSettings = ({ formikInstace, dataReset, loader, machineInformation }) => {

  const [modalStates, setModalStates] = useState(machineModalInitialState);
  const { handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm, setValues, handleSubmit: formikSubmit, handleChange ,isValid} = formikInstace;
  const { height } = getDimensions();
  const devHeight = height * 1.2

  const manageModalStates = (selectedArray, formKey) => setModalStates(prev => ({ ...prev, isOpen: true, selectedArray, formKey }));
  const selectArray = selectArrayForModal(modalStates?.selectedArray);

  const handler = (selectedValue = {}) => {
    const { item, index } = selectedValue;
    setModalStates(prev => ({ ...prev, selectedValue: item, isOpen: false }));
    setFieldValue(modalStates?.formKey, { values: item, index })
  }



  // useEffect(() => {
  //   if (selectionData && machineInformation) {
  //     const helpEnabled = selectionData?.screensaverOptions?.[machineInformation?.machine_helpline_enabled] || null;
  //     setFieldValue("banner_text", machineInformation?.banner_text ? machineInformation?.banner_text?.toString() : "");
  //     setFieldValue("machine_helpline_enabled", { values: helpEnabled, index: machineInformation?.machine_helpline_enabled });
  //     setFieldValue("machine_helpline", machineInformation?.machine_helpline ? machineInformation?.machine_helpline?.toString() : "");
  //     setFieldValue("machine_helpline2", machineInformation?.machine_helpline2 ? machineInformation?.machine_helpline2?.toString() : "");
  //     setFieldValue("thanks_screen_text", machineInformation?.thanks_screen_text ? machineInformation?.thanks_screen_text?.toString() : "");
  //     setFieldValue("machine_customer_care_number", machineInformation?.machine_customer_care_number ? machineInformation?.machine_customer_care_number : 0);
  //     setFieldValue("machine_customer_care_email", machineInformation?.machine_customer_care_email ? machineInformation?.machine_customer_care_email?.toString() : "");
  //     setFieldValue("vend_screen_text_line1", machineInformation?.vend_screen_text_line1 ? machineInformation?.vend_screen_text_line1?.toString() : "");
  //     setFieldValue("vend_screen_text_line2", machineInformation?.vend_screen_text_line2 ? machineInformation?.vend_screen_text_line2?.toString() : "");
  //     setFieldValue("vend_screen_text_line3", machineInformation?.vend_screen_text_line3 ? machineInformation?.vend_screen_text_line3?.toString() : "");
  //   }
  // }, [machineInformation]);

  const { isAllFieldValid} = isObjectkeysExists(values) || {}


  // console.log(machine_customer_care_number)

  // alert(isAllFieldValid)

  return (
    <>
      <ScrollView>
        <View style={[{ flex: 1, backgroundColor: colors.appBackground, height: devHeight },]}>
          <View style={[productStyles.container, productStyles.gap_5]}>

            <Headings heading={'Bannert Text'} icon={<RedStar height={5} width={5} />} style={{ justifyContent: "flex-start", gap: 2 }} />
            <CustTextInput
              handleChange={handleChange('banner_text')}
              textinputText={values?.banner_text}
              handleBlur={handleBlur("banner_text")}
              style={appStyles.customInputStyles}
            />
            { errors?.banner_text && <ValidatonErroMsg text={errors?.banner_text} />}

            <Headings heading={"Helpline"} />
            <TouchableOpacity onPress={() => manageModalStates("screensaverOptions", "machine_helpline_enabled")}>
              <RowLayout text={values?.machine_helpline_enabled?.values} Icon={<DownArrowBlack />} />
            </TouchableOpacity>

            {
              values.machine_helpline_enabled?.index === 0
                ?
                <View>
                  <Headings heading={"Helpline Text"} />
                  <CustTextInput
                    handleChange={handleChange('machine_helpline')}
                    textinputText={values?.machine_helpline}
                    handleBlur={handleBlur("machine_helpline")}
                    style={appStyles.customInputStyles}
                  />
                  {errors?.machine_helpline && <ValidatonErroMsg text={errors?.machine_helpline} />}

                  <Headings heading={"Helpline Text 2"} />

                  <CustTextInput
                    handleChange={handleChange('machine_helpline2')}
                    textinputText={values?.machine_helpline2}
                    handleBlur={handleBlur("machine_helpline2")}
                    style={appStyles.customInputStyles}
                  />
                  { errors?.machine_helpline2 && <ValidatonErroMsg text={errors?.machine_helpline2} />}
                </View> : null
            }



            <Headings heading={"Thanks Screen Text"} />

            <CustTextInput
              handleChange={handleChange('thanks_screen_text')}
              textinputText={values?.thanks_screen_text}
              handleBlur={handleBlur("thanks_screen_text")}
              style={appStyles.customInputStyles}
            />
            { errors?.thanks_screen_text && <ValidatonErroMsg text={errors?.thanks_screen_text} />}


            <Headings heading={"Customer Care Number"} />
            <CustTextInput
              //  handleChange={handleChange('machine_customer_care_number')}
              handleChange={(text) =>  handleValues("machine_customer_care_number",text, setValues, values,'integer')}
              textinputText={values?.machine_customer_care_number}
              handleBlur={handleBlur("machine_customer_care_number")}
              keyboardType={'numeric'}
              maxLength={13}
              style={appStyles.customInputStyles}
            />
            {errors?.machine_customer_care_number && <ValidatonErroMsg text={errors?.machine_customer_care_number} />}


            <Headings heading={"Customer Care Email"} />
            <CustTextInput
              handleChange={handleChange('machine_customer_care_email')}
              textinputText={values?.machine_customer_care_email}
              handleBlur={handleBlur("machine_customer_care_email")}
              style={appStyles.customInputStyles}
            />
            { errors?.machine_customer_care_email && <ValidatonErroMsg text={errors?.machine_customer_care_email} />}

            <Headings heading={"Vend Screen Text Line 1"} />
            <CustTextInput
              handleChange={handleChange('vend_screen_text_line1')}
              textinputText={values?.vend_screen_text_line1}
              handleBlur={handleBlur("vend_screen_text_line1")}
              style={appStyles.customInputStyles}
            />
            { errors?.vend_screen_text_line1 && <ValidatonErroMsg text={errors?.vend_screen_text_line1} />}

            <Headings heading={"Vend Screen Text Line 2"} />
            <CustTextInput
              handleChange={handleChange('vend_screen_text_line2')}
              textinputText={values?.vend_screen_text_line2}
              handleBlur={handleBlur("vend_screen_text_line2")}
              style={appStyles.customInputStyles}
            />
            { errors?.vend_screen_text_line2 && <ValidatonErroMsg text={errors?.vend_screen_text_line2} />}


            <Headings heading={"Vend Screen Text Line 3"} />
            <CustTextInput
              handleChange={handleChange('vend_screen_text_line3')}
              textinputText={values?.vend_screen_text_line3}
              handleBlur={handleBlur("vend_screen_text_line3")}
              style={appStyles.customInputStyles}
            />
            { errors?.vend_screen_text_line3 && <ValidatonErroMsg text={errors?.vend_screen_text_line3} />}

          </View>
          <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.gap_10]}>
            <View style={{ flex: 0.5 }}>
              <CustomButton
                text={"Cancel"}
                onPress={() => dataReset()}
                style={[loader    ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan, { backgroundColor: "white" }]}
                disabled={loader  }
                isPending={false}
                textClr={colors.appLightGrey}
              />
            </View>

            <View style={{ flex: 0.5 }}>
              <CustomButton
                text={"Save"}
                onPress={() => formikSubmit()}
                style={[loader  ||  !isValid  ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan]}
                disabled={loader  ||  !isValid }
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

export default ContentManagementSettings
