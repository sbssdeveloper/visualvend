import { View, Text } from 'react-native'
import React from 'react'
import CustomLine from '../customLine'
import appStyles from '../../../Assets/native/appStyles'
import { colors } from '../../../Assets/native/colors'


const CustomListing = ({ FirstSection, SecondSection, customStyle }) => {
  return (

    <View
      style={[
        appStyles.rowSpaceBetweenAlignCenter,appStyles.commonElevation,
        { backgroundColor: colors.white, borderRadius: 10, paddingHorizontal: 5, ...customStyle },
      ]}>
      <View style={{ flexDirection: 'row', justifyContent: "space-between", }}>
        <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
          {FirstSection && FirstSection}
        </View>
        <View style={{ flex: 0.1, height: "100%"}}>
          <View style={{flex:1,left:5}}>
          <CustomLine />
          </View>
        </View>
        <View style={{ flex: 2, paddingLeft: 20, }}>
          {SecondSection && SecondSection}
        </View>
      </View>
    </View>

  )
}

export default CustomListing;





