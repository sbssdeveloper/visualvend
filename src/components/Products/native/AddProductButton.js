import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux';
import { setOperationType, setProudctData } from '../../../redux/slices/productSlice';
import appStyles from '../../../Assets/native/appStyles';
import { Add } from '../../../Assets/native/images';
import { colors } from '../../../Assets/native/colors';
const AddProductButton = ({text,handler}) => {
 const dispatch = useDispatch();

 return (
  <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 1 ,justifyContent:"flex-start"}]} onPress={() => handler()}>
   <Add />
   <Text style={[appStyles.subHeaderText, { color: colors.cyan }]}>{text || "Add"}</Text>
  </TouchableOpacity>
 )
}

export default AddProductButton;

