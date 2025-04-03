import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { GreyLeftArrow, GreyRightArrow } from '../../Assets/native/images'
import appStyles from '../../Assets/native/appStyles'

const IncrementDecrementWidget = ({ value, unique, decremental, incremental }) => {
    return (
        <View style={[appStyles.rowSpaceBetweenAlignCenter, {
            gap: 5, marginRight: unique ? 30 : undefined

        }]}>

            {!unique &&
                <TouchableOpacity onPress={() => decremental()} disabled={decremental ? false : true}>
                    <GreyLeftArrow height={16} width={16} />
                </TouchableOpacity>

            }
            <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>{value}</Text>
            {

                !unique &&
                <TouchableOpacity onPress={() => incremental()} disabled={incremental ? false : true}>
                    <GreyRightArrow height={16} width={16} />
                </TouchableOpacity>

            }

        </View>
    )
}

export default IncrementDecrementWidget