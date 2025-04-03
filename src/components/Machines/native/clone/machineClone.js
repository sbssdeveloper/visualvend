import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { cloneElement, useEffect, useState } from 'react'
import NavigationHeader from '../../../../Widgets/native/navigationHeader'
import CurrentMachineHeader from '../../../../Widgets/native/currentMachineHeader'
import CustomSerach from '../../../../Widgets/native/customsearch'
import Widget from '../../../../Widgets/native/widget'
import useModalStates from '../../../../Hooks/modalStates/useModalStates'
import CustomDropdownComponent from '../../../../Widgets/native/DropDownComponent'
import CustTextInput from '../../../../Widgets/native/customTextInput'
import { useFormik } from 'formik'
import { CLONE_MACHINE_DEFAULT_VALUES } from '../../constants'
import { colors } from '../../../../Assets/native/colors'
import { ValidatonErroMsg } from '../../../../Widgets/native/ValidationErrors'
import ProductHeadings from '../../../../Widgets/native/ProductHeadings'
import { CheckboxMarked, DownArrowBlack, RedStar, Uncheckbox } from '../../../../Assets/native/images'
import { getDimensions, MACHINECLONESCHEMA } from '../../../../Helpers/native/constants'
import { productStyles } from '../../../Products/native/productstyle'
import Headings from '../../../Products/native/Headings'
import CustomButton from '../../../../Widgets/native/customButton'
import DurationModal from '../../../../Widgets/native/modals/durationmodal'
import MachineIdModal from '../../../../Widgets/native/modals/machineIdModal'
import appStyles from '../../../../Assets/native/appStyles'
import useInfiniteFetchData from '../../../../Hooks/fetchCustomInfiniteData/useFetchInfineData'
import { getClientList } from '../../../ProductDetails/action'
import useLocation from '../../../../Hooks/getLocation/useLocation'
import useMutationData from '../../../../Hooks/useCommonMutate'
import { cloneMachine, machineUsername } from '../../actions'
import useFetchData from '../../../../Hooks/fetchCustomData/useFetchData'
import { showToaster } from '../../../../Widgets/native/commonFunction'
import RowLayout from '../../../Products/native/RowLayout'
import ClientIdModal from '../../../../Widgets/native/modals/clientIdModal'

const MachineClone = ({ navigation = {}, route: { params } = {} }) => {
  const { getLocation, currentLocation } = useLocation();
  const [modalStates, setMddalStates] = useModalStates(null);
  const [isClinetData, setClient] = useState('CLIENT');


  const { height } = getDimensions();
  const devHeight = height * 1.2;

  const formikInstace = useFormik({
    initialValues: CLONE_MACHINE_DEFAULT_VALUES,
    validationSchema: MACHINECLONESCHEMA,
    onSubmit: (values) => machineCloneMutation?.mutate({ ...values, machine_id: params?.id, })
  });

  const { handleChange, handleBlur, values, errors, touched, setFieldValue, handleSubmit, resetForm } = formikInstace;

  useEffect(() => {
    getLocation();
    const { longitude: machine_longitude, latitude: machine_latitude } = currentLocation || {}
    setFieldValue("machine_longitude", machine_longitude?.toString());
    setFieldValue("machine_latitude", machine_latitude?.toString());
  }, [currentLocation])

  const checkBoxHandler = (value, key) => setFieldValue(key, value === 0 ? 1 : 0);
  const handler = (fieldValue, fieldKey = "") => setFieldValue(fieldKey, fieldValue || "");

  const handleSuccess = (data) => {
    const { success, message } = data?.data || {};
    success && showToaster("success", message);
    navigation?.goBack();
  }

  const machineErrorHandler = (data) => {
    const { message } = data?.data || {};
    showToaster("error", message || "Something went wrong while adding machine");
  }


  const clientOrMachineHandler = (fieldValue) => {
    const fieldKey = isClinetData === "CLIENT" ? "machine_client_id" : "machine_username"
    setFieldValue(fieldKey, fieldValue);
  }

  const { data: { data: clientDetails } = {} } = useFetchData({ key: "CLIENTLISTMACHINECLONE", fn: getClientList, });
  const { data: machineUsers, isLoading } = useFetchData({ key: "GETMACHINEUSERS", fn: machineUsername, client_id: values?.machine_client_id?.id || 0 });
  const machineCloneMutation = useMutationData(cloneMachine, (data) => handleSuccess(data), (error) => machineErrorHandler(error));


  return (
    <SafeAreaView>
      <NavigationHeader />
      <CurrentMachineHeader text={"Machines"} />
      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
        <View style={[appStyles.gap_10, appStyles.pv_10]}>
        </View>
        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground }]}>
          <ProductHeadings heading={"Clone Machine"} style={appStyles.justifyCStart} />
          <ScrollView showsVerticalScrollIndicator={false} removeClippedSubviews={true} scrollEventThrottle={16}>
            <View style={{ height: devHeight }}>
              <View style={[productStyles.container, { marginTop: 10 }]}>
                <View style={[appStyles.rowSpaceBetweenAlignCenter, { paddingLeft: 10, gap: 20 }]}>
                  <View style={{ flex: 1, gap: 10 }}>

                    <Headings heading={`Client`} icon={<RedStar height={5} width={5} />} style={{ justifyContent: "flex-start", gap: 2 }} />
                    {/* <CustomDropdownComponent plcText={"Select Client"}
                      handler={(data) => handler(data?.value, "machine_client_id")} data={clientDetails?.data} keyObject={{ "label": "client_name", "value": "id", "name": "client_name", "id": "id" }} /> */}
                    <>
                      <TouchableOpacity onPress={() => {
                        setClient("CLIENT");
                        setMddalStates("CLIENTIDMODAL");
                      }}
                        style={{}}>
                        <RowLayout text={values?.machine_client_id?.client_name || ""} Icon={<DownArrowBlack />} />
                      </TouchableOpacity>
                    </>
                    {errors?.machine_client_id && <ValidatonErroMsg text={errors?.machine_client_id} />}

                    <TouchableOpacity onPress={() => {
                      setMddalStates("CLIENTIDMODAL")
                      setClient("USER");
                    }} style={{}}>
                      <RowLayout text={values?.machine_username?.username || ""} Icon={<DownArrowBlack />} />
                    </TouchableOpacity>

                    {errors?.machine_username && <ValidatonErroMsg text={errors?.machine_username} />}



                    {/* <Headings heading={`Client`} icon={<RedStar height={5} width={5} />} style={{ justifyContent: "flex-start", gap: 2 }} /> */}

                    {/* <CustomDropdownComponent plcText={"Select Client"}
                      handler={(data) => handler(data?.id, "client_id")}
                      data={clientDetails?.data} keyObject={{ "label": "client_name", "value": "id", "name": "client_name", "id": "id" }}
                    /> */}

                    {/* <TouchableOpacity onPress={() => {
                      // setClient("CLIENT");
                       setMddalStates("CLIENTIDMODAL");
                    }}
                      style={{}}>
                      <RowLayout text={"values?.machine_client_id?.client_name" || ""} Icon={<DownArrowBlack />} />
                    </TouchableOpacity> */}


                    {/* <CustomDropdownComponent plcText={""}
                      handler={(data) => handler(data?.value, "machine_username")} data={machineUsers?.data?.data} keyObject={{ "label": "username", "value": "username", }} /> */}

                    <Headings heading={"Machine Name"} />

                    <CustTextInput
                      handleChange={handleChange('machine_name')}
                      textinputText={values?.machine_name}
                      handleBlur={handleBlur("machine_name")}
                      style={appStyles.customInputStyles}
                    />
                    {touched?.machine_name && errors?.machine_name && <ValidatonErroMsg text={errors?.machine_name} />}

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
                    <ConfigurationOptions text="Need Clone Planogram " value={values?.need_clone_planogram} onpress={() => checkBoxHandler(values?.need_clone_planogram, "need_clone_planogram")} />
                    <ConfigurationOptions text="Need Clone People" value={values?.need_clone_people} onpress={() => checkBoxHandler(values?.need_clone_people, "need_clone_people")} />
                    <ConfigurationOptions text="Need Clone Media Ad ?" value={values?.need_clone_media_ad} onpress={() => checkBoxHandler(values?.need_clone_media_ad, "need_clone_media_ad")} />
                    <ConfigurationOptions text="Need Clone Config Setting ? " value={values?.need_clone_config_setting} onpress={() => checkBoxHandler(values?.need_clone_config_setting, "need_clone_config_setting")} />
                  </View>
                </View>
              </View>
              <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, marginTop: 20 }]}>
                <View style={{ flex: 0.5 }}>
                  <CustomButton
                    text={"Back"}
                    onPress={() => navigation.goBack()}
                    style={[appStyles.touchableButtonCyan, { backgroundColor: "white" }]}
                    disabled={false}
                    isPending={false}
                    textClr={colors.appLightGrey}
                  />
                </View>
                <View style={{ flex: 0.5 }}>
                  <CustomButton
                    text={"Submit"}
                    onPress={() => handleSubmit()}
                    style={[machineCloneMutation?.isPending ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan]}
                    disabled={machineCloneMutation?.isPending}
                    isPending={machineCloneMutation?.isPending}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      <ClientIdModal modalStates={modalStates}
        setMddalStates={setMddalStates}
        handler={(data) => clientOrMachineHandler(data)}
        modalHeading={isClinetData === "CLIENT" ? "Select Clinet Id" : "Select Machine User"}
        selectedClient={isClinetData === "CLIENT" ? values?.machine_client_id?.client_name || "" : values?.machine_username?.name || ""}
        modalData={isClinetData === "CLIENT" ? clientDetails?.data : machineUsers?.data}
      />

    </SafeAreaView>
  )
}

export default MachineClone


const ConfigurationOptions = ({ text, value, onpress }) => {
  return (
    <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.gap_10, appStyles.justifyCStart]}>
      <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.gap_10, appStyles.justifyCStart]} onPress={() => onpress()} >
        {value ? <CheckboxMarked height={20} width={20} /> : <Uncheckbox height={20} width={20} />}
      </TouchableOpacity>
      <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.gap_10, appStyles.justifyCStart]} onPress={() => onpress()} >
        <Text style={[appStyles.subHeaderText]}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  )
}