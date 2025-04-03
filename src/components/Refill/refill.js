import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';

import appStyles from '../../Assets/native/appStyles';
import { colors } from '../../Assets/native/colors';
import Widget from '../../Widgets/native/widget';
import DurationModal from '../../Widgets/native/modals/durationmodal';
import MachineIdModal from '../../Widgets/native/modals/machineIdModal';
import CustomSerach from '../../Widgets/native/customsearch';
import { Add, DownArrowBlack, Edit, Minus } from '../../Assets/native/images';
import { renderers } from 'react-native-popup-menu';
import CustomButton from '../../Widgets/native/customButton';
import AisleModal from '../../Widgets/native/modals/aisleModal';
import ProductModal from '../../Widgets/native/modals/productModal';
import { useDebouncing } from '../../Hooks/useDebounce/useDeboucing';
import useInfiniteFetchData from '../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { machineList } from "../Dashboard/action"
import CustomModal from '../../Widgets/native/customModal';
import useModalStates from '../../Hooks/modalStates/useModalStates';
import useCustomTextData from '../../Hooks/customTextData/useCustomTextData';
import useFetchData from '../../Hooks/fetchCustomData/useFetchData';

const Refill = ({ navigation={} }) => {
    const [modalStates, setModalStates] = useModalStates();
    const [isEditing, setEditing] = useState(false);
    const [searchText, setSearchText] = useCustomTextData();
    const [debounceSearch] = useDebouncing(searchText, 1000);
    const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const makeUpdation = (operationType,) => { }
    const manageModalStatus = (param) => setModalStates(param);
    const handleSubmit = () => { }

    return (
        <SafeAreaView>
            <View style={[appStyles.mainContainer, { paddingHorizontal: undefined, }]} >
                <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />
                <View style={[appStyles.gap_10]}>
                    <Widget setMddalStates={setModalStates} modalStates={modalStates} />
                </View>
                <ScrollView style={{ backgroundColor: colors.appBackground, marginTop: 12 }}>
                    <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground }]}>
                        <View style={[appStyles.pv_10]}>
                            <Text style={[appStyles.subHeaderText, { textAlign: "left", fontSize: 14 }]}>REFILL MENU</Text>
                            <View style={[{ height: 2, width: "100%", backgroundColor: colors.mediummBlack, marginVertical: 5 }]} />
                            <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.pv_20]}>
                                <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10 }]} onPress={() => manageModalStatus("PRODUCTMODAL")}>
                                    <Text style={[appStyles.subHeaderText]}>No Category</Text>
                                    <DownArrowBlack />
                                </TouchableOpacity>

                                <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10 }]} onPress={() => manageModalStatus("PRODUCTMODAL")}>
                                    <Text style={[appStyles.subHeaderText]}>All Products</Text>
                                    <DownArrowBlack />
                                </TouchableOpacity>

                                <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10 }]} onPress={() => manageModalStatus("AISLEMODAL")}>
                                    <Text style={[appStyles.subHeaderText]}>All Aisles</Text>
                                    <DownArrowBlack />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10 }]}>
                            <Text style={[appStyles.subHeaderText, { fontSize: 14, textAlign: "left" }]}>Pepsi 600 ml</Text>
                            <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10 }]} onPress={() => setEditing(!isEditing)}>
                                <Edit />
                                <Text style={[appStyles.subHeaderText, { fontSize: 12, color: colors.cyan }]}>Edit</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.stocklistContainer]}>
                            <FlatList
                                data={stocklistArray}
                                renderItem={({ item, index }) => <ListItems item={item} index={index} isEditing={isEditing} />}
                                nestedScrollEnabled
                                ItemSeparatorComponent={() => <View style={{ height: 2, backgroundColor: "#E2E2E2" }} />}
                            />
                        </View>

                        <View style={{ paddingVertical: 20 }}>
                            <CustomButton
                                text={"Save Changes"}
                                onPress={handleSubmit}
                                style={[true ? appStyles.touchableButtonCyan : appStyles.touchableButtonCyan,]}
                                disabled={false}
                                isPending={false}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>

            <ProductModal
                modalStates={modalStates}
                setMddalStates={setModalStates}
                setSelectedProduct={setSelectedProduct}
                productArray={[]}
            />
            {/* <AisleModal
                modalStates={modalStates}
                setMddalStates={setMddalStates}
            />  */}
            <DurationModal
                modalStates={modalStates}
                setMddalStates={setModalStates}
            />

            <MachineIdModal
                modalStates={modalStates}
                setMddalStates={setModalStates}
                machineDetails={machineDetails?.data}
            />
            {/* <CustomModal text={"update data is here"}/> */}
        </SafeAreaView>
    );

};

export default Refill;


const ListItems = ({ item, index, isEditing }) => {
    const makeUpdation = () => null;
    return (
        <View style={[appStyles.rowSpaceBetweenAlignCenter, { paddingVertical: 20 }]}>
            <Text style={[appStyles.subHeaderText, { fontSize: 10, color: colors.appLightGrey }]}>{item?.heading}</Text>
            <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 5 }]}>
                {
                    index > 0 && isEditing &&
                    <TouchableOpacity onPress={() => makeUpdation("DEC")}>
                        <Minus height={15} width={15} />
                    </TouchableOpacity>
                }
                <Text style={[appStyles.subHeaderText, { fontSize: 12, color: colors.cyan }]}>{item?.value}</Text>
                {
                    index > 0 && isEditing &&
                    <TouchableOpacity onPress={() => makeUpdation("INC")}>
                        <Add height={15} width={15} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    stocklistContainer: {
        backgroundColor: colors.white,
        padding: 10,
        height: 250,
        marginTop: 20,
        borderRadius: 10
    }
})


const stocklistArray = [
    { id: 1, heading: "Current Stock level / Max Quantity Level", value: "158 of 158" },
    { id: 2, heading: "Maximum Quantity per Aisle", value: "158 of 158" },
    { id: 3, heading: "Part fill", value: "4" },
    { id: 4, heading: "No of Aisles with product", value: "3" },
    { id: 5, heading: "Aisle # with product", value: "5" },
    { id: 6, heading: "Space to Sales sequence", value: "3" },
]










