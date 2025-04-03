import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import appStyles from '../../../Assets/native/appStyles'

const Setting = () => {
    return (
        <SafeAreaView>
            <View style={[appStyles.mainContainer]}>
                <Text>setting</Text>
            </View>
        </SafeAreaView>


    )
}

export default Setting