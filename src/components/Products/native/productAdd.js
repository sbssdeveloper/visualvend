import { View, Text, ScrollView, TouchableOpacity, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { productStyles } from './productstyle';
import appStyles from '../../../Assets/native/appStyles';
import { colors } from '../../../Assets/native/colors';
import { BlackCloseIcon, CalenderIcon, DownArrowBlack, ScanIcon, SelectRoundBox, UnSelectedRoundBox } from '../../../Assets/native/images';
import CustomButton from "../../../Widgets/native/customButton";
import { getDimensions, } from '../../../Helpers/native/constants';
import { ValidatonErroMsg } from '../../../Widgets/native/ValidationErrors';
import CustTextInput from "../../../Widgets/native/customTextInput/index";
import ProductCategorydModal from '../../../Widgets/native/modals/productcategoryModal';
import ClientIdModal from '../../../Widgets/native/modals/clientIdModal';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { getClientList, productCategoreyList } from '../../ProductDetails/action';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import { useSelector } from 'react-redux';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import Headings from './Headings';
import RowLayout from './RowLayout';
import DateSelector from '../../../Widgets/native/DateSelector';
import CustomDropdownComponent from '../../../Widgets/native/DropDownComponent';
import moment from 'moment';
import { checkRequiredFields, mapArrayUsingObject } from '../../../Widgets/native/commonNativeFunctions';
import MultiSelector from '../../../Widgets/native/Mulitselector/multiSelector';


const ProductAdd = ({ formikInstace, dataReset, loader }) => {

    const { operationType, updateProductData, _client_id } = useSelector(({ productSlice: { operationType, updateProductData }, authSlice: { _client_id } }) => ({
        operationType,
        updateProductData,
        _client_id,
    }));

    const [modalStates, setMddalStates] = useModalStates(null);
    const [categoryArray, setCategoryArray] = useState([]);
    const { handleChange, handleBlur, values, errors, touched, setValues, setFieldValue, handleSubmit: formikSubmit, } = formikInstace;

    useEffect(() => {
        if (operationType === "EDIT" || updateProductData) reFillFields();
        if (categoryArray?.length > 0 && !updateProductData) {
            const productCategory = categoryArray?.map((el) => el?.name)?.join(",");
            setFieldValue("product_category", productCategory);
        }
    }, [operationType, updateProductData]);

    const {data:{data:clientDetails}={}} = useFetchData({ key: "CLIENTLIST", fn: getClientList });
    const { data: { data: productCategoryData } = {} } = useFetchData({ "type": "list", "length": 100, cid: values?.client_id?.id, key: "PRODUCTCATEGORYLIST", fn: productCategoreyList, });


    const reFillFields = () => {
        const clinetData = clientDetails?.data?.find(elements => elements?.id === updateProductData?.client_id);
        setTimeout(() => {
            setFieldValue("client_id", clinetData);
            setFieldValue("product_category", updateProductData?.assigned_categories || []);
        }, 1000)

    };
    // const dropDownHandler = (value, key) => setFieldValue(key, value);
    const manageProductStatus = (value) => setFieldValue("product_status", value);

    const formSubmit = () => {
        const { success, missingField } = checkRequiredFields(values);
        if (!success) {
            alert(missingField);
            return
        }
        formikSubmit();

        // if (categoryArray?.length > 0) {
        //     const productCategory = categoryArray.map(el => el?.name).join(",");
        //     setFieldValue("product_category", productCategory);
        //     const { success, missingField } = checkRequiredFields(values);
        //     if (!success) {
        //         alert(missingField);
        //         return
        //     }
        //     formikSubmit();
        // } else if (updateProductData || operationType === "EDIT") formikSubmit();
        // else alert("Please add product category.");
    };

const handler = (data) => setFieldValue("client_id",data || "")

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false} removeClippedSubviews={true} scrollEventThrottle={16}>
                <View style={{ backgroundColor: colors.appBackground }}>
                    <View style={[productStyles.container, { marginTop: 10 }]}>
                        <View style={[{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 10, gap: 20 }]}>
                            <View style={{ flex: 1, gap: 10 }}>
                                {_client_id <= 0 ?
                                    <>
                                        <Headings heading={"Client ID"} />
                                        <TouchableOpacity onPress={() => setMddalStates("CLIENTIDMODAL")} style={{}}>
                                            <RowLayout text={values?.client_id?.client_name || ""} Icon={<DownArrowBlack />} />
                                        </TouchableOpacity>

                                        {/* <CustomDropdownComponent plcText={"Select Client ID"}
                                            categoryArray={categoryArray} setCategoryArray={setCategoryArray}
                                            disabled={operationType === "EDIT" || updateProductData ? true : false}
                                            handler={(selectedData) => dropDownHandler(selectedData?.value, "client_id")} data={clientDetails?.data} keyObject={{ "label": "client_name", "value": "id", }} />
                                        {touched?.client_id && errors?.client_id && <ValidatonErroMsg text={errors?.client_id} />} */}

                                    </> :
                                    null}

                                <Headings heading={"Product ID"} />
                                <CustTextInput
                                    handleChange={handleChange('product_id')}
                                    textinputText={values?.product_id}
                                    editable={updateProductData || operationType === "EDIT" ? false : true}
                                    handleBlur={handleBlur("product_id")}
                                    style={appStyles.customInputStyles}
                                />
                                {touched.product_id && errors?.product_id && <ValidatonErroMsg text={errors?.product_id} />}
                                <Headings heading={"Product Name"} />
                                <CustTextInput
                                    handleChange={handleChange('product_name')}
                                    textinputText={values?.product_name}
                                    handleBlur={handleBlur("product_name")}
                                    style={appStyles.customInputStyles}
                                />
                                {touched.product_name && errors?.product_name && <ValidatonErroMsg text={errors?.product_name} />}

                                <View style={[appStyles.rowSpaceBetweenAlignCenter,]}>
                                    <View style={[appStyles.gap_5, { width: "48%" }]}>
                                        <Headings heading={"Product Batch No."} />
                                        <CustTextInput
                                            handleChange={handleChange('product_batch_no')}
                                            textinputText={values?.product_batch_no}
                                            handleBlur={handleBlur("product_batch_no")}
                                            style={{ ...appStyles.customInputStyles, height: 40 }}
                                            maxLength={15}
                                        // editable={false}
                                        />
                                        {touched.product_batch_no && errors?.product_batch_no && <ValidatonErroMsg text={errors?.product_batch_no} />}
                                    </View>
                                    <View style={[appStyles.gap_5, { width: "48%" }]}>

                                        <Headings heading={"Batch Expire Date"} />
                                        <TouchableOpacity onPress={() => setMddalStates("DATE")} style={{}}>
                                            <RowLayout text={values?.product_batch_expiry_date} Icon={<CalenderIcon />} />
                                        </TouchableOpacity>

                                        <DateSelector isOpen={modalStates === "DATE" ? true : false} dateHandler={(param) => {
                                            const date = moment(param || new Date()).format("YYYY-MM-DD ");
                                            setFieldValue("product_batch_expiry_date", date)
                                            setMddalStates(null);
                                        }} />
                                    </View>
                                </View>

                                <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                                    <View style={[appStyles.gap_5, { width: "48%" }]}>
                                        <Headings heading={" Grading No."} />
                                        <CustTextInput
                                            handleChange={handleChange('product_grading_no')}
                                            textinputText={values?.product_grading_no}
                                            handleBlur={handleBlur("product_grading_no")}
                                            style={{ ...appStyles.customInputStyles, height: 40 }}
                                        />
                                        {touched.product_grading_no && errors?.product_grading_no && <ValidatonErroMsg text={errors?.product_grading_no} />}
                                    </View>

                                    <View style={[appStyles.gap_5, { width: "48%" }]}>
                                        <Headings heading={"Product Sku"} />
                                        <CustTextInput
                                            handleChange={handleChange('product_sku')}
                                            textinputText={values?.product_sku}
                                            handleBlur={handleBlur("product_sku")}
                                            style={appStyles.customInputStyles}
                                        />
                                        {touched.product_sku && errors?.product_sku && <ValidatonErroMsg text={errors?.product_sku} />}

                                    </View>
                                </View>


                                <Headings heading={"Product Caption"} />
                                <CustTextInput
                                    handleChange={handleChange('product_caption')}
                                    textinputText={values?.product_caption}
                                    handleBlur={handleBlur("product_caption")}
                                    style={appStyles.customInputStyles}
                                />
                                {touched.product_caption && errors?.product_caption && <ValidatonErroMsg text={errors?.product_caption} />}
                                <Headings heading={"Product Classification No."} />

                                <CustTextInput
                                    handleChange={handleChange('Product_classification_no')}
                                    textinputText={values?.Product_classification_no}
                                    handleBlur={handleBlur("Product_classification_no")}
                                    style={appStyles.customInputStyles}
                                />
                                {touched.Product_classification_no && errors?.Product_classification_no && <ValidatonErroMsg text={errors?.Product_classification_no} />}


                                <Headings heading={"Choose Product Categories"} />

                                <TouchableOpacity onPress={() => setMddalStates("PRODUCTCATEGORY")} style={{}}>
                                    <RowLayout text={"Select Product Categories"} Icon={<DownArrowBlack />} />
                                </TouchableOpacity>

                                {/* <MultiSelector plcText={"Select Category"}
                                    categoryArray={categoryArray} setCategoryArray={setCategoryArray}
                                    disabled={operationType === "EDIT" || updateProductData ? true : false}
                                    handler={(data) => dropDownHandler(data?.value, "product_category")} data={productCategoryData} keyObject={{ "label": "category_name", "value": "category_id", }} /> */}

                                <Headings heading={"Product Status"} />
                                <View style={appStyles.rowSpaceBetweenAlignCenter}>
                                    <StatusSelectionContainer text={"Active"} Icon={values?.product_status?.status === "active" || values?.product_status === "" ? <SelectRoundBox /> : <UnSelectedRoundBox />} onPress={() => manageProductStatus({ status: "active", value: 1 })} />
                                    <StatusSelectionContainer text={"Suspended"} Icon={values?.product_status?.status === "suspended" ? <SelectRoundBox /> : <UnSelectedRoundBox />} onPress={() => manageProductStatus({ status: "suspended", value: 2 })} />
                                    <StatusSelectionContainer text={"Recalled"} Icon={values?.product_status?.status === "recalled" ? <SelectRoundBox /> : <UnSelectedRoundBox />} onPress={() => manageProductStatus({ status: "recalled", value: 0 })} />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, marginTop: 20 }]}>
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
                                text={operationType !== "ADD" && updateProductData ? 'Updates' : "Save"}
                                onPress={() => formSubmit()}
                                style={[loader ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan]}
                                disabled={loader}
                                isPending={loader}
                            />
                        </View>
                    </View>

                </View>
            </ScrollView>


            <ClientIdModal modalStates={modalStates}
                setMddalStates={setMddalStates}
                handler={handler}
                modalData={clientDetails?.data}
                // setValues={setValues}
                // values={values}
                selectedClient={values?.client_id?.client_name}
                // {...clientDetails}
            />

            <ProductCategorydModal modalStates={modalStates}
                setMddalStates={setMddalStates}
                setValues={setValues}
                values={values}
                categoryArray={categoryArray}
                setCategoryArray={setCategoryArray}
                productCategoryData={productCategoryData}
            />

        </>
    );
};

