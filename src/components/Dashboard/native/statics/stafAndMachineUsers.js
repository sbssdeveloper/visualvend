import { View, Text } from 'react-native'
import React from 'react'
import roundcontainerstyles from '../../../../Widgets/native/roundcontainer/roundcontainerstyles'
import ProgressBars from '../../../Payments/native/progressbar'
import appStyles, { fonts } from '../../../../Assets/native/appStyles'
import { colors } from '../../../../Assets/native/colors'

const StafAndMachineUsers = ({ bcgClrProgress = "", barcolor = "", radiusClr, heading, subHeading, data }) => {
 const { roundContainer, headingValue, subHeadingValue, percentage } = data || {}

 return (
  <View style={[roundcontainerstyles.roundBox, { height: undefined, marginVertical: 5 }]}>
   <View style={[appStyles.rowSpaceBetweenAlignCenter, { paddingVertical: 5, justifyContent: "flex-start", gap: 10 }]}>
    <View style={{ borderRadius: 50, height: 50, width: 50, backgroundColor: radiusClr, alignItems: "center", justifyContent: "center" }}>
     <Text style={[appStyles.subHeaderText, fonts.bold, { color: "#AE9042" }]}> {roundContainer || "0"} </Text>
    </View>

    <View style={[{ gap: 5, flex: 1 }]}>
     <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start" }]}>
      <Text style={[appStyles.subHeaderText, fonts.bold]}> {heading || ""} </Text>
      <Text style={[appStyles.subHeaderText, fonts.bold]}> {headingValue || ""}</Text>
     </View>

     <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start" }]}>
      <Text style={[appStyles.subHeaderText, fonts.semiBold, { color: colors.appLightGrey }]}>{subHeading || ""}:{subHeadingValue || "0"}</Text>
     </View>
     <View style={{ width: "100%" }}>
      <ProgressBars bcgClrProgress={bcgClrProgress} barcolor={barcolor} rateValue={`${percentage}%`} height={10} />
     </View>
    </View>
   </View>
  </View>
 )
}

export default StafAndMachineUsers