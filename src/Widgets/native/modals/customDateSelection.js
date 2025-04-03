import CalendarPicker from "react-native-calendar-picker";
import { View, TouchableOpacity, Text, } from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { setCommonDateFilter } from "../../../redux/slices/filterSlice";
import { colors } from "../../../Assets/native/colors";
import DatePicker from 'react-native-date-picker'


const CustStarEndDateSelection = ({ setMddalStates, setSelectedDay, oneDateSelection }) => {

    const [dateData, setDateData] = useState({
        startDate: null,
        endtDate: null,
        isCalendVisible: false,
        openFor: "Start"
    })

    const dispatch = useDispatch();
    const { startDate, endtDate, isCalendVisible, openFor } = dateData;

    const handleCalender = params => {
        setDateData((prev) => {
            return ({
                ...prev,
                isCalendVisible: true,
                openFor: params
            })
        })
    }

    const selectDate = (date) => {
        const isStart = openFor === "Start";
        const formattedDate = dateFormater(date, true);
        setDateData(prev => ({
            ...prev,
            [isStart ? 'startDate' : 'endtDate']: date,
            openFor: isStart ? 'End' : prev.openFor,
            isCalendVisible: false,
        }));
        if (!isStart) {
            setMddalStates(null);
            setSelectedDay("");
        }
        dispatch(setCommonDateFilter({
            dateKey: "commonDateFilter",
            dateValue: isStart ? formattedDate : dateFormater(startDate, true),
            showingDateKey: "commonShowingDate",
            showDateValue: isStart ? dateFormater(formattedDate || date) : dateFormater(startDate || date),
            endDateKey: "commonEndDate",
            endDateValue: !isStart ? formattedDate : dateFormater(endtDate, true)
        }));
    };

    return (<>
        <View style={[appStyles.mainContainer, appStyles.pv_10, { height: 200 }]}>
            <Text style={[appStyles.subHeaderText, { textAlign: "center", fontSize: 14, marginVertical: 10 }]}>Select: {openFor} Date</Text>
            <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.pv_10, { justifyContent: undefined, gap: 5 }]}>
                <Text style={[appStyles.subHeaderText, { textAlign: "center", fontSize: 14 }]}>
                    Start Date:
                </Text>
                <TouchableOpacity style={{ width: 100, height: 30, backgroundColor: openFor === "Start" ? "#F1F1F1" : "#B5B5B5", borderRadius: 10, justifyContent: "center" }}
                    onPress={() => handleCalender("Start")}>
                    <Text style={[appStyles.subHeaderText, { textAlign: "center", fontSize: 12 }]} >
                        {!startDate ? "Start Date" : moment(startDate).format("YYYY-MM-DD ")}
                    </Text>
                </TouchableOpacity>
                <Text style={[appStyles.subHeaderText, { textAlign: "center", fontSize: 14 }]}>
                    End Date:
                </Text>
                <TouchableOpacity style={{ width: 100, height: 30, backgroundColor: openFor === "End" ? "#F1F1F1" : "#B5B5B5", borderRadius: 10, justifyContent: "center", }}
                    onPress={() => handleCalender("End")}>
                    <Text style={[appStyles.subHeaderText, { textAlign: "center", fontSize: 12 }]}>
                        {!endtDate ? "End Date" : moment(endtDate).format("YYYY-MM-DD ")}
                    </Text>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    backgroundColor: "white",
                    zIndex: 1,
                    marginTop: 20
                }}
            >
                <DatePicker
                    modal
                    mode={"date"}
                    open={isCalendVisible}
                    date={new Date()}
                    maximumDate={new Date()}
                    onConfirm={(selectedDate) => {
                        selectDate(selectedDate);

                    }}
                    onCancel={() => {
                        setSelectedDay("Custom");
                        setDateData((prev) => {
                            return ({
                                ...prev,
                                isCalendVisible: false,
                            })
                        })
                    }}
                />
            </View>
        </View>
    </>)
}
export default CustStarEndDateSelection;



const dateFormater = (date, istimeRequired) => istimeRequired ? moment(date).format("YYYY-MM-DD HH:MM") : moment(date).format("YYYY-MM-DD")


