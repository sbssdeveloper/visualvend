import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import appStyles from '../../../../Assets/native/appStyles'
import { colors } from '../../../../Assets/native/colors';

const SelectOneValue = ({ option1, option2, heading, style, headstyle, selectionHandler }) => {
  return (
    <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
      <View style={[{ flex: 2 }, headstyle]}>
        <Text style={[appStyles.subHeaderText]}>{heading}</Text>
      </View>

      <TouchableOpacity style={[{ flex: 1.2 }, style]} onPress={() => selectionHandler({key:"product_age_verify_required",value:true})}>
        <Text style={[appStyles.subHeaderText, { color: colors.cyan }]}>{option1}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[{ flex: 0.7 }, style]} onPress={() => selectionHandler({key:"product_age_verify_required",value:false})}>
        <Text style={[appStyles.subHeaderText, { color: colors.appRed }]}>{option2}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SelectOneValue