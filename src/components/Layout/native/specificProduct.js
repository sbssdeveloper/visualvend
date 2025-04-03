import { View, Text } from 'react-native'
import React from 'react'
import { colors } from '../../../Assets/native/colors';
import CustomLine from '../../../Widgets/native/customLine';
import appStyles from '../../../Assets/native/appStyles';
import ProgressBars from '../../Payments/native/progressbar';
import { CameraIcon, Fries, PopCorn } from '../../../Assets/native/images';
import CurrentAndMaxStock from './currentAndMaxStock';

const SpecificProduct = () => {
    return (<>


        <View style={[{ marginVertical: 10 }]}>

            <View style={[appStyles.ph_10, appStyles.pv_10, { backgroundColor: colors.white, borderRadius: 10 }]}>

                <View style={{ flexDirection: 'row' }}>

                    <ProductType item={"item"} />

                    <View style={{ paddingHorizontal: 20 }}>
                        <CustomLine />
                    </View>


                    <ProdcutDescription item={"item"} />

                </View>

            </View>

        </View>

        <CurrentAndMaxStock />

    </>
    )
}

export default SpecificProduct;


const ProductType = ({ item }) => {
    return (
        <View style={[{ paddingVertical: 10 }]}>

            <View style={{ gap: 5, alignItems: "center", justifyContent: "center" }}>
                <Fries />
                <CameraIcon />
            </View>

        </View>
    );
};

const ProdcutDescription = ({ item, setoperationType }) => {

    return (
        <View style={[{ flex: 1 }]}>

            <View style={[appStyles.rowSpaceBetweenAlignCenter, { flex: 1 }]}>

                <View style={{ gap: 5, flex: 1, alignItems: "flex-start" }}>
                    <Text style={[appStyles.blackText, { color: "#DC405C" }]}>{/* {item?.productName || ""} */}
                        smith
                    </Text>
                    <Text style={[appStyles.blackText, { color: "#DC405C" }]}>{/* {item?.productName || ""} */}
                        Cheese & Onion
                    </Text>

                    <Text style={[appStyles.blackText, { color: "#DC405C" }]}>{/* {item?.productName || ""} */}
                        90 gms
                    </Text>




                </View>

                <View style={[{ gap: 20 }]}>

                    <Text style={[appStyles.blackText]}>{/* {item?.productName || ""} */}
                        A$ 3.00
                    </Text>

                    <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                        <PopCorn />
                        <Text style={[appStyles.subHeaderText, { fontSize: 10, color: colors.appLightGrey }]}>Snack</Text>
                    </View>

                </View>

            </View>

        </View>
    )
}