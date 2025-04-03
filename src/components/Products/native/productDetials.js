import { View, Text } from 'react-native'
import React from 'react'
import appStyles from '../../../Assets/native/appStyles'
import { productStyles } from './productstyle'
import { colors } from '../../../Assets/native/colors'
import { CalenderIcon, CameraIcon, DownArrowSmallBlack, Fries, Gallery, InfoIcon, ScanIcon } from '../../../Assets/native/images'

const ProductDetials = () => {
    return (
        <View style={[productStyles.container]}>

            <View style={{ gap: 3 }}>
                <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey }]}>Product Name</Text>
                <Text style={[appStyles.subHeaderText]}>Red Bull Sugar Free</Text>
            </View>


            <View style={[appStyles.rowSpaceBetweenAlignCenter]}>

                <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, alignItems: "flex-start" }]}>
                    <View style={{ gap: 3 }}>
                        <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey }]}>Product Category</Text>
                        <Text style={[appStyles.subHeaderText]}>French Fries</Text>

                    </View>

                    <InfoIcon />
                    <Text style={[appStyles.subHeaderText, { color: colors.cyan }]}> + Add </Text>
                </View>

                <View style={{ backgroundColor: "#F2F6FD", borderRadius: 10 }}>
                    <Fries height={100} width={100} />
                    <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "center", gap: 10, top: 20 }]}>
                        <Gallery height={15} width={15} />
                        <CameraIcon height={15} width={15} />
                    </View>
                </View>

            </View>


            <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, justifyContent: "flex-start", gap: 50 }]}>
                <View style={{ gap: 3 }}>
                    <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey }]}>Product ID</Text>
                    <Text style={[appStyles.subHeaderText]}>10025890</Text>

                </View>

                <ScanIcon />

            </View>



            <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, justifyContent: "flex-start", gap: 50, marginTop: 20 }]}>
                <View style={{ gap: 3 }}>
                    <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey }]}>Product Description</Text>
                    <Text style={[appStyles.subHeaderText]}>Energy  Drink 30% Energy</Text>

                </View>



            </View>

            {/* PRODUCT NAME AND IMAGE REPETATION */}


            <View style={[appStyles.rowSpaceBetweenAlignCenter]}>

                <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, alignItems: "flex-start" }]}>
                    <View style={{ gap: 3 }}>
                        <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey }]}>Product Supplier1</Text>

                        <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start", gap: 10 }]}>
                            <Text style={[appStyles.subHeaderText]}>French Fries</Text>
                            <DownArrowSmallBlack />
                        </View>


                    </View>

                    <InfoIcon />
                    <Text style={[appStyles.subHeaderText, { color: colors.cyan }]}>+ Add </Text>
                </View>

                <View style={{ backgroundColor: "#F2F6FD", borderRadius: 10 }}>
                    <Fries height={100} width={100} />
                    <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "center", gap: 10, top: 20 }]}>
                        <Gallery height={15} width={15} />
                        <CameraIcon height={15} width={15} />
                    </View>
                </View>




            </View>

            <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, justifyContent: "flex-start", gap: 50, marginTop: 10 }]}>
                <View style={{ gap: 3 }}>
                    <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey }]}>Product Description</Text>
                    <Text style={[appStyles.subHeaderText]}>Energy  Drink 30% Energy</Text>

                </View>



            </View>






        </View>
    )
}

export default ProductDetials