import React, { useState, useRef } from "react";
import { Modal, View, TouchableOpacity, Text, FlatList, Animated } from "react-native";
import { modalstyles } from "./modalstyles";
import { useDispatch } from "react-redux";
import { setCommonDateFilter } from "../../../redux/slices/filterSlice";
import moment from "moment";
import appStyles from "../../../Assets/native/appStyles";
import { dateTimeMap } from "../../../Helpers/native/constants";
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../../Assets/native/images";
import { colors } from "../../../Assets/native/colors";
import CustStarEndDateSelection from "./customDateSelection";

const DurationModal = ({ modalStates, setMddalStates }) => {
    const [selectedDay, setSelectedDay] = useState("");
    const dispatch = useDispatch();

    const slideAnim = useRef(new Animated.Value(0)).current; // Initial value for the slide animation

    const closeModal = () => {
        // Animate the modal to slide down
        Animated.timing(slideAnim, {
            toValue: 500, 
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            setMddalStates(null);
            setSelectedDay("");
            slideAnim.setValue(0);
        });
    };

    const selectValue = (value, id) => {
        setSelectedDay(value);
        if (id !== "custom") {
            const { lastDatePreviousMonth, lastDateSelectedMonth } = getDateRangeForPreviousMonth();
            closeModal(); // Trigger the close animation
            dispatch(setCommonDateFilter({
                dateKey: "commonDateFilter", dateValue: id === "m" ? lastDatePreviousMonth : dateTimeMap[id],
                showingDateKey: "commonShowingDate", showDateValue: value,
                endDateKey: "commonEndDate", endDateValue: id === "m" ? lastDateSelectedMonth : moment().local().format("YYYY-MM-DD HH:MM"),
            }));
        }
    };

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalStates === "selectDay" ? true : false}
            onRequestClose={() => null}>
            <View style={[modalstyles.main]}>
                <Animated.View
                    style={[  modalstyles.modalStyle,{transform: [{ translateY:slideAnim }]},
                    ]}>
                    <View style={[appStyles.rowSpaceBetweenAlignCenter, modalstyles.headingContainer]}>
                        <Text style={{ fontSize: 14, color: '#222222' }}>Select Date/Time</Text>
                        <TouchableOpacity onPress={closeModal} style={{ padding: 5 }}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>
                    {selectedDay === "Custom" ? (
                        <CustStarEndDateSelection setMddalStates={setMddalStates} setSelectedDay={setSelectedDay} />
                    ) : (
                        <FlatList
                            data={duratinArray}
                            style={{ height: 400 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => selectValue(item?.title, item?.id)}>
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
                                        {selectedDay === item?.title ? <RadioBoxSelected /> : <RadioBoxUnSelected />}
                                        <Text style={{ marginLeft: 10, color: colors.mediummBlack }}>{item.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
};

export default DurationModal;

function getDateRangeForPreviousMonth() {
    const selectedDate = moment().subtract(1, 'months').startOf('month');
    const lastDatePreviousMonth = selectedDate.clone().subtract(1, 'months').endOf('month').format('YYYY-MM-DD HH:MM');
    const lastDateSelectedMonth = selectedDate.clone().endOf('month').format('YYYY-MM-DD HH:MM');
    return { lastDatePreviousMonth, lastDateSelectedMonth };
}

export const duratinArray = [
    { title: '4 hours', id: "4h" },
    { title: 'Today', id: "t" },
    { title: '1 day (last 24 hrs)', id: "1d" },
    { title: '2 day (last 48 hrs)', id: "2d" },
    { title: '3 days', id: "3d" },
    { title: 'Week', id: "7d" },
    { title: 'Last 2 Weeks', id: "14d" },
    { title: 'Last 3 Weeks ', id: "21d" },
    { title: 'Last Month', id: "m" },
    { title: "Custom", id: "custom" }
];
