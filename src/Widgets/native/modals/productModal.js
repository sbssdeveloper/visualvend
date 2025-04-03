import { FlatList, View, TouchableOpacity, Text, Modal } from "react-native";
import { useMemo, useState } from "react";
import { modalstyles } from "./modalstyles";
import { useDispatch } from "react-redux";
import appStyles from "../../../Assets/native/appStyles";
import { setCommonMachineFilter } from "../../../redux/slices/filterSlice";
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../../Assets/native/images";

import { colors } from "../../../Assets/native/colors";
import NoRecords from "../noRecords";

const ProductModal = ({ modalStates, setMddalStates, setSelectedProduct, productArray }) => {

    const [selectedProduct, selectProduct] = useState("All Products");

    const dispatch = useDispatch()

    const productArrayForList = useMemo(() => {
        const seenProductIds = new Set();
        const resultArray = productArray?.flatMap((dataRow, rowIndex) =>
            dataRow
                .filter(cell => {
                    const productId = cell?.product_id;
                    if (productId && !seenProductIds.has(productId)) {
                        seenProductIds.add(productId);
                        return true;
                    }
                    return false;
                })
                .map(cell => ({
                    productName: cell?.product_name,
                    productId: cell?.product_id,
                }))
        ) || [];

        // Add default entry at the beginning
        if (resultArray.length > 0) {
            resultArray.unshift({
                productName: "All Products",
                productId: "",
            });
        }

        return resultArray;
    }, [productArray]);



    const closeModal = () => setMddalStates(null);

    const selectValue = value => {
        selectProduct(value?.productName);
        setSelectedProduct(value);
        setMddalStates(null);
        // dispatch(setCommonMachineFilter({ idKey: "commonMachineIdFilter", nameKey: "commonMachineName", idValue: value?.id, nameValue: value.name }))
    };


    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalStates === "PRODUCTMODAL" ? true : false}
            onRequestClose={() => closeModal()}>

            <View style={[modalstyles.main]} >

                <View style={[modalstyles.modalStyle]}>

                    <View
                        style={[
                            appStyles.rowSpaceBetweenAlignCenter,
                            modalstyles.headingContainer,
                        ]}>

                        <Text style={{ fontSize: 14, color: '#222222' }}>

                            Select Product

                        </Text>

                        <TouchableOpacity onPress={() => closeModal()}>

                            <CloseIcon />

                        </TouchableOpacity>

                    </View>

                    <View>

                        {
                            productArrayForList?.length > 0 ?


                                <FlatList
                                    data={productArrayForList && productArrayForList?.length > 0 ? productArrayForList : []}

                                    style={{ height: 400 }}

                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => selectValue(item)}>

                                            <View
                                                style={[
                                                    appStyles.rowSpaceBetweenAlignCenter,
                                                    {
                                                        justifyContent: undefined,
                                                        marginBottom: 10,
                                                        padding: 10,
                                                        paddingHorizontal: 10,
                                                    },
                                                ]}>


                                                {selectedProduct === item?.productName ? (

                                                    <RadioBoxSelected />
                                                ) :

                                                    (
                                                        <RadioBoxUnSelected />
                                                    )}



                                                <Text style={{ marginLeft: 10, color: colors.mediummBlack }}>

                                                    {item?.productName || ""}

                                                </Text>

                                            </View>

                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />

                                :
                                <View style={{ height: "80%" }}>
                                    <NoRecords />
                                </View>

                        }
                    </View>

                </View>

            </View>

        </Modal>
    )

}


export default ProductModal



