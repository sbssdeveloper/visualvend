import { View, Text, FlatList } from "react-native";
import { feedbackStyles } from "./feedbackstyles";
import Feedbackslistheader from "./feedbackslistheader";
import appStyles from "../../../../Assets/native/appStyles";
import NoRecords from "../../../../Widgets/native/noRecords";
import { TaskIcon } from "../../../../Assets/native/images";
import { colors } from "../../../../Assets/native/colors";

const TaskList = () => {

  const renderItem = ({ item, index }) => {
    return (
      <View style={[appStyles.rowSpaceBetweenAlignCenter, feedbackStyles.main,
      {
        width: "100%",
        paddingVertical: 10,
      },
      ]}>
        <Text style={feedbackStyles.feedbackText}> {item?.task}</Text>
        <Text style={feedbackStyles.feedbackText}>{item?.refill} </Text>
        <Text style={feedbackStyles.feedbackText}>{item?.location}</Text>
      </View>
    );
  };
  return (
    <View style={[feedbackStyles.feedbackListMainContainer]}>
      <Feedbackslistheader h1={"Vend "} h2={"Product"} h3={"Company"} />
      <FlatList
        nestedScrollEnabled
        data={[]}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
  )
}

export default TaskList

// const feedbackArray = [
//   { task: 'Refils', refill: 'Pepsi Max 600ml', location: 'WSTFLD Bondi' },
//   { task: 'Refils', refill: 'Pepsi Max 600ml', location: 'WSTFLD Bondi' },
//   { task: 'Refils', refill: 'Pepsi Max 600ml', location: 'WSTFLD Bondi' },
//   { task: 'Refils', refill: 'Pepsi Max 600ml', location: 'WSTFLD Bondi' },
//   { task: 'Refils', refill: 'Pepsi Max 600ml', location: 'WSTFLD Bondi' },
//   { task: 'Refils', refill: 'Pepsi Max 600ml', location: 'WSTFLD Bondi' },
//   { task: 'Refils', refill: 'Pepsi Max 600ml', location: 'WSTFLD Bondi' },
//   { task: 'Refils', refill: 'Pepsi Max 600ml', location: 'WSTFLD Bondi' },
//   { task: 'Refils', refill: 'Pepsi Max 600ml', location: 'WSTFLD Bondi' },
// ];