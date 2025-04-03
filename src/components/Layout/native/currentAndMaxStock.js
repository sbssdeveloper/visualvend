import { View, Text } from 'react-native'
import React from 'react'
import appStyles from '../../../Assets/native/appStyles'
import { productStyles } from '../../Products/native/productstyle'
import { colors } from '../../../Assets/native/colors'
import { CheckboxMarked, DownArrowBlack, Empty, PartialFill, Refill, SettingIcon, Uncheckbox } from '../../../Assets/native/images'
import ProgressBars from '../../Payments/native/progressbar'
import CustomDropDown from '../../../Widgets/native/customDropDown'
import { currencyDropDown } from '../../../Helpers/native/constants'

const CurrentAndMaxStock = () => {
    return (<>
        <View style={[{ marginVertical: 10 }]}>
            <Text style={[appStyles.subHeaderText, { fontSize: 14, textAlign: "left" }]}>Current Stock / Max Qty Levels</Text>
        </View>

        <View style={[productStyles.container, { gap: 20 }]}>

            <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start", gap: 10 }]}>
                <Uncheckbox />
                <Text style={[appStyles.subHeaderText, { fontSize: 10, color: colors.appLightGrey }]}>Apply Empty, Refill or Part Fill to all same Products (S2S)</Text>
            </View>

            <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <InlineContent Icon={<Empty />} text={"Empty"} />
                <InlineContent Icon={<PartialFill />} text={"Part Fill"} />
                <InlineContent Icon={<Refill />} text={"Refill"} />
            </View>


            <View style={{ alignSelf: "flex-end" }}>
                <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                    <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>5 </Text>
                    <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>0f 8</Text>
                </View>
            </View>

            <View style={{ width: "100%" }}>
                <ProgressBars bcgClrProgress={"#E2E2E2"} barcolor={'#149CBE'} rateValue={"80%"} height={3} />
            </View>


            <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 5 }]}>
                    <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>Product Space to Sales</Text>
                    <DownArrowBlack />
                </View>

                <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10 }]}>
                    <Text style={[appStyles.subHeaderText, { color: colors.cyan }]}>10.20</Text>
                    <SettingIcon />
                </View>
            </View>

            <View style={[{ height: 2, width: "100%", backgroundColor: "#E2E2E2", marginVertical: 5 }]} />

            <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey }]}>Prcing</Text>
                <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 5 }]}>
                    <CheckboxMarked />
                    <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey }]}>Load defaul product price</Text>
                </View>
            </View>

            <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>Selling Price</Text>
                <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 5 }]}>
                    <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>Aud $</Text>
                    <CustomDropDown listItem ={currencyDropDown} bottom={20}/>
                    
                </View>
                <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>3.00</Text>
            </View>


        </View>



    </>
    )
}

export default CurrentAndMaxStock;



const InlineContent = ({ Icon, text }) => {
    return (
        <>
            <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                {Icon}
                <Text style={[appStyles.subHeaderText, { color: "#444444" }]} > {text}</Text >
            </View>


        </>)
}