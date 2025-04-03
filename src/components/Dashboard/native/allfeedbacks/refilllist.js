import { Text, View, FlatList } from "react-native";
import { feedbackStyles } from "./feedbackstyles";
import Feedbackslistheader from "./feedbackslistheader";
import NoRecords from "../../../../Widgets/native/noRecords";
import { sortWordsLength } from "../../../../Helpers/native";
import { CartIcon } from "../../../../Assets/native/images";
import { colors } from "../../../../Assets/native/colors";
import appStyles from "../../../../Assets/native/appStyles";

const RefillList = ({ machineData }) => {

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={[
          appStyles.rowSpaceBetweenAlignCenter,
          feedbackStyles.main,
          {
            paddingVertical: 10,
            width: "100%",
          },
        ]}>

        <View style={{ width: "40%" }}>
          <Text style={feedbackStyles.feedbackText}>
            {item?.machine_name && sortWordsLength(item?.machine_name, 30) || ""}
          </Text>
        </View>

        <View style={{ width: "40%" }}>
          <Text style={[feedbackStyles.feedbackText]}>
            {item?.product_name && sortWordsLength(item?.product_name, 20) || ""}
          </Text>
        </View>

        <View style={{ width: "20%" }}>
          <Text style={[feedbackStyles.feedbackText, { textAlign: "right" }]}>
            {item?.aisle_no || "0"}/{item?.refill || "0"}
          </Text>
        </View>
      </View>

    );

  };


  return (
    <>

      <View style={[feedbackStyles.feedbackListMainContainer]}>
        <Feedbackslistheader h1={"Machine"} h2={"Product"} h3={"Aisle/Count"} />
              <FlatList
                nestedScrollEnabled
                data={machineData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={{ marginVertical: 10 }}
                ListEmptyComponent={<NoRecords isPending={false} />}
                ItemSeparatorComponent={() => {
                  return (
                    <View
                      style={{ height: 1, backgroundColor: colors.appOffGrey }}
                    />
                  );
                }}
              />
      </View>
    </>)
}

export default RefillList



