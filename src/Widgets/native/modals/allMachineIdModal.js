import { FlatList, View, TouchableOpacity, Text, Modal } from "react-native";

import { useState } from "react";
import { modalstyles } from "./modalstyles";



import { colors } from "../../../Assets/native/colors";
import appStyles from "../../../Assets/native/appStyles";
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../../Assets/native/images";
import useInfiniteFetchData from "../../../Hooks/fetchCustomInfiniteData/useFetchInfineData";
import { machineList } from "../../../components/Dashboard/action";

const AllMachineIdModal = ({ modalStates, setMddalStates }) => {

    const [selecteMachineId, setSelectedMachineId] = useState("All Machine");

    const { data: machineListData } = useInfiniteFetchData({ "type": "list", "length": 10, key: "getMachineList", fn: machineList });


    const closeModal = () => {

        setMddalStates(prev => {

            return {

                ...prev,
                isVisible: false,
            };

        });

    };



    const selectValue = value => {

        setSelectedMachineId(value?.machine_name);

        setMddalStates(prev => {

            return {

                ...prev,

                selectMachineId: value?.id,

                selectMachineName: value?.machine_name,

                isVisible: false

            };

        });
    };


    // console.log(machineListData)

    const updatedMachineListData = machineListData && machineListData?.map((item, index) => {
        if (index === 0) {
            return {
                ...item,
                machine_name: "All Machine",
                id: ""
            }
        } return item
    })


    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalStates?.isVisible === "allMachineId" ? true : false}
            onRequestClose={() => closeModal()}>

            <View style={[modalstyles.main]} >

                <View style={[modalstyles.modalStyle]}>

                    <View
                        style={[
                            appStyles.rowSpaceBetweenAlignCenter,
                            modalstyles.headingContainer,
                        ]}>

                        <Text style={{ fontSize: 14, color: '#222222' }}>

                            Select Machine

                        </Text>

                        <TouchableOpacity onPress={() => closeModal()}>

                            <CloseIcon />

                        </TouchableOpacity>

                    </View>

                    <View>

                        <FlatList
                            numColumns={2}
                            data={updatedMachineListData || []}
                            style={{ height: 400 }}
                            renderItem={({ item }) => (

                                <TouchableOpacity onPress={() => selectValue(item)}>

                                    <View
                                        style={[
                                            appStyles.rowSpaceBetweenAlignCenter,
                                            {
                                                justifyContent: undefined,
                                                marginBottom: 10,
                                                padding: 5,
                                                paddingHorizontal: 10,
                                                width: 180,

                                            },
                                        ]}>

                                        {selecteMachineId === item?.machine_name ? (

                                            <RadioBoxSelected />
                                        ) :

                                            (
                                                <RadioBoxUnSelected />
                                            )}

                                        <Text style={{ marginLeft: 10, color: colors.mediummBlack }}>

                                            {item?.machine_name || ""}

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


export default AllMachineIdModal


