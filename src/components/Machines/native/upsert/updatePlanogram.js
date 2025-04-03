import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomSerach from '../../../../Widgets/native/customsearch'
import ProductHeadings from '../../../../Widgets/native/ProductHeadings'
import DurationModal from '../../../../Widgets/native/modals/durationmodal'
import MachineIdModal from '../../../../Widgets/native/modals/machineIdModal'
import useModalStates from '../../../../Hooks/modalStates/useModalStates'
import Widget from '../../../../Widgets/native/widget'
import useCustomTextData from '../../../../Hooks/customTextData/useCustomTextData'
import { useDebouncing } from '../../../../Hooks/useDebounce/useDeboucing'
import { colors } from '../../../../Assets/native/colors'
import { useFormik } from 'formik'
import { getDimensions, MACHINEVALIDATIONSCHEMA, machineValidationSchema, PLANOGRAM_VALIDATION_SCHEMA } from '../../../../Helpers/native/constants'
import { productStyles } from '../../../Products/native/productstyle'
import Headings from '../../../Products/native/Headings'
import CustTextInput from '../../../../Widgets/native/customTextInput'
import { ValidatonErroMsg } from '../../../../Widgets/native/ValidationErrors'
import { DownArrowBlack, RedStar } from '../../../../Assets/native/images'
import appStyles from '../../../../Assets/native/appStyles'
import { useSelector } from 'react-redux'
import CustomDropdownComponent from '../../../../Widgets/native/DropDownComponent'
import { getClientList } from '../../../ProductDetails/action'
import useInfiniteFetchData from '../../../../Hooks/fetchCustomInfiniteData/useFetchInfineData'
import { MACHIES_DEFAULT_VALUES, MACHINE_CATEGORY_TYPE, PLANOGRAM_UPDATE_DEFAULT_VALUES } from '../../constants'
import CustomButton from '../../../../Widgets/native/customButton'
import { addMachine, machineUsername, mahcineProductInformation, updateMachine } from '../../actions'
import useMutationData from '../../../../Hooks/useCommonMutate'
import useFetchData from "../../../../Hooks/fetchCustomData/useFetchData"
import { showToaster } from '../../../../Widgets/native/commonFunction'
import NavigationHeader from '../../../../Widgets/native/navigationHeader'
import CurrentMachineHeader from '../../../../Widgets/native/currentMachineHeader'
import useInvalidateQuery from '../../../../Hooks/useInvalidateQuery'
import ClientIdModal from '../../../../Widgets/native/modals/clientIdModal'
import RowLayout from '../../../Products/native/RowLayout'
import { productListDropDown, updatePlanogram } from '../../../Products/action'
import { useIsFocused } from '@react-navigation/native'
import { isValidData } from '../../../../Widgets/native/commonNativeFunctions'

