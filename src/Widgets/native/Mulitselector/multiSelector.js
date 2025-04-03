import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MultiSelect } from 'react-native-element-dropdown';
import { colors } from '../../../Assets/native/colors';
import { useSelector } from 'react-redux';
import { mapArrayUsingObject } from '../commonNativeFunctions';

const MultiSelector = ({ value, categoryArray, setCategoryArray, handler, data, keyObject, plcText, style, text, bodyStyle, disabled }) => {
 const [dropdownList, setDropDownlist] = useState([]);

 const { operationType, updateProductData } = useSelector(state => state?.productSlice);

 useEffect(() => {
  const modifyDropDownArray = data ? mapArrayUsingObject(data, keyObject) : [];
  setDropDownlist(modifyDropDownArray);
 }, [data])



 return (
  <View style={styles.container}>
   <MultiSelect
    style={[styles.dropdown, bodyStyle, { backgroundColor: operationType === "EDIT" || updateProductData ? colors.veryLightGrey : "transparent" }]}
    search
    data={dropdownList}
    labelField="label"
    valueField="value"
    placeholder={plcText}
    value={categoryArray}
    placeholderStyle={styles.placeholderStyle}
    selectedTextStyle={styles.selectedTextStyle}
    inputSearchStyle={styles.selectedTextStyle}
    selectedStyle={{ borderRadius: 5 }}
    itemTextStyle={{ color: "black" }}
    iconStyle={styles.iconStyle}
    onChange={(item) => {
     setCategoryArray(item);
     handler(item)
    }}
   />
  </View>
 )
}

export default MultiSelector


const styles = StyleSheet.create({
 container: {
  backgroundColor: 'white',
  // padding: 16,
  width: "100%"
 },
 dropdown: {
  height: 40,
  borderWidth: 1,
  borderColor: "#E7E7E7",
  borderRadius: 8,
  paddingHorizontal: 8,
  width: "100%",
  
 },
 iconStyle: {
  width: 30,
  height: 30
 },
 placeholderStyle: {
  fontSize: 16,
  color: colors.pureBlack
 },
 selectedTextStyle: {
  fontSize: 12,
  color: "black",
 },
 inputSearchStyle: {
  height: 40,
  color: "blue",
  fontSize: 16,
 },
});