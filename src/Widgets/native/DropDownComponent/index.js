import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../../../Assets/native/colors';
import { mapArrayUsingObject } from '../commonNativeFunctions';
import { DownArrow } from '../../../Assets/native/images';
import appStyles from '../../../Assets/native/appStyles';
import { useSelector } from 'react-redux';

const CustomDropdownComponent = ({ value, handler, data, keyObject, plcText, style, text, bodyStyle, disabled }) => {
  const [arryData, setArrayData] = useState([]);
  const { operationType, updateProductData } = useSelector(state => state?.productSlice);

  useEffect(() => {
    const modifyDropDownArray = data ? mapArrayUsingObject(data, keyObject) : [];
    setArrayData(modifyDropDownArray);
  }, [data])


  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, bodyStyle, { backgroundColor: operationType === "EDIT" || updateProductData ? colors.veryLightGrey : "transparent" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        // inputSearchStyle={styles.inputSearchStyle}
        search={true}
        inputSearchStyle={styles.selectedTextStyle}
        itemTextStyle={{ color: "black" }}
        iconStyle={styles.iconStyle}
        labelField={"label"}
        disable={disabled}
        data={arryData}
        valueField={value}
        placeholder={plcText}
        value={value}
        onChange={handler}
        renderRightIcon={() =>
          <View style={[appStyles.rowSpaceBetweenAlignCenter, style]}>
            <Text style={[appStyles.subHeaderText, { fontSize: 12 }]}>{text}</Text>
            <DownArrow height={16} width={16} />
          </View>

        } />
    </View>
  );
};

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

export default CustomDropdownComponent;

