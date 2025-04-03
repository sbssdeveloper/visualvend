import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { productStyles } from './productstyle'
import { colors } from '../../../Assets/native/colors'
import appStyles from '../../../Assets/native/appStyles'
import CustomButton from '../../../Widgets/native/customButton'
import { productNavigationKeys } from '../../../Helpers/native/constants'
import { useNavigation } from '@react-navigation/native'

const Content = ({ }) => {

    const navigation = useNavigation();

    return (
        <View style={[productStyles.gap_5, { backgroundColor: colors.appBackground, paddingTop: 20, flex: 1 }]}>

            {/* <View style={[appStyles.pv_10]}>
                <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>Traditional Vend Content</Text>
            </View> */}

            <View style={[productStyles.container, productStyles.gap_5]}>

                <FlatList
                    data={contentOptions}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => (
                        <View style={{ marginVertical: 5 }}>
                            <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey }]}>{item.title}</Text>
                        </View>
                    )}
                />
            </View>


            <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, position: "absolute", bottom: 80 }]}>
                <View style={{ flex: 0.5 }}>
                    <CustomButton
                        text={"Back"}
                        onPress={() => navigation.goBack()}
                        style={[
                            appStyles.touchableButtonCyan,
                            { backgroundColor: "white" }
                        ]}
                        textClr={colors.appLightGrey}

                    />
                </View>

                <View style={{ flex: 0.5 }}>
                    <CustomButton
                        text={"Forward"}
                        onPress={() => navigation.navigate(productNavigationKeys.productImage)}
                        style={[
                            appStyles.touchableButtonCyan,
                        ]}
                    />
                </View>
            </View>



        </View>
    )
}

export default Content;


// data.js

export const contentOptions = [
    { key: 'bannerLogos', title: 'Banner Logos' },
    { key: 'screensaverMedia', title: 'Screensaver Media' },
    { key: 'pageMediaAds', title: 'Page Media Ads' },
    { key: 'bottomBannerHeaders', title: 'Bottom Banner Headers' },
    { key: 'vendingPageContent', title: 'Vending Page Content' },
    { key: 'thankYouScreenContent', title: 'Thank You Screen Content' },
    { key: 'contentDisplayOptions', title: 'Content Display Options' },
    { key: 'contentDisplayTimers', title: 'Content Display Timers' },
    // { key: 'contentUpdateSettings', title: 'Content Update Settings' },
    // { key: 'didItVendContentSettings', title: 'Did It Vend Content Settings' },
    // { key: 'productLinkedContentSettings', title: 'Product Linked Content Settings' },
    // { key: 'mediaAdInteractionSettings', title: 'Media Ad Interaction Settings' },
];











