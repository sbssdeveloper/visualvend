import React, { useState, useRef } from "react";
import { FlatList, Text, View, Modal, TouchableOpacity, Animated } from "react-native";
import { modalstyles } from "../../../Widgets/native/modals/modalstyles";
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../../Assets/native/images";
import { colors } from "../../../Assets/native/colors";
import useSelectedValue from "../../../Hooks/reportDropdownSelectionData/useSelectedValue";
import { paymentStatusArray } from "../constant";

const PaymentStatusModal = ({ modalStates, setMddalStates,resetParams }) => {
    const [selectedValue, setSelectedValue] = useSelectedValue();
    const slideAnim = useRef(new Animated.Value(0)).current; // Initial value for the slide animation

    const closeModal = () => {
        // Animate the modal to slide down
        Animated.timing(slideAnim, {
            toValue: 300, // Slide down by 300 units (adjust as necessary)
            duration: 500, // Duration of the animation
            useNativeDriver: true,
        }).start(() => {
            // After the animation completes, hide the modal
            setMddalStates(prev => ({
                ...prev,
                isVisible: false,
            }));
            // Reset the animation value for the next time the modal opens
            slideAnim.setValue(0);
        });
    };

    const selectValue = (item) => {
        setSelectedValue(item?.title);
        setMddalStates((prev) => {
            return {
                ...prev,
                selectValue: item?.title,
                payloadValue: item?.value,
                isVisible: false,
            };
        });
        resetParams && resetParams()
    };


    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalStates?.isVisible === "paymentActivity"}
            onRequestClose={() => null}>
            <View style={[modalstyles.main]}>
                <Animated.View
                    style={[
                        modalstyles.modalStyle,
                        {
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}>
                    <View style={[appStyles.rowSpaceBetweenAlignCenter, modalstyles.headingContainer]}>
                        <Text style={{ fontSize: 14, color: '#222222' }}>Select Payment Status</Text>
                        <TouchableOpacity onPress={closeModal}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <FlatList
                            data={paymentStatusArray}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => selectValue(item)}>
                                    <View
                                        style={[
                                            appStyles.rowSpaceBetweenAlignCenter,
                                            {
                                                justifyContent: undefined,
                                                marginBottom: 10,
                                                padding: 10,
                                                paddingHorizontal: 20,
                                            },
                                        ]}>
                                        {selectedValue === item?.title ? (
                                            <RadioBoxSelected />
                                        ) : (
                                            <RadioBoxUnSelected />
                                        )}
                                        <Text style={{ marginLeft: 10, color: colors.mediummBlack }}>
                                            {item?.title}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default PaymentStatusModal;