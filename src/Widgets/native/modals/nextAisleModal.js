import { FlatList, View, TouchableOpacity, Text, Modal } from "react-native";
import { useState } from "react";
import { modalstyles } from "./modalstyles";
import { useDispatch } from "react-redux";
import appStyles from "../../../Assets/native/appStyles";
import { setCommonMachineFilter } from "../../../redux/slices/filterSlice";
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../../Assets/native/images";


import { colors } from "../../../Assets/native/colors";

const NextAisleModal = ({ modalStates, setMddalStates }) => {
    // const { commonDateFilter, commonMachineIdFilter } = useSelector(state => state.filterSlice);

    const [selectedAisle, setSelectedAisle] = useState("All Aisles");
    const dispatch = useDispatch()



    const closeModal = () => setMddalStates(null);

    const selectValue = value => {
        setSelectedAisle(value?.name);
        setMddalStates(null);

        dispatch(setCommonMachineFilter({ idKey: "commonMachineIdFilter", nameKey: "commonMachineName", idValue: value?.id, nameValue: value.name }))
    };


    // const updatedMachineListData = machineListData && machineListData?.map((item, index) => {
    //     if (index === 0) {
    //         return {
    //             ...item,
    //             name: "All Aisles",
    //             id: ""
    //         }
    //     } return item
    // })




    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalStates === "NEXTAISLEMODAL" ? true : false}
            onRequestClose={() => closeModal()}>

            <View style={[modalstyles.main]} >

                <View style={[modalstyles.modalStyle]}>

                    <View
                        style={[
                            appStyles.rowSpaceBetweenAlignCenter,
                            modalstyles.headingContainer,
                        ]}>

                        <Text style={{ fontSize: 14, color: '#222222' }}>

                            Select Aisle then Next aisle

                        </Text>

                        <TouchableOpacity onPress={() => closeModal()}>

                            <CloseIcon />

                        </TouchableOpacity>

                    </View>

                    <View>

                        <FlatList
                            data={nextAisleModal || []}

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


                                        {selectedAisle === item?.name ? (

                                            <RadioBoxSelected />
                                        ) :

                                            (
                                                <RadioBoxUnSelected />
                                            )}



                                        <Text style={{ marginLeft: 10, color: colors.mediummBlack }}>

                                            {item?.name || ""}

                                        </Text>

                                    </View>

                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    </View>

                </View>

            </View>

        </Modal>
    )

}


export default NextAisleModal



const nextAisleModal = [
    { text: "All Aisle then next aisle", id: 1, value: "" },
    { text: "All Aisle then next aisle", id: 1, value: "" },
    { text: "All Aisle then next aisle", id: 1, value: "" },
    { text: "All Aisle then next aisle", id: 1, value: "" },
    { text: "All Aisle then next aisle", id: 1, value: "" },
    { text: "All Aisle then next aisle", id: 1, value: "" },
    { text: "All Aisle then next aisle", id: 1, value: "" },

]



