import { View, ActivityIndicator } from 'react-native'
import React from 'react'
import { colors } from '../../Assets/native/colors'

const LoaderComponent = () => {

    return (

        <View style={{ position: "absolute", alignSelf: "center", marginTop: 250, zIndex: 1 }}>

            <ActivityIndicator color={colors.steelBlue} size={"large"} />

        </View>

    )
}

export default LoaderComponent