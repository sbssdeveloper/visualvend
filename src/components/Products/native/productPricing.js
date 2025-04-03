import { View, Text, ScrollView, TouchableOpacity, } from 'react-native';
import React from 'react';
import { productStyles } from './productstyle';
import appStyles from '../../../Assets/native/appStyles';
import { colors } from '../../../Assets/native/colors';
import CustomButton from '../../../Widgets/native/customButton';
import { ValidatonErroMsg } from '../../../Widgets/native/ValidationErrors';
import CustTextInput from "../../../Widgets/native/customTextInput/index";
import { useSelector } from 'react-redux';
import { getDimensions } from '../../../Helpers/native/constants';

import Headings from './Headings';
import { checkRequiredFields, generateRandomString, handleValues } from '../../../Widgets/native/commonNativeFunctions';

const ProductPricing = ({ formikInstace, dataReset, loader, route: { params } = {} }) => {
    const { height } = getDimensions();
    const devHeight = height;
    const { operationType,updateProductData } = useSelector(state => state?.productSlice);

    const { handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm, setValues, handleSubmit: formikSubmit } = formikInstace;
    const submitData = () => {
        const { success, missingField } = checkRequiredFields(values);
        if (!success) {
            alert(missingField);
            return
        }
        handleSubmit()
    }

    const randomString = () => setFieldValue("product_discount_code", (generateRandomString()));


    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={{ height: devHeight - 300, backgroundColor: colors.appBackground, flex: 1 }}>
                <View style={[productStyles.container, productStyles.gap_5]}>
                    <Headings heading={"Product Price"} />
                    <CustTextInput
                        handleChange={(text) => handleValues("product_price", text, setValues, values)}
                        textinputText={values?.product_price}
                        handleBlur={handleBlur("product_price")}
                        keyboardType={"numeric"}
                        maxLength={10}
                        style={{ maxHeight: 70, textAlignVertical: "top", ...appStyles.customInputStyles }}
                    />
                    {touched.product_price && errors?.product_price && <ValidatonErroMsg text={errors?.product_price} />}
                    <Headings heading={"Discount Price"} />
                    <CustTextInput
                        handleChange={(text) => handleValues("discount_price", text, setValues, values)}
                        textinputText={values?.discount_price}
                        handleBlur={handleBlur("discount")}
                        keyboardType={"numeric"}
                        maxLength={10}
                        // editable={false}
                        style={{ maxHeight: 70, textAlignVertical: "top", ...appStyles.customInputStyles }}
                    />
                    <View style={[appStyles.rowSpaceBetweenAlignCenter, { marginVertical: 10 }]}>
                        <Headings heading={"Discount Codes"} rightText={"+ Add Code"} addBtn={true} />
                        <TouchableOpacity onPress={() => randomString()}>
                            <Text style={[appStyles.subHeaderText, { color: colors.appCyan }]}> {"+ Add Code"}</Text>
                        </TouchableOpacity>
                    </View>
                    <CustTextInput
                        handleChange={(text) => handleValues("discount_price", text, setValues, values)}
                        textinputText={values?.product_discount_code}
                        handleBlur={handleBlur("discount")}
                        keyboardType={"numeric"}
                        maxLength={10}
                        // editable={false}
                        style={{ maxHeight: 70, textAlignVertical: "top", ...appStyles.customInputStyles }}
                    />
                    <Headings heading={"Bundle Price"} />
                    <CustTextInput
                        handleChange={(text) => handleValues("bundle_price", text, setValues, values)}
                        textinputText={values?.bundle_price}
                        handleBlur={handleBlur("bundle_price")}
                        keyboardType={"numeric"}
                        maxLength={10}
                        style={{ maxHeight: 70, textAlignVertical: "top", ...appStyles.customInputStyles }}
                    />
                    {touched.bundle_price && errors?.bundle_price && <ValidatonErroMsg text={errors?.bundle_price} />}
                </View>

                <View style={[appStyles.rowSpaceBetweenAlignCenter, { position: "absolute", bottom: 20 }]}>
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
                            onPress={() => submitData()}
                            style={[loader ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan]}
                            disabled={loader}
                            isPending={loader}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default ProductPricing;

