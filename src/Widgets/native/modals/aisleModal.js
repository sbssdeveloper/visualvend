import { FlatList, View, TouchableOpacity, Text, Modal } from "react-native";
import { useState } from "react";
import { modalstyles } from "./modalstyles";
import { useDispatch } from "react-redux";
import appStyles from "../../../Assets/native/appStyles";
import { setCommonMachineFilter } from "../../../redux/slices/filterSlice";
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../../Assets/native/images";


import { colors } from "../../../Assets/native/colors";
import NoRecords from "../noRecords";

const AisleModal = ({ modalStates, setMddalStates, stockArray, setAisleArray, aislesArray }) => {
    const [selectedAisle, setSelectedAisle] = useState("All Aisles");
    const dispatch = useDispatch()



    const closeModal = () => setMddalStates(null);

    const selectValue = value => {
        setAisleArray(prev => prev.includes(value?.aisle_no) ? prev.filter(item => item !== value?.aisle_no) : [...prev, value?.aisle_no]);
    };


    const updatedMachineListData = stockArray && stockArray?.map((item, index) => {
        // console.log(item)
        return {
            aisle_no: item?.aisle_no,
            id: index
        }
    })

    // const selectAisle = (aisle_no) => setAisleArray(prev => prev.includes(aisle_no) ? prev.filter(item => item !== aisle_no) : [...prev, aisle_no]);


    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalStates === "AISLEMODAL" ? true : false}
            onRequestClose={() => closeModal()}>

            <View style={[modalstyles.main]} >

                <View style={[modalstyles.modalStyle]}>

                    <View
                        style={[
                            appStyles.rowSpaceBetweenAlignCenter,
                            modalstyles.headingContainer,
                        ]}>

                        <Text style={{ fontSize: 14, color: '#222222' }}>

                            Select Aisle No.

                        </Text>

                        <TouchableOpacity onPress={() => closeModal()}>

                            <CloseIcon />

                        </TouchableOpacity>

                    </View>

                    {
                        stockArray?.length > 0 ?
                            <FlatList
                                // data={updatedMachineListData && updatedMachineListData?.length > 0 ? updatedMachineListData : []}
                                data={updatedMachineListData}
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

                                            {aislesArray.includes(item.aisle_no) ? (

                                                <RadioBoxSelected />
                                            ) :
                                                (
                                                    <RadioBoxUnSelected />
                                                )}

                                            <Text style={{ marginLeft: 10, color: colors.mediummBlack }}>

                                                {item?.aisle_no || ""}
                                            </Text>

                                        </View>

                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            :

                            <NoRecords />

                    }

                </View>

            </View>

        </Modal>
    )

}


export default AisleModal



