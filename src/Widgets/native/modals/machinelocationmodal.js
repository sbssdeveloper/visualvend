import { Modal, Text, View, TouchableOpacity, FlatList } from "react-native";
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../assets/images";
import { useState } from "react";
import { modalstyles } from "./modalstyles";

const MachineLocationModal = ({ visible, setMddalStates }) => {

    const [selectedLocaion, setSelectedLocation] = useState("");


    const closeModal = () => {

        setMddalStates(prev => {

            return {

                ...prev,

                visible: false,
            };

        });

    };



    const selectValue = value => {


        setSelectedLocation(value);


        setMddalStates(prev => {


            return {

                ...prev,

                selectedLocation: value,

                visible: false

            };

        });
    };




    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible === "selectLocation" ? true : false}
            onRequestClose={() => null}>

            <View style={[modalstyles.main]} >


                <View style={[modalstyles.modalStyle]}>

                    <View
                        style={[
                            appStyles.rowSpaceBetweenAlignCenter,
                            modalstyles.headingContainer,
                        ]}>


                        <Text style={{ fontSize: 14, color: '#222222' }}>

                            Select Location

                        </Text>

                        <TouchableOpacity onPress={() => closeModal()}>

                            <CloseIcon />

                        </TouchableOpacity>

                    </View>

                    <View>

                        <FlatList

                            data={machineLocationArray}

                            style={{ height: 400 }}

                            renderItem={({ item }) => (

                                <TouchableOpacity onPress={() => selectValue(item?.title)}>

                                    <View
                                        style={[
                                            appStyles.rowSpaceBetweenAlignCenter,
                                            {
                                                justifyContent: undefined,
                                                marginBottom: 10,
                                                padding: 5,
                                                paddingHorizontal: 10,
                                            },
                                        ]}>


                                        {selectedLocaion === item?.title ? (

                                            <RadioBoxSelected />
                                        ) :

                                            (
                                                <RadioBoxUnSelected />
                                            )}



                                        <Text style={{ marginLeft: 10 }}>

                                            {item.title}

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
export default MachineLocationModal

const machineLocationArray = [
    { title: 'All Location' },
    { title: 'By Location' },
    { title: 'By Vend Run' },
    { title: 'By Area' },
    { title: 'By Refiller' },
    { title: 'By State' },
    { title: 'By Country' },

];