import { FlatList, View, TouchableOpacity, Text, Modal, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { modalstyles } from "../modalstyles"
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../../../Assets/native/images";
import { colors } from "../../../../Assets/native/colors";
import NoRecords from '../../noRecords';

const ProductCategorydModal = ({ modalStates, setMddalStates, setValues, values, categoryArray,
    setCategoryArray,
    productCategoryData,
    // hasNextPage,
    // isMachineListDataPending,
    // fetchNextPage,
    // isFetchingNextPage,
    data: productListing,

}) => {



    console.log(productListing, "===Prid", productCategoryData?.data)
    const dispatch = useDispatch()

    useEffect(() => {
        setValues({ ...values, product_category: categoryArray, selectedProductNo: categoryArray?.length || 0 })
    }, [categoryArray])

    const closeModal = () => setMddalStates(null);


    // const loadMore = () => hasNextPage && fetchNextPage();
    // const renderSpinner = () => <ActivityIndicator color={colors.steelBlue} />;


    // const selectValue = value => {
    //     setSelectedMachineId(value?.name);
    //     setMddalStates(null);

    //     dispatch(setCommonMachineFilter({ idKey: "commonMachineIdFilter", nameKey: "commonMachineName", idValue: value?.id, nameValue: value.name }))
    // };


    // const updatedMachineListData = machineListData && machineListData?.map((item, index) => {
    //     if (index === 0) {
    //         return {
    //             ...item,
    //             name: "All Machine",
    //             id: ""
    //         }
    //     } return item
    // })

    const selectColumns = (id) => {
        if (!categoryArray?.includes(id)) {
            setCategoryArray((prev) => [...prev, id])
        } else {
            const newArray = categoryArray?.filter(item => item !== id);
            setCategoryArray(newArray);
        }
    }

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalStates === "PRODUCTCATEGORY" ? true : false}
            onRequestClose={() => closeModal()}>

            <View style={[modalstyles.main]} >
                <View style={[modalstyles.modalStyle]}>
                    <View
                        style={[
                            appStyles.rowSpaceBetweenAlignCenter,
                            modalstyles.headingContainer,
                        ]}>

                        <Text style={{ fontSize: 14, color: '#222222' }}>
                            Choose Product Category
                        </Text>

                        <TouchableOpacity onPress={() => closeModal()}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={productCategoryData?.data || []}
                        style={{}}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => selectColumns(item?.category_id)}>
                                <View
                                    style={[
                                        appStyles.rowSpaceBetweenAlignCenter, {
                                            justifyContent: undefined,
                                            marginBottom: 10,
                                            padding: 10,
                                            paddingHorizontal: 10,
                                        },
                                    ]}>

                                    {categoryArray?.includes(item?.category_id) ? (<RadioBoxSelected />) : (<RadioBoxUnSelected />)}
                                    <Text style={{ marginLeft: 10, color: colors.mediummBlack }}>
                                        {item?.category_name || ""}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={<NoRecords isPending={false} />}
                    // onEndReached={() => loadMore()}
                    // onEndReachedThreshold={0.2}
                    // ListFooterComponent={isFetchingNextPage ? renderSpinner : null}
                    />



                </View>
            </View>
        </Modal>

    )

}


export default ProductCategorydModal



