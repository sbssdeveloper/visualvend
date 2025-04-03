import { FlatList, View, TouchableOpacity, Text, Modal, ActivityIndicator, Animated } from "react-native";
import { useRef, useState } from "react";
import { modalstyles } from "./modalstyles";
import { useDispatch } from "react-redux";
import appStyles from "../../../Assets/native/appStyles";
import { setCommonMachineFilter } from "../../../redux/slices/filterSlice";
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../../Assets/native/images";
import { colors } from "../../../Assets/native/colors";

const MachineIdModal = ({ modalStates, setMddalStates,
    machineDetails: listArray,

}) => {
    const [selecteMachineId, setSelectedMachineId] = useState("All Machine");
    const dispatch = useDispatch()
    const slideAnim = useRef(new Animated.Value(0)).current;


    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: 500,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            setMddalStates(null);
            slideAnim.setValue(0);
        });
    };


    const selectValue = value => {
        setSelectedMachineId(value?.machine_name);
        setMddalStates(null);
        dispatch(setCommonMachineFilter({ idKey: "commonMachineIdFilter", nameKey: "commonMachineName", idValue: value?.id, nameValue: value?.machine_name }))
    };

    const updatedMachineListData = listArray && listArray?.map((item, index) => {
        if (index === 0) {
            return {
                ...item,
                machine_name: "All Machine",
                id: ""
            }
        } return item
    })


    // const loadMore = () => hasNextPage && fetchNextPage();
    const renderSpinner = () => <ActivityIndicator color={colors.steelBlue} />;
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalStates === "selectMachineId" ? true : false}
            onRequestClose={() => closeModal()}>
            <View style={[modalstyles.main]} >

                <Animated.View style={[modalstyles.modalStyle, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={[appStyles.rowSpaceBetweenAlignCenter, modalstyles.headingContainer]}>
                        <Text style={{ fontSize: 14, color: '#222222' }}>
                            Select Machine ID
                        </Text>
                        <TouchableOpacity onPress={() => closeModal()}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <FlatList
                            data={listArray && listArray?.length > 0 ? updatedMachineListData : []}
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
                                        {selecteMachineId === item?.machine_name ? <RadioBoxSelected /> : <RadioBoxUnSelected />}
                                        <Text style={{ marginLeft: 10, color: colors.mediummBlack }}>
                                            {item?.machine_name || ""}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            // onEndReached={() => loadMore()}
                            onEndReachedThreshold={0.6}
                        />
                    </View>
                </Animated.View>
            </View>
        </Modal>
    )
}
export default MachineIdModal



