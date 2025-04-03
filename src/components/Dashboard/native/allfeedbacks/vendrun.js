import { View, Text, FlatList } from "react-native";
import { feedbackStyles } from "./feedbackstyles";
import Feedbackslistheader from "./feedbackslistheader";
import appStyles, { fonts } from "../../../../Assets/native/appStyles";
import NoRecords from "../../../../Widgets/native/noRecords";
import { sortWordsLength } from "../../../../Helpers/native";
import { colors } from "../../../../Assets/native/colors";
import { VendLocationIcon } from "../../../../Assets/native/images";
import { getDimensions } from "../../../../Helpers/native/constants";

const VendRunList = ({ machineData }) => {

    const renderItem = ({ item, index }) => {
        return (
            <View style={[appStyles.rowSpaceBetweenAlignCenter, feedbackStyles.main,
            {
                width: "100%",
                paddingVertical: 10,
            },
            ]}>
                <View style={{ width: "40%" }}>
                    <Text style={[feedbackStyles.feedbackText, fonts.bold, { fontSize: 11 }]}>
                        {item?.machine_name && sortWordsLength(item?.machine_name, 30) || ""}
                    </Text>
                </View>
                <View style={{ width: "40%" }}>
                    <Text style={[feedbackStyles.feedbackText, fonts.bold, { fontSize: 11 }]}>
                        {item?.product_name && sortWordsLength(item?.product_name, 20) || ""}
                    </Text>
                </View>
                <View style={{ width: "20%" }}>
                    <Text style={[feedbackStyles.feedbackText, fonts.bold, { fontSize: 11, textAlign: "right" }]}>
                        {item?.product_price || ""}
                    </Text>
                </View>
            </View>
        );
    };


    return (
        <>
            <View style={[feedbackStyles.feedbackListMainContainer, { flexGrow: 1 }]}>
                 <Feedbackslistheader h1={"Machine"} h2={"Product"} h3={"Price"} />
                <FlatList
                    nestedScrollEnabled
                    data={machineData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index?.toString()}
                    ListEmptyComponent={<NoRecords isPending={false} />}
                    ItemSeparatorComponent={() => {
                        return (
                            <View
                                style={{ height: 1, backgroundColor: "#E5E5E5" }}
                            />
                        );
                    }}
                />
            </View>
        </>)
}
export default VendRunList

