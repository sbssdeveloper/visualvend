import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colors } from '../../../Assets/native/colors';
import { productDetailsvalidationSchema, productNavigationKeys } from '../../../Helpers/native/constants';
import ProductDetials from './productDetials';
import ProductPricing from './productPricing';
import ProductMoreDetails from './productMoreDetails';
import LimitedAccess from './limitedAccess';
import Content from './content';
import ProductAdd from './productAdd';
import ProductImages from './AddProductImages';
import { PRODUCT_ADD_DATA, ProductDetails, productImages, productMoreDetails, productPricing, ageDataObject, informationData } from '../../ProductDetails/consts';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { setOperationType, setProudctData } from '../../../redux/slices/productSlice';
import { addProduct, updateProduct } from '../../ProductDetails/action';
import useMutationData from '../../../Hooks/useCommonMutate';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { showToaster } from '../../../Widgets/native/commonFunction';
import ProductInformation from './ProductInformation';
import { checkRequiredFields } from '../../../Widgets/native/commonNativeFunctions';
import useInvalidateQuery from '../../../Hooks/useInvalidateQuery';
import NavigationHeader from '../../../Widgets/native/navigationHeader';
import CurrentMachineHeader from '../../../Widgets/native/currentMachineHeader';
import { fonts } from '../../../Assets/native/appStyles';
import Surcharges from '../../ProductDetails/web/surcharges'; // Import the Surcharges component

const TopTab = createMaterialTopTabNavigator();

