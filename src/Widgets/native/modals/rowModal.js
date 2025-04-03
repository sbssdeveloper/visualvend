import { FlatList, View, TouchableOpacity, Text, Modal } from "react-native";
import { useState } from "react";
import { modalstyles } from "./modalstyles";
import { useDispatch } from "react-redux";
import appStyles from "../../../Assets/native/appStyles";
import { setCommonMachineFilter } from "../../../redux/slices/filterSlice";
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../../Assets/native/images";


import { colors } from "../../../Assets/native/colors";
import NoRecords from "../noRecords";

const RowModal = ({ modalStates, setMddalStates, rowNumber, setSelectRow }) => {

    const [selectedRow, setSelectedRow] = useState("All Rows");
    const dispatch = useDispatch()
    const closeModal = () => setMddalStates(null);

    const selectValue = value => {
        setSelectedRow(value?.text);
        setMddalStates(null);
        setSelectRow(value)
    };
    const rowArray = createArray(rowNumber);



    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalStates === "ROWMODAL" ? true : false}
            onRequestClose={() => closeModal()}>

            <View style={[modalstyles.main]} >

                <View style={[modalstyles.modalStyle]}>

                    <View
                        style={[
                            appStyles.rowSpaceBetweenAlignCenter,
                            modalstyles.headingContainer,
                        ]}>

                        <Text style={{ fontSize: 14, color: '#222222' }}>

                            Select Row

                        </Text>

                        <TouchableOpacity onPress={() => closeModal()}>

                            <CloseIcon />

                        </TouchableOpacity>

                    </View>

                    <View>

                        {
                            rowNumber > 0 ?


                                <FlatList
                                    data={rowArray || []}

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


                                                {selectedRow === item ? (

                                                    <RadioBoxSelected />
                                                ) :

                                                    (
                                                        <RadioBoxUnSelected />
                                                    )}


                                                <Text style={{ marginLeft: 10, color: colors.mediummBlack }}>

                                                    {item || ""}

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


export default RowModal



const createArray = (length) => Array.from({ length }, (_, index) => index + 1);






