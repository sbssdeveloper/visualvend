import { View, Text } from 'react-native'
import React from 'react'
import { CalenderIcon } from '../../../../Assets/native/images'
import appStyles, { fonts } from '../../../../Assets/native/appStyles'

const RowLayout = ({ text, Icon }) => {
 return (

  <View style={[appStyles.customInputStyles, { borderRadius: 10 }]}>
   <View style={[appStyles.rowSpaceBetweenAlignCenter, { flex: 1, paddingHorizontal: 10 }]}>
    <Text style={[appStyles.subHeaderText,fonts.mediumm, { fontSize: 14 }]}>{text}</Text>
    {Icon && Icon}
   </View>

  </View>
 )
}

export default RowLayout