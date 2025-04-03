import { View, Text } from 'react-native'
import React from 'react'
import { productStyles } from './productstyle'
import { ScanIcon } from '../../../Assets/native/images'
import appStyles from '../../../Assets/native/appStyles'
import { colors } from '../../../Assets/native/colors'

const BarcodeLinker = ({ head }) => {
    return (
        <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
            <View style={{ flex: 1 }}>
                <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey }]}>{head || "EAN"}</Text>
            </View>

            <View style={[productStyles.barcodeTextField]}>
                <Text>{"08775908*&&%&&47324755"}</Text>
            </View>
            <View style={{ flex: 1, left: 10 }}>
                <ScanIcon height={30} width={30} />
            </View>


        </View>
    )
}

export default BarcodeLinker