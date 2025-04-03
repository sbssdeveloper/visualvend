import React from 'react'
import DatePicker from 'react-native-date-picker'
const DateSelector = ({ isOpen, dateHandler }) => {
 return (
  <DatePicker
   modal
   mode={"date"}
   open={isOpen}
   date={new Date()}
   maximumDate={new Date()}
   onConfirm={(selectedDate) => {
    // selectDate(selectedDate);
    dateHandler(selectedDate)

   }}
   onCancel={() => {
    // setMddalStates(null);
    // setSelectedDay("Custom");
    dateHandler();

   }}
  />
 )
}

export default DateSelector