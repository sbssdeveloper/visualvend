import { View, Text, ScrollView, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { colors } from '../../../Assets/native/colors';
import appStyles from '../../../Assets/native/appStyles';
import { productStyles } from './productstyle';
import CustomButton from '../../../Widgets/native/customButton';
import { useNavigation } from '@react-navigation/native';
import { productNavigationKeys, moreDetailsSchema, getDimensions } from '../../../Helpers/native/constants';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ValidatonErroMsg } from '../../../Widgets/native/ValidationErrors';
import CustTextInput from "../../../Widgets/native/customTextInput/index";
import { useSelector } from 'react-redux';
import { productMoreDetails } from '../../ProductDetails/consts';
import { DownArrow, GreyDownArrow, ScanIcon } from '../../../Assets/native/images';
import Headings from './Headings';
import RowLayout from './RowLayout';
import TextAndDropper from './TextAndDrop';
import TextAndDrop from './TextAndDrop';
import IncrementDecrementWidget from '../../../Widgets/native/incrementDecrementWidget';
import RowWithMultipleColumn from './RowWithMultipleColumn';
import { checkRequiredFields } from '../../../Widgets/native/commonNativeFunctions';

const ProductMoreDetails = ({ formikInstace, dataReset, loader, route: { params } = {} }) => {
  const { height } = getDimensions();
  const devHeight = height;
  const { operationType, updateProductData } = useSelector(state => state?.productSlice);
  const navigation = useNavigation();
  const { handleChange, handleBlur, handleSubmit: formikSubmit, values, errors, setValues, resetForm, touched } = formikInstace || {};

  const submitData = () => {
    const { success, missingField } = checkRequiredFields(values);
    if (!success) {
      alert(missingField);
      return;
    }
    formikSubmit();
  };


  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex:1 }}>
        <View style={[productStyles.container, productStyles.gap_5]}>
          <Headings heading={"Product Description "} />
          <CustTextInput
            handleChange={handleChange('product_description')}
            textinputText={values?.product_description}
            handleBlur={handleBlur("product_description")}
            lines={5}
            style={{ maxHeight: 70, textAlignVertical: "top", ...appStyles.customInputStyles, height: 100 }}
          />
          {touched.product_description && errors.product_description && <ValidatonErroMsg text={errors.product_description} />}

          <Headings heading={"More Info Text "} />
          <CustTextInput
            handleChange={handleChange('more_info_text')}
            textinputText={values?.more_info_text}
            handleBlur={handleBlur("more_info_text")}
            lines={5}
            style={{ maxHeight: 70, textAlignVertical: "top", ...appStyles.customInputStyles, height: 100 }}

          />
          {touched.more_info_text && errors.more_info_text && <ValidatonErroMsg text={errors.more_info_text} />}

          <Headings heading={"Promotional Text "} />
          <CustTextInput
            handleChange={handleChange('promo_text')}
            textinputText={values?.promo_text}
            handleBlur={handleBlur("promo_text")}
            lines={5}
            style={{ maxHeight: 70, textAlignVertical: "top", ...appStyles.customInputStyles, height: 100 }}

          />
          {touched.promo_text && errors.promo_text && <ValidatonErroMsg text={errors.promo_text} />}
        </View>

        <View style={[appStyles.rowSpaceBetweenAlignCenter, { position: "absolute", bottom: 20 }]}>
          <View style={{ flex: 0.5 }}>
            <CustomButton
              text={"Cancel"}
              onPress={() => dataReset()}
              style={[loader ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan, { backgroundColor: "white" }]}
              disabled={loader}
              isPending={loader}
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

export default ProductMoreDetails;
