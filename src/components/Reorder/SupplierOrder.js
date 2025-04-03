import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { colors } from '../../Assets/native/colors'
import { Minus } from '../../Assets/native/images'

const SupplierOrder = () => {
    return (


        <View style={{
            backgroundColor: colors.white,
            height: 350,
            borderRadius: 8,
            padding: 10
        }}>

            <FlatList
                data={stocklistArray}

                renderItem={({ item, index }) => <ListItems item={item} index={index} />}
                nestedScrollEnabled
                ItemSeparatorComponent={() => <View style={{ height: 2, backgroundColor: "#E2E2E2" }} />}
            />

        </View>

    )
}

export default SupplierOrder


const ListItems = ({ item }) => {

    return (
        <View style={[appStyles.rowSpaceBetweenAlignCenter, { paddingVertical: 20, paddingHorizontal: 10 }]}>

            <Text style={[appStyles.subHeaderText]}>{item?.heading}</Text>

            <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 5 }]}>

                <Text style={[appStyles.subHeaderText, { fontSize: 12, color: colors.cyan }]}>{""}</Text>
                <Minus />

            </View>

        </View>
    )
}



const stocklistArray = [
    { id: 1, heading: "Prod ID", value: "158 of 158" },
    { id: 2, heading: "PO#", value: "158 of 158" },
    { id: 3, heading: "Company", value: "4" },
    { id: 4, heading: "Qty", value: "3" },
    { id: 5, heading: "Orderd by", value: "5" },
    { id: 6, heading: "Status", value: "3" },
    { id: 7, heading: "Avg Sell", value: "3" },
    { id: 8, heading: "Action", value: "3" },



]