const ProductStack = ({ navigation = {} }) => {

    const [loader, setLoader] = useState(false);
    const { invalidateQuery } = useInvalidateQuery();


    const handleSuccess = (data) => {
        setLoader(false);
        const { success, message, status } = data?.data || {};
        if (success) {
            dataReset();
            showToaster("success", message);
        }
        invalidateQuery("PRODUCTLIST");

    }

    const productUpdateSuccess = (data) => {
        setLoader(false);
        const { success, message, status } = data?.data || {};
        if (success) {
            dataReset();
            showToaster("success", message)
        }
    }

    const addProudctErrorHandler = () => {
        showToaster("error", "Some field are missing or repeated ...Please try again");
        dataReset();
    }

    const updateProudctErrorHandler = (error) => {
        showToaster("error", error?.data?.message || "something went wrong");
        dataReset();
    }

    const dispatch = useDispatch();
    const { operationType, updateProductData } = useSelector(state => state?.productSlice);
    const addProductRequest = useMutationData(addProduct, (data) => handleSuccess(data), (error) => addProudctErrorHandler(error));
    const updateProductMutation = useMutationData(updateProduct, (data) => productUpdateSuccess(data), (error) => updateProudctErrorHandler(error));
    const mergeObjects = (...objects) => objects.reduce((acc, obj) => ({ ...acc, ...obj }), {});

    const initialValues = mergeObjects(
        ProductDetails,
        productPricing,
        productMoreDetails,
        productImages,
        ageDataObject,
        PRODUCT_ADD_DATA,
        informationData
    );

    const formikInstace = useFormik({
        initialValues: initialValues,
        validationSchema: productDetailsvalidationSchema,
        onSubmit: (values) => {
            const { success, missingField } = checkRequiredFields(values);
            if (!success) {
                alert(missingField);
                setLoader(false);
                return
            }

            setLoader(true);

            if (operationType === "EDIT" && updateProductData) {
                const { bundle_price } = values || {};
                const dataPayload = {
                    ...values,
                    uuid: updateProductData?.uuid,
                    others: {
                        ...PRODUCT_ADD_DATA?.others,
                        bundle_price,
                    }
                }
                updateProductMutation.mutate(dataPayload);

            } else {
                const { product_category, bundle_price, client_id, more_product_images_1, more_product_images_2, more_product_images_3 } = values;
                const dataPayload = {
                    ...values,
                    client_id: client_id?.id,
                    product_status: 1,
                    product_category: product_category.product_category?.map((el) => el).join(","),
                    others: {
                        ...PRODUCT_ADD_DATA?.others,
                        bundle_price,
                    }
                }
                addProductRequest.mutate(dataPayload);
            }
        }
    });


    const reFillFields = () => {
        formikInstace?.setValues({
            product_name: updateProductData?.product_name || "",
            selectedProductNo: updateProductData?.assigned_categories ? updateProductData?.assigned_categories?.length : 0,
            product_description: updateProductData?.product_description || "",
            product_id: updateProductData?.product_id || "",
            product_category: updateProductData?.assigned_categories,
            product_description: updateProductData?.product_description || "",
            more_info_text: updateProductData?.more_info_text || "",
            promo_text: updateProductData?.promo_text || "",
            product_price: String(updateProductData?.product_price || ""),
            discount_price: String(updateProductData?.discount_price || ""),
            product_discount_code: String(updateProductData?.product_discount_code || ""),
            bundle_price: "1",
            product_image: updateProductData?.product_image,
            product_more_info_image: updateProductData?.product_more_info_image,
            product_image_thumbnail: updateProductData?.product_image_thumbnail,
            product_status: { status: updateProductData?.product_status === 1 ? "active" : updateProductData?.product_status === 2 ? "suspended" : "recalled", value: updateProductData?.product_status }
        });
    };

    useEffect(() => {
        if (operationType === "EDIT" && updateProductData) reFillFields()
    }, [])

    const dataReset = () => {
        formikInstace.resetForm();
        dispatch(setOperationType(null))
        dispatch(setProudctData(null));
        setLoader(false);
        navigation?.goBack();
    }

    const backHandler = () => {
        dispatch(setOperationType(null))
        dispatch(setProudctData(null));
        navigation.goBack()
    }


    return (
        <>
            <NavigationHeader navigation={navigation} />
            <CurrentMachineHeader showDrawerIcon={false} text={"Products"} handler={() => backHandler()} />
            <TopTab.Navigator
                initialRouteName='Details'
                screenOptions={{
                    tabBarLabelStyle: [{ fontSize: 11, textTransform: 'none', color: "#222222", width: 100 }, fonts.semiBold],
                    tabBarItemStyle: { width: 80, paddingHorizontal: 5, },
                    tabBarActiveTintColor: colors.appBackground,
                    tabBarInactiveTintColor: colors.appBackground,
                    tabBarIndicatorStyle: { backgroundColor: colors.cyan },
                    tabBarStyle: { backgroundColor: colors.appBackground, elevation: 0 },
                    tabBarScrollEnabled: true
                }}
            >
                <TopTab.Screen name={productNavigationKeys.productdetails}>
                    {() => <ProductAdd formikInstace={formikInstace}
                        dataReset={dataReset} loader={loader}
                    />}
                </TopTab.Screen>


                {/* <TopTab.Screen name={productNavigationKeys.productinformation} >
                    {() => <ProductInformation formikInstace={formikInstace}
                        dataReset={dataReset} loader={loader}
                    />}
                </TopTab.Screen> */}


                <TopTab.Screen name={productNavigationKeys.productmoredetails}>
                    {() => <ProductMoreDetails formikInstace={formikInstace}
                        dataReset={dataReset} loader={loader}
                    />}
                </TopTab.Screen>

                <TopTab.Screen name={productNavigationKeys.productpricing}>
                    {() => <ProductPricing formikInstace={formikInstace}
                        loader={loader}
                        dataReset={dataReset}
                    />}
                </TopTab.Screen>
                <TopTab.Screen name={productNavigationKeys.limitedaccess} >
                    {() => <LimitedAccess dataReset={dataReset} loader={loader} formikInstace={formikInstace} />}
                </TopTab.Screen>
                {/* 
                <TopTab.Screen name={productNavigationKeys.content}>
                    {() => <Content dataReset={dataReset} loader={loader} formikInstace={formikInstace} />}
                </TopTab.Screen> */}

                <TopTab.Screen name={productNavigationKeys.productImage}>
                    {() => <ProductImages formikInstace={formikInstace} dataReset={dataReset}
                        loader={loader} setLoader={setLoader}
                    />}
                </TopTab.Screen>
                <TopTab.Screen name="Surcharges">
                    {() => <Surcharges control={formikInstace.control} onSubmit={formikInstace.handleSubmit} />}
                </TopTab.Screen>
            </TopTab.Navigator>

        </>
    )
}

export default ProductStack;






