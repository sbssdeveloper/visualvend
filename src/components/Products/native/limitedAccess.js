import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
// import BarcodeLinker from './barcodeLinker'
import { productStyles } from './productstyle'
import { colors } from '../../../Assets/native/colors'
import appStyles from '../../../Assets/native/appStyles'
import IncrementDecrementWidget from '../../../Widgets/native/incrementDecrementWidget'
import CustomButton from '../../../Widgets/native/customButton'
import { getDimensions, navigationKeys, productNavigationKeys } from '../../../Helpers/native/constants'
import CustomDropDown from '../../../Widgets/native/customDropDown'
import CustTextInput from "../../../Widgets/native/customTextInput/index"
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import Headings from "./Headings/index"
import { DownArrow, ScanIcon } from '../../../Assets/native/images'
import RowLayout from './RowLayout'
import SelectOneValues from "./SelectOneValue/index"
import RowWithMultipleColumn from './RowWithMultipleColumn'
import TextAndDrop from './TextAndDrop'
import CustomDropdownComponent from '../../../Widgets/native/DropDownComponent'
import { checkRequiredFields } from '../../../Widgets/native/commonNativeFunctions'

const LimitedAccess = ({ dataReset, formikInstace, loader, route: { params } = {} }) => {
    const { operationType, updateProductData, productClient } = useSelector(state => state?.productSlice);
    // const [product_age_verify_required, setVerificationEnable] = useState(false);
    const [age, setAge] = useState(10);
    // const [dropDownData, setDropDownData] = useState(null);
    // const dispatch = useDispatch();
    const textInputRef = useRef(null);
    // const navigation = useNavigation();

    const { height } = getDimensions();
    const { values, setFieldValue, handleSubmit: formikSubmit, } = formikInstace;

    useEffect(() => {
        if (operationType === "EDIT" && updateProductData) {
            if (updateProductData?.product_age_verify_minimum && !age) {
                textInputRef?.current?.setNativeProps({ text: updateProductData?.product_age_verify_minimum?.toString() });
            }
        }
    }, [updateProductData, operationType]);

    const submitData = () => {
        setFieldValue("product_age_verify_minimum", age);
        const { success, missingField } = checkRequiredFields(values);
        if (!success) {
            alert(missingField);
            return
        }
        formikSubmit();
    }

    // const handleValues = (text) => (/^\d{0,3}$/.test(text)) && setAge(text);
    const handler = ({ value } = {}) => setFieldValue("verification_method", value);
    const updateAge = (isIncrement) => {
        setAge((prevAge) =>
            isIncrement ? prevAge + 1 : Math.max(prevAge - 1, 0)
        );
    };

    const selectionHandler = (data) => {
        const { key, value } = data;
        setFieldValue(key, value);
    }

    return (
        <View style={{ height: height, backgroundColor: colors.appBackground, flex: 1 }}>
            <View style={[productStyles.container, productStyles.gap_5,]}>
                <View style={[productStyles.container, { gap: 10 }]}>
                    <SelectOneValues heading={"Age Verification enabled for this product ?"} option1={"Yes"} option2={"No"}
                        style={productStyles.limitetAccessSelectStyle}
                        headstyle={appStyles.flx2}
                        selectionHandler={selectionHandler}
                    />
                    {values.product_age_verify_required &&
                        <>
                            <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                                <Text style={[appStyles.subHeaderText]}>{"Minimum Verify Age"}</Text>
                                <IncrementDecrementWidget value={age} decremental={() => updateAge()} incremental={() => updateAge(true)} />
                            </View>
                            <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                                <Text style={[appStyles.subHeaderText]}>{"Verify Age With"}</Text>
                                <View style={{ flex: 0.9 }}>
                                    <CustomDropdownComponent plcText={values?.verification_method === "A" ? "Age Verification" : "Yoti"} value={values?.verification_method} handler={(value) => handler(value)} bodyStyle={{ height: 40 }} data={[{ "label": "Age Verification", "value": "A" }, { "label": "Yoti", "value": "Y" }]} />
                                </View>
                                {/* <TextAndDrop text={"Age Verifcation"} Icon={<DownArrow />} /> */}
                            </View>
                        </>
                    }
                </View>
            </View>

            <View style={[appStyles.rowSpaceBetweenAlignCenter, { position: "absolute", bottom: 20 }]}>
                <View style={{ flex: 0.5 }}>
                    <CustomButton
                        text={"Cancel"}
                        onPress={() => dataReset()}
                        style={[
                            appStyles.touchableButtonCyan,
                            { backgroundColor: "white" }
                        ]}
                        disabled={loader}
                        isPending={false}
                        textClr={colors.appLightGrey}
                    />
                </View>
                <View style={{ flex: 0.5 }}>
                    <CustomButton
                        text={operationType !== "ADD" && updateProductData  ? 'Updates' : "Save"}
                        onPress={submitData}
                        style={[loader ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan,]}
                        disabled={loader}
                        isPending={loader}
                    />
                </View>
            </View>
        </View>
    )
}

