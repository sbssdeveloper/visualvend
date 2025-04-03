import React from 'react'
import { View, Text } from 'react-native'
import appStyles from '../../../../Assets/native/appStyles'
import { colors } from '../../../../Assets/native/colors'

const Feedbackslistheader = ({ h1, h2, h3 }) => {

  return (
    <View style={[appStyles.rowSpaceBetweenAlignCenter, {
      padding: 5,
      borderBottomWidth: 1,
      borderBottomColor: "#E3E3E3",
      marginTop:10,
      paddingBottom:10
    }]}>
      <Text style={[appStyles.subHeaderText]}>
        {h1 || ""}
      </Text>

      <Text style={[appStyles.subHeaderText]}>
        {h2 || ""}
      </Text>

      <Text style={[appStyles.subHeaderText]}>
        {h3 || ""}
      </Text>
    </View>
  )

}

export default Feedbackslistheader