const UpdatePlanogram = ({ navigation = {}, route: { params } = {} }) => {
  const { height } = getDimensions();
  const devHeight = height * 1.2;

  const [modalStates, setModalStates] = useModalStates();
  const { operationType, updateProductData } = useSelector(state => state?.productSlice);
  const { invalidateQuery } = useInvalidateQuery();
  const isFocus = useIsFocused();

  const formikInstace = useFormik({
    initialValues: PLANOGRAM_UPDATE_DEFAULT_VALUES,
    // validationSchema: PLANOGRAM_VALIDATION_SCHEMA,
    onSubmit: (values) => {

      updateplanogramMutation?.mutate({ ...values, id: params?.id, product_id: values?.product?.product_id })
    }
  });
  const { handleChange, handleBlur, values, errors, touched, setFieldValue, handleSubmit, resetForm, isValid } = formikInstace;

  const updateplanogramMutation = useMutationData(updatePlanogram, (data) => handleSuccess(data), (error) => machineErrorHandler(error));
  // const { data: { data: clientData } = {} } = useFetchData({ key: "CLIENTLIST", fn: getClientList, });
  const { data: { data: specificPlanogramData } = {}, isLoading } = useFetchData({ key: "PLANOGRAMRECORDS", fn: mahcineProductInformation, id: params?.id || 0 });
  const { data: { data: proudctDropDataListData } = {}, productlistloading } = useFetchData({ key: "PROUDUCTDROPDOWNLIST", fn: productListDropDown, client_id: params?.client_id || 0 });


  useEffect(() => {
    if (Object?.keys(specificPlanogramData?.data?.length > 0 && isFocus)) {
      Object.keys(PLANOGRAM_UPDATE_DEFAULT_VALUES)?.forEach((key) => {
        let value = specificPlanogramData?.data[key] ? specificPlanogramData.data[key].toString() : null;
        if (key === "product") {
          const productData = proudctDropDataListData?.data?.find(element => element?.product_id === specificPlanogramData?.product_id);
          setFieldValue("product", productData)
        } else setFieldValue(key, value);
      })
    }
  }, [specificPlanogramData, isLoading])



  const handler = (fieldValue, fieldKey = "") => setFieldValue(fieldKey, fieldValue || "");

  const clientOrMachineHandler = (fieldValue) => {
    setFieldValue("product", fieldValue);
  }

  const dataReset = () => {
   resetForm();
    navigation?.goBack();
  }

  const handleSuccess = (data) => {
    const { success, message } = data?.data || {};
    success && showToaster("success", "Planogram updated successfully");
     invalidateQuery("GETPLANOGRAMS");
     dataReset();
  }

  const machineErrorHandler = (data) => {
    const { message } = data?.data || {};
    showToaster("error", message || "Something went wrong while adding machine");
  }





  return (
    <SafeAreaView>
      <NavigationHeader />
      <CurrentMachineHeader text={"Machines"} />
      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>

        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground }]}>
          <ScrollView showsVerticalScrollIndicator={false} removeClippedSubviews={true} scrollEventThrottle={16}>
            <View style={{}}>
              <View style={[productStyles.container, { marginTop: 10 }]}>
                <View style={[{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 10, gap: 20 }]}>
                  <View style={{ flex: 1, gap: 10 }}>
                    <Headings heading={"Machine Name"} />
                    <CustTextInput
                      handleChange={handleChange('machine_name')}
                      textinputText={values?.machine_name}
                      handleBlur={handleBlur("machine_name")}
                      style={appStyles.customInputStyles}
                    />

                    {touched && errors?.machine_name && <ValidatonErroMsg text={errors?.machine_name} />}

                    <Headings heading={"Position"} />
                    <CustTextInput
                      handleChange={handleChange('product_location')}
                      textinputText={values?.product_location}
                      handleBlur={handleBlur("product_location")}
                      keyboardType={"numeric"}
                      style={appStyles.customInputStyles}
                    />

                    {touched && errors?.product_location && <ValidatonErroMsg text={errors?.product_location} />}


                    {/* <Headings heading={"Category"} />
                    <CustTextInput
                      handleChange={handleChange('machine_row')}
                      textinputText={values?.machine_row}
                      handleBlur={handleBlur("machine_row")}
                      keyboardType={"numeric"}
                      style={appStyles.customInputStyles}
                    /> */}
                    <Headings heading={"product"} />

                    <TouchableOpacity onPress={() => {
                      setModalStates("CLIENTIDMODAL")
                    }} style={{}}>
                      <RowLayout text={values?.product?.product_name || ""} Icon={<DownArrowBlack />} />
                    </TouchableOpacity>

                    {touched && errors?.product && <ValidatonErroMsg text={errors?.product} />}

                    <Headings heading={"Quantity"} />
                    <CustTextInput
                      handleChange={handleChange('product_quantity')}
                      textinputText={values?.product_quantity}
                      handleBlur={handleBlur("product_quantity")}
                      keyboardType={"numeric"}
                      style={appStyles.customInputStyles}
                    />

                    {touched && errors?.product_quantity && <ValidatonErroMsg text={errors?.product_quantity} />}


                    <Headings heading={"Capacity"} />
                    <CustTextInput
                      handleChange={handleChange('product_max_quantity')}
                      textinputText={values?.product_max_quantity}
                      handleBlur={handleBlur("product_max_quantity")}
                      keyboardType={"numeric"}
                      style={appStyles.customInputStyles}
                    />

                    {touched && errors?.product_max_quantity && <ValidatonErroMsg text={errors?.product_max_quantity} />}


                  </View>
                </View>
              </View>
            </View>
            <View style={[appStyles.rowSpaceBetweenAlignCenter, { marginTop: "50%" }]}>
              <View style={{ flex: 0.5 }}>
                <CustomButton
                  text={"Back"}
                  onPress={() => dataReset()}
                  style={[appStyles.touchableButtonCyan, { backgroundColor: "white" }]}
                  disabled={false}
                  isPending={false}
                  textClr={colors.appLightGrey}
                />
              </View>
              <View style={{ flex: 0.5 }}>
                <CustomButton
                  text={'Update Planogram'}
                  onPress={() => handleSubmit()}
                  style={[updateplanogramMutation.isPending || !isValid ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan]}
                  disabled={updateplanogramMutation.isPending || !isValid}
                  isPending={updateplanogramMutation.isPending}
                />
              </View>
            </View>

          </ScrollView>
        </View>
      </View>

      <ClientIdModal modalStates={modalStates}
        setMddalStates={setModalStates}
        handler={(data) => clientOrMachineHandler(data)}
        modalHeading={"Select Produt"}
        selectedClient={values?.product?.product_name}
        modalData={proudctDropDataListData?.data}
        selectedKey={"product_name"}
      />
      {/* <DurationModal
        modalStates={modalStates}
        setMddalStates={setModalStates}
      /> */}
      {/* <MachineIdModal
        modalStates={modalStates}
        setMddalStates={setModalStates}
      {...machineDetails}      
      /> */}
    </SafeAreaView>
  )
}
export default UpdatePlanogram;