export default LimitedAccess

// const ageDropdown = [
//     { id: 1, keyName: "AGE", value: "A" },
//     { id: 2, keyName: "YOTI", value: "Y" }
// ]

// const TermsApprioval = ({ text, lastText, unique, setVerificationEnable }) => {
//     return (
//         <View style={[appStyles.rowSpaceBetweenAlignCenter, { alignItems: unique ? "flex-start" : "center" }]}>
//             <View style={{ flex: 7 }}>
//                 <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>{text}</Text>
//                 <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>{lastText}</Text>
//             </View>
//             {
//                 !unique ? (

//                     <View style={[appStyles.rowSpaceBetweenAlignCenter, { flex: 3, justifyContent: "center", gap: 20 }]}>
//                         <TouchableOpacity onPress={() => setVerificationEnable(true)}>
//                             <Text style={[appStyles.subHeaderText, { color: colors.cyan }]}>Yes</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity onPress={() => setVerificationEnable(false)}>
//                             <Text style={[appStyles.subHeaderText, { color: colors.cyan }]}>No</Text>
//                         </TouchableOpacity>
//                     </View>
//                 ) : (
//                     <IncrementDecrementWidget value={"nnnnnnn"} />
//                 )
//             }
//         </View>

//     )
// }


{/* <CustTextInput
                                    handleChange={handleChange('product_id')}
                                    textinputText={values?.product_id}
                                    editable={updateProductData ? true : false}
                                    style={appStyles.customInputStyles}

                                />  */}


{/* <TermsApprioval text={"Age Verification enabled for this "} lastText={"product?"} setVerificationEnable={setVerificationEnable} /> */ }



{/* 
                <Text style={[appStyles.headerText, { fontSize: 14, textAlign: "left", marginVertical: 10 }]}>Assets Tracking</Text>

                <View style={[productStyles.container, { gap: 10 }]}>
                    <SelectOneValues heading={"User ID required to access this product? ?"} option1={"Yes"} option2={"No"}
                        style={productStyles.limitetAccessSelectStyle}
                        headstyle={appStyles.flx2}
                    />

                    <SelectOneValues heading={"Display price of product during access?"} option1={"Yes"} option2={"No"}
                        style={productStyles.limitetAccessSelectStyle}
                        headstyle={appStyles.flx2}

                    />
                    <SelectOneValues heading={"Limit Quantity/Access per user ?"} option1={"Yes"} option2={"No"}
                        style={productStyles.limitetAccessSelectStyle}
                        headstyle={appStyles.flx2}

                    />

                </View> */}



{/* {
                    product_age_verify_required &&
                    <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start" }]}>
                        <Text style={[appStyles.headerText, { textAlign: "left", fontSize: 14 }]}>{"Select age verification method"}</Text>

                        <CustomDropDown listItem={ageDropdown} width={100}
                            setValues={setDropDownData}
                        />
                    </View>
                } */}

{/* <View style={[appStyles.pv_20, { gap: 10 }]}>
                    <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>{"Age Verification :"}</Text>
                    <CustTextInput
                        handleChange={(text) => handleValues(text)}
                        textinputText={age}
                        style={{ backgroundColor: "white" }}
                        placeholder={"Enter your minimum verify age"}
                        keyboardType={"numeric"}
                        maxLength={3}
                        textInputRef={textInputRef}
                    />
                </View> */}


{/* <View style={[productStyles.container, { gap: 10 }]}>
                    <Headings heading={"QR Access Code"} icon={<ScanIcon />} />
                    <RowLayout text={"mmm"} Icon={<DownArrow />} />
                    <Headings heading={"Barcode"} icon={<ScanIcon />} />
                    <RowLayout text={"mmm"} Icon={<DownArrow />} />
                    <Headings heading={"Product Link"} icon={<ScanIcon />} />
                    <RowLayout text={"mmm"} Icon={<DownArrow />} />
                </View> */}

{/* <Text style={[appStyles.headerText, { fontSize: 14, textAlign: "left", marginVertical: 10 }]}>Access Control</Text> */ }