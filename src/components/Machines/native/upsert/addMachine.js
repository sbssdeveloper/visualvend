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
import { getDimensions, MACHINEVALIDATIONSCHEMA, machineValidationSchema } from '../../../../Helpers/native/constants'
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
import { MACHIES_DEFAULT_VALUES, MACHINE_CATEGORY_TYPE } from '../../constants'
import CustomButton from '../../../../Widgets/native/customButton'
import { addMachine, machineUsername, updateMachine } from '../../actions'
import useMutationData from '../../../../Hooks/useCommonMutate'
import useFetchData from "../../../../Hooks/fetchCustomData/useFetchData"
import useLocation from '../../../../Hooks/getLocation/useLocation'
import { showToaster } from '../../../../Widgets/native/commonFunction'
import NavigationHeader from '../../../../Widgets/native/navigationHeader'
import CurrentMachineHeader from '../../../../Widgets/native/currentMachineHeader'
import useInvalidateQuery from '../../../../Hooks/useInvalidateQuery'
import ClientIdModal from '../../../../Widgets/native/modals/clientIdModal'
import RowLayout from '../../../Products/native/RowLayout'

const AddMachine = ({ navigation = {}, route: { params } = {} }) => {
  const { height } = getDimensions();
  const devHeight = height * 1.2;
  // const [searchText, setSearchText] = useCustomTextData();
  // const [debounceSearch] = useDebouncing(searchText, 1000);
  const [modalStates, setModalStates] = useModalStates();
  const [isClinetData, setClient] = useState('CLIENT');
  const { operationType, updateProductData } = useSelector(state => state?.productSlice);
  const { getLocation, currentLocation } = useLocation();
  const { invalidateQuery } = useInvalidateQuery();

  const formikInstace = useFormik({
    initialValues: MACHIES_DEFAULT_VALUES,
    validationSchema: MACHINEVALIDATIONSCHEMA,
    onSubmit: (values) => {
      machineMutation?.mutate({ ...values, machine_is_single_category: values?.machine_is_single_category?.id, machine_client_id: values?.machine_client_id?.id, machine_username: values?.machine_username?.username })
    }
  });
  const { handleChange, handleBlur, values, errors, touched, setFieldValue, handleSubmit, resetForm, } = formikInstace;
  useEffect(() => {
    getLocation();
    if (!params && !params?.editMode) {
      const { longitude: machine_longitude, latitude: machine_latitude } = currentLocation || {}
      setFieldValue("machine_longitude", machine_longitude?.toString());
      setFieldValue("machine_latitude", machine_latitude?.toString());
      setFieldValue("machine_is_single_category", MACHINE_CATEGORY_TYPE[0])
    } else {
     
      Object.keys(MACHIES_DEFAULT_VALUES)?.forEach((keys) => {
        let value = params[keys];
        const keyArr = ["machine_client_id", "machine_username"];
        if (keyArr?.includes(keys)) {
          value = keyArr[0] === keys ? clientData?.data?.find(item => item?.id === value) : { username: value, };
          console.log(keys,"======>>>>>>>",value)
          setFieldValue(keys, value);
        } else {
          console.log(keys,"======>>>>>>>",value,)
          setFieldValue(keys, typeof value !== undefined ? value?.toString() : "");
        }
      })
    }
  }, [currentLocation])



  // const handler = (fieldValue, fieldKey = "") => setFieldValue(fieldKey, fieldValue || "");

  const clientOrMachineHandler = (fieldValue) => {
    const fieldKey = isClinetData === "CLIENT" ? "machine_client_id" : isClinetData === "USER" ? "machine_username" : "machine_is_single_category"
    setFieldValue(fieldKey, fieldValue);
  }

  const dataReset = () => {
    resetForm();
    navigation?.goBack();
  }

  const handleSuccess = (data) => {
    const { success, message } = data?.data || {};
    success && showToaster("success", message);
    invalidateQuery("GETMACHINELISTDATA");
    navigation?.goBack();
  }

  const machineErrorHandler = (data) => {
    const { message } = data?.data || {};
    showToaster("error", message || "Something went wrong while adding machine");
  }


  const machineMutation = useMutationData(params?.editMode && params ? updateMachine : addMachine, (data) => handleSuccess(data), (error) => machineErrorHandler(error));
  const { data: { data: clientData } = {} } = useFetchData({ key: "CLIENTLIST", fn: getClientList, });
  const { data: { data: machineUsers } = {}, isLoading } = useFetchData({ key: "GETMACHINEUSERS", fn: machineUsername, client_id: values?.machine_client_id?.id || 0, });

 

  return (
    <SafeAreaView>
      <NavigationHeader />
      <CurrentMachineHeader text={"Machines"} />
      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
        {/* <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />
        <View style={[appStyles.gap_10, appStyles.pv_10]}>
          <Widget setMddalStates={setModalStates} modalStates={modalStates} />
        </View> */}
        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground }]}>
          {/* <ProductHeadings heading={"Add Machine"} style={appStyles.justifyCStart} /> */}
          <ScrollView showsVerticalScrollIndicator={false} removeClippedSubviews={true} scrollEventThrottle={16}>
            <View style={{ height: devHeight }}>
              <View style={[productStyles.container, { marginTop: 10 }]}>
                <View style={[{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 10, gap: 20 }]}>
                  <View style={{ flex: 1, gap: 10 }}>
                    <Headings heading={`Client`} icon={<RedStar height={5} width={5} />} style={{ justifyContent: "flex-start", gap: 2 }} />
                    {/* <CustomDropdownComponent plcText={"Select Client"}
                      handler={(data) => handler(data?.value, "machine_client_id")} data={clientDetails?.data} keyObject={{ "label": "client_name", "value": "id", "name": "client_name", "id": "id" }} /> */}
                    <>
                      <TouchableOpacity onPress={() => {
                        setClient("CLIENT");
                        setModalStates("CLIENTIDMODAL");
                      }}
                        style={{}}>
                        <RowLayout text={values?.machine_client_id?.client_name || ""} Icon={<DownArrowBlack />} />
                      </TouchableOpacity>
                    </>
                    {errors?.machine_client_id && <ValidatonErroMsg text={errors?.machine_client_id} />}

                    <TouchableOpacity onPress={() => {
                      setModalStates("CLIENTIDMODAL")
                      setClient("USER");
                    }} style={{}}>
                      <RowLayout text={values?.machine_username?.username || ""} Icon={<DownArrowBlack />} />
                    </TouchableOpacity>

                    {errors?.machine_username && <ValidatonErroMsg text={errors?.machine_username} />}



                    {/* <CustomDropdownComponent plcText={"Machine User"}
                      handler={(data) => handler(data?.value, "machine_username")} data={machineUsers?.data?.data} keyObject={{ "label": "username", "value": "username", }} />
                    {touched.machine_name && errors?.machine_name && <ValidatonErroMsg text={errors?.machine_name} />} */}

                    <Headings heading={"Machine Name"} />

                    <CustTextInput
                      handleChange={handleChange('machine_name')}
                      textinputText={values?.machine_name}
                      handleBlur={handleBlur("machine_name")}
                      style={appStyles.customInputStyles}
                    />

                    <Headings heading={"Rows"} />
                    <CustTextInput
                      handleChange={handleChange('machine_row')}
                      textinputText={values?.machine_row}
                      handleBlur={handleBlur("machine_row")}
                      keyboardType={"numeric"}
                      style={appStyles.customInputStyles}
                    />
                    {touched.machine_row && errors?.machine_row && <ValidatonErroMsg text={errors?.machine_row} />}
                    <Headings heading={" Columns"} />
                    <CustTextInput
                      handleChange={handleChange('machine_column')}
                      textinputText={values?.machine_column}
                      handleBlur={handleBlur("machine_column")}
                      keyboardType={"numeric"}
                      style={appStyles.customInputStyles}
                    />
                    {touched.machine_column && errors?.machine_column && <ValidatonErroMsg text={errors?.machine_column} />}
                    <Headings heading={"Machine Address"} />
                    <CustTextInput
                      handleChange={handleChange('machine_address')}
                      textinputText={values?.machine_address}
                      handleBlur={handleBlur("machine_address")}
                      style={appStyles.customInputStyles}
                    />
                    {touched?.machine_address && errors?.machine_address && <ValidatonErroMsg text={errors?.machine_address} />}
                    <Headings heading={"Machine Latitude"} />
                    <CustTextInput
                      handleChange={handleChange('machine_latitude')}
                      textinputText={values?.machine_latitude}
                      handleBlur={handleBlur("machine_latitude")}
                      keyboardType={"numeric"}
                      style={appStyles.customInputStyles}
                    />
                    {touched?.machine_latitude && errors?.machine_latitude && <ValidatonErroMsg text={errors?.machine_latitude} />}
                    <Headings heading={"Machine Longitude"} />
                    <CustTextInput
                      handleChange={handleChange('machine_longitude')}
                      textinputText={values?.machine_longitude}
                      handleBlur={handleBlur("machine_longitude")}
                      keyboardType={"numeric"}
                      style={appStyles.customInputStyles}
                    />
                    {touched?.machine_longitude && errors?.machine_longitude && <ValidatonErroMsg text={errors?.machine_longitude} />}
                    <Headings heading={"Machine Category Type"} />

                    <TouchableOpacity onPress={() => {
                      setModalStates("CLIENTIDMODAL")
                      setClient("CATEGORY");
                    }} style={{}}>
                      <RowLayout text={values?.machine_is_single_category?.name || ""} Icon={<DownArrowBlack />} />
                    </TouchableOpacity>

                    {/* <CustomDropdownComponent plcText={"Select Client"}
                      disabled={operationType === "EDIT" || updateProductData ? true : false}
                      handler={(data) => handler(data?.value, "machine_is_single_category")} data={MACHINE_CATEGORY_TYPE} keyObject={{ "label": "name", "value": "id", }} /> */}
                  </View>
                </View>
              </View>
              <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, marginTop: 10 }]}>
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
                    text={params?.editMode ? 'Update Machine' : "Add Machine"}
                    onPress={() => handleSubmit()}
                    style={[machineMutation.isPending ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan]}
                    disabled={machineMutation.isPending}
                    isPending={machineMutation.isPending}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      <DurationModal
        modalStates={modalStates}
        setMddalStates={setModalStates}
      />
      {/* <MachineIdModal
        modalStates={modalStates}
        setMddalStates={setModalStates}
      {...machineDetails}      
      /> */}

      <ClientIdModal modalStates={modalStates}
        setMddalStates={setModalStates}
        handler={(data) => clientOrMachineHandler(data)}
        modalHeading={isClinetData === "CLIENT" ? "Select Clinet Id" : "Select Machine User"}
        selectedClient={isClinetData === "CLIENT" ? values?.machine_client_id?.client_name || "" : isClinetData === "USER" ? values?.machine_username?.name : values?.machine_is_single_category?.name || ""}
        modalData={isClinetData === "CLIENT" ? clientData?.data : isClinetData === "USER" ? machineUsers?.data : MACHINE_CATEGORY_TYPE}
      />


    </SafeAreaView>
  )
}
export default AddMachine;