export default React.memo(ProductAdd);


const StatusSelectionContainer = ({ text, Icon, onPress }) =>
    <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10 }]} onPress={onPress}>
        {Icon}
        <Text style={[appStyles.subHeaderText]}>{text}</Text>
    </TouchableOpacity>


{/* <Headings heading={"Selected Product Categories "} />

                                <View style={[appStyles.customInputStyles, { borderRadius: 10, height: categoryArray?.length > 2 ? 100 : 40, padding: 5 }]}>
                                    <ScrollView nestedScrollEnabled >
                                        <View style={[appStyles.rowSpaceBetweenAlignCenter, { paddingHorizontal: 5, justifyContent: "flex-start", gap: 5, flexWrap: "wrap" }]} >
                                            {
                                                categoryArray?.map((element) => {
                                                    return (
                                                        <TouchableOpacity
                                                            disabled={operationType === "EDIT" || updateProductData ? true : false}
                                                            onPress={() => selectUnSelectCategory(element)} key={element?.id} style={[{ backgroundColor: "#f4f4f4", justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 10, borderRadius: 5, paddingVertical: 5, paddingHorizontal: 5 }]}>
                                                            <Text style={[appStyles.subHeaderText, { fontSize: 12 }]}>{element?.name || ""}</Text>
                                                            <BlackCloseIcon />
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>
                                    </ScrollView>

                                </View> */}




// const categoryUpdatedArray = mapArrayUsingObject(updateProductData?.assigned_categories, { "label": "category_id", "value": "id", "name": "category_id", "id": "id" });
// setCategoryArray(categoryUpdatedArray);
// const selectUnSelectCategory = (value) => setCategoryArray(prev => prev?.some(item => item?.id === value?.id || item?.name === value?.name) ? prev.filter(item => item?.id !== value?.id) : [...prev, value]);
{/* <CustTextInput
                                    handleChange={handleChange('client_id')}
                                    textinputText={values?.client_id}
                                    editable={updateProductData || operationType === "EDIT" ? false : true}
                                    handleBlur={handleBlur("client_id")}
                                    style={appStyles.customInputStyles}
                                /> */}

//  <ProductCategorydModal modalStates={modalStates}
//                         setMddalStates={setMddalStates}
//                         setValues={setValues}
//                         values={values}
//                         {...productCategory}
//                     />

//                     <ClientIdModal modalStates={modalStates}
//                         setMddalStates={setMddalStates}
//                         setValues={setValues}
//                         values={values}
//                         selectedClient={values?.client_id}
//                         {...clientDetails}
//                     /> 