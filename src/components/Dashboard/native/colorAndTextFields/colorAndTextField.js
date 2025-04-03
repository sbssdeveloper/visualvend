import { View, Text } from 'react-native'
import React from 'react'
import SmallColorBox from '../../../../Widgets/native/smallColorBox'
import appStyles, { fonts } from '../../../../Assets/native/appStyles'
import { colors } from '../../../../Assets/native/colors'


const ColorAndTextField = ({ heading, value, clr }) => {
 return (
  <View>
   <View style={[{ gap: 5, justifyContent: "center", alignItems: "center" }]}>
    <Text style={[appStyles.subHeaderText, fonts.semiBold, { color: colors.appLightGrey }]}>{heading || ""}</Text>
    <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 5 }]}>
     <SmallColorBox custumStyle={{ height: 15, width: 15, backgroundColor: clr, borderRadius: undefined }} />
     <Text style={[appStyles.subHeaderText, fonts.bold, { textAlign: "center" }]}>{value || ""}</Text>
    </View>
   </View>
  </View>
 )
}

export default ColorAndTextField