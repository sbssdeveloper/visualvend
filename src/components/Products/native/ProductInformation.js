import { View, Text, ScrollView, TouchableOpacity, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { productStyles } from './productstyle';
import appStyles from '../../../Assets/native/appStyles';
import { colors } from '../../../Assets/native/colors';
import { Calender, CalenderIcon, CameraIcon, DownArrow, Gallery, InfoIcon, ScanIcon, SelectRoundBox } from '../../../Assets/native/images';
import CustomButton from "../../../Widgets/native/customButton";
import { useNavigation } from '@react-navigation/native';
import { productNavigationKeys, productDetailsvalidationSchema, getDimensions, } from '../../../Helpers/native/constants';
import { useFormik } from 'formik';
import { ValidatonErroMsg } from '../../../Widgets/native/ValidationErrors';
import CustTextInput from "../../../Widgets/native/customTextInput/index";
import ProductCategorydModal from '../../../Widgets/native/modals/productcategoryModal';
import ClientIdModal from '../../../Widgets/native/modals/clientIdModal';
import { sortWordsLength } from '../../../Helpers/native';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { getClientList, productCategoreyList } from '../../ProductDetails/action';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import { useDispatch, useSelector } from 'react-redux';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import { API_BASE_URL } from '../../../Helpers/constant';
import { ProductDetails } from '../../ProductDetails/consts';
import Headings from './Headings';
import { setOperationType, setProudctData } from '../../../redux/slices/productSlice';
import RowLayout from './RowLayout';
import CustomDropdownComponent from '../../../Widgets/native/DropDownComponent';
import { checkRequiredFields, handleValues } from '../../../Widgets/native/commonNativeFunctions';


const ProductInformation = ({ formikInstace, dataReset, loader }) => {

 const { height } = getDimensions();
 const devHeight = height * 1.2;
 const { operationType, updateProductData } = useSelector(state => state?.productSlice);
 const [modalStates, setMddalStates] = useModalStates(null);
 const { navigate } = useNavigation();
 const dispatch = useDispatch();


 const { handleChange, handleBlur, values, errors, touched, setValues, setFieldValue, handleSubmit: formikSubmit, } = formikInstace;
 const clientDetails = useInfiniteFetchData({ key: "CLIENTLISTPRODUCTINFO", fn: getClientList });
 const productCategory = useFetchData({ "type": "list", "length": 100, cid: values?.client_id?.id, key: "PRODUCTCATEGORYLISTING", fn: productCategoreyList, });
 const addCategory = () => !updateProductData && setMddalStates("PRODUCTCATEGORY");
 const getClient = () => !updateProductData && setMddalStates("CLIENTIDMODAL");


 const reFillFields = () => {
  const clinetData = clientDetails?.data?.find(elements => elements?.id === updateProductData?.client_id);
  setTimeout(() => {
   setFieldValue("client_id", clinetData);
  }, 500)
 };

 useEffect(() => {
  if (operationType === "EDIT" && updateProductData) reFillFields()
 }, [operationType, updateProductData,]);


 const submitData = () => {
  const { success, missingField } = checkRequiredFields(values);

  if (!success) {
   alert(missingField);
   return
  }
  formikSubmit();
 }





 return (
  <>
   <ScrollView showsVerticalScrollIndicator={false} removeClippedSubviews={true} scrollEventThrottle={16}>
    <View style={{ height: devHeight, backgroundColor: colors.appBackground }}>
     <View style={[productStyles.container, { marginTop: 10 }]}>
      <View style={[{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 10, gap: 20 }]}>
       <View style={{ flex: 1, gap: 10 }}>
        <Headings heading={"Product Size"} />
        <CustomDropdownComponent plcText={"600"} handler={() => null}
         data={[{ "value": "ml", "label": "ml" }, { "value": "gram", "label": "gm" }]}
         text={"ml"}
         style={{
          flex: 0.4, backgroundColor: "#f4f4f4", justifyContent: "center", alignItems: "center", alignSelf: "flex-end",
          height: 40, gap: 5, borderWidth: 1, borderColor: "#E9E9E9",
          borderTopRightRadius: 5, borderBottomRightRadius: 5,
          left: 10
         }}
        />

        {/* <View style={[appStyles.customInputStyles, { height: 50, borderRadius: 10 }]}>
         <View style={[appStyles.rowSpaceBetweenAlignCenter, { flex: 1, paddingLeft: 5, }]}>
          <View style={[{ flex: 1 }]}>
           <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>{"600"}</Text>
          </View>
          <View style={[{ flex: 0.3, backgroundColor: "#f4f4f4", height: "100%", justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 10, borderWidth: 1, borderColor: "#E9E9E9", borderTopRightRadius: 5, borderBottomRightRadius: 5, }]}>

           <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>ml</Text>

           <DownArrow />

          </View>

         </View>

        </View> */}

        {/* <RowLayout text={"10-12-24"}  style={{backgroundColor:"#f4f4f4",}}  Icon={<DownArrow /> } /> */}


        <Headings heading={"Product Max Qty"} />

        <CustTextInput
         handleChange={(text) => handleValues("product_max_qty", text, setValues, values, "integer")}
         textinputText={values?.product_max_qty}
         handleBlur={handleBlur("product_name")}
         style={appStyles.customInputStyles}
         keyboardType={"numeric"}

        />
        {touched.product_max_qty && errors?.product_max_qty && <ValidatonErroMsg text={errors?.product_max_qty} />}



        <Headings heading={"Product Aisle Actual"} />

        <CustTextInput
         handleChange={(text) => handleValues("product_aisle_actual", text, setValues, values, "integer")}
         textinputText={values?.product_aisle_actual}
         handleBlur={handleBlur("product_name")}
         style={appStyles.customInputStyles}
         keyboardType={"numeric"}

        />


        {touched.product_aisle_actual && errors?.product_aisle_actual && <ValidatonErroMsg text={errors?.product_aisle_actual} />}

        <Headings heading={"Machine Total Same Item Qty"} />

        <CustTextInput
         handleChange={(text) => handleValues("machine_total_same_item_qty", text, setValues, values, "integer")}

         textinputText={values?.machine_total_same_item_qty}
         handleBlur={handleBlur("machine_total_same_item_qty")}
         style={appStyles.customInputStyles}
         keyboardType={"numeric"}

        />

        {touched.machine_total_same_item_qty && errors?.machine_total_same_item_qty && <ValidatonErroMsg text={errors?.machine_total_same_item_qty} />}


        <Headings heading={"Product S2S Sequences"} />

        <CustTextInput
         handleChange={(text) => handleValues("product_s2s_sequences", text, setValues, values, "integer")}

         textinputText={values?.product_s2s_sequences}
         handleBlur={handleBlur("product_s2s_sequences")}
         style={appStyles.customInputStyles}
         keyboardType={"numeric"}

        />
        {touched.product_s2s_sequences && errors?.product_s2s_sequences && <ValidatonErroMsg text={errors?.product_s2s_sequences} />}



        <Headings heading={"Product Space to Sales Method"} />


        <CustomDropdownComponent plcText={"Aisle by Aisle"} handler={() => null}
         data={[{ "value": "aisle", "label": "Aisle by Aisle" }, { "value": "aisle", "label": "Row by Row" }]}
        />
        {/* <RowLayout text={"Aisle by Aisle"} Icon={<DownArrow />} />
        
        */}




        {/* {touched.product_name && errors?.product_name && <ValidatonErroMsg text={errors?.product_name} />} */}


        <Headings heading={"Product Space to Sales Start"} />

        {/* <RowLayout text={"Bottom Center"} Icon={<DownArrow />} /> */}
        <CustomDropdownComponent plcText={"Bottom Center"} handler={() => null}
         data={[{ "value": "aisle", "label": "Aisle by Aisle" }, { "value": "aisle", "label": "Row by Row" }]}
        />


        {/* {touched.product_name && errors?.product_name && <ValidatonErroMsg text={errors?.product_name} />} */}

        <Headings heading={"Product Space to Sales"} />

        <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start", gap: 15 }]}>
         <StatusSelectionContainer text={"Yes"} Icon={<SelectRoundBox />} />
         <StatusSelectionContainer text={"No"} Icon={<SelectRoundBox />} />
        </View>


        <Headings heading={"Tax Codes (Tax)"} />
        <CustTextInput
         handleChange={(text) => handleValues("tax_codes_tax", text, setValues, values, "integer")}

         textinputText={values?.tax_codes_tax}
         handleBlur={handleBlur("tax_codes_tax")}
         style={appStyles.customInputStyles}
         keyboardType={"numeric"}

        />
        {touched.tax_codes_tax && errors?.tax_codes_tax && <ValidatonErroMsg text={errors?.tax_codes_tax} />}


        <Headings heading={"Tax Codes (States)"} />

        <CustTextInput
         handleChange={handleChange('tax_codes_states')}
         textinputText={values?.tax_codes_states}
         handleBlur={handleBlur("tax_codes_states")}
         style={appStyles.customInputStyles}
        />
        {touched.tax_codes_states && errors?.tax_codes_states && <ValidatonErroMsg text={errors?.tax_codes_states} />}

        <Headings heading={"Tax Codes (Country)"} />

        <CustTextInput
         handleChange={(text) => handleValues("tax_codes_country", text, setValues, values, "integer")}

         textinputText={values?.tax_codes_country}
         handleBlur={handleBlur("tax_codes_country")}
         style={appStyles.customInputStyles}
         keyboardType={"numeric"}

        />
        {touched.tax_codes_country && errors?.tax_codes_country && <ValidatonErroMsg text={errors?.tax_codes_country} />}

       </View>

      </View>
     </View>
     <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10 }]}>
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
        text={operationType !== "ADD" ? 'Updates' : "Save"}
        onPress={() => submitData()}
        style={[loader ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan]}
        disabled={loader}
        isPending={loader}
       />
      </View>
     </View>

     <ProductCategorydModal modalStates={modalStates}
      setMddalStates={setMddalStates}
      setValues={setValues}
      values={values}
      {...productCategory}
     />
{/* 
     <ClientIdModal modalStates={modalStates}
      setMddalStates={setMddalStates}
      setValues={setValues}
      values={values}
      selectedClient={values?.client_id}
      {...clientDetails}
     /> */}
    </View>
   </ScrollView>

  </>
 );
};

export default ProductInformation;


const StatusSelectionContainer = ({ text, Icon }) =>
 <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10 }]}>
  {Icon}
  <Text style={[appStyles.subHeaderText]}>{text}</Text>
 </View>





