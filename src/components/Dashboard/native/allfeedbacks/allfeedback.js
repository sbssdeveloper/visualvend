import TaskList from './tasklist';
import RefillList from './refilllist';
import VendRunList from './vendrun';
import RecentFeed from './recentFeed';
import { feedbackStyles } from './feedbackstyles';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../../../Assets/native/colors';
import { useState } from 'react';
import appStyles, { fonts } from '../../../../Assets/native/appStyles';
import AppSkelton from '../../../../Widgets/native/skelton';

export const AllFeedBack = ({ machineData, isLoading }) => <><FeedbackGroups machineData={machineData} isLoading={isLoading} />

</>

const FeedbackGroups = ({ machineData, isLoading }) => {
  const [currentRender, setCurrentRender] = useState("VendRunList");
  console.log({ machineData: machineData?.recent_vend })
  const componentMap = {
    VendRunList: <VendRunList machineData={machineData?.recent_vend} />,
    RefillList: <RefillList machineData={machineData?.recent_refill} />,
    RecentFeed: <RecentFeed />,
    TaskList: <TaskList />,
  };

  return (<>

    <View style={[feedbackStyles.feedbackListMainContainer,{ marginVertical: 5, padding:5, }]}>
      <Text style={[appStyles.subHeaderText, fonts.bold,{ fontSize: 18 }]}>Recent</Text>
      <View style={[appStyles.rowSpaceBetweenAlignCenter, {
        paddingVertical: 5, paddingHorizontal: 8, flexGrow: 1, flexWrap: 'wrap',
        justifyContent: "space-between", borderBottomWidth: 0, borderBottomColor: "#f8f8f8",
      }]}>
        {items?.map((item) => (
          <ItemList
            key={item.key}
            active={currentRender === item?.key}
            text={item.text}
            onPress={() => setCurrentRender(item?.key)}
          />
        ))}
      </View>
      {isLoading ? <AppSkelton height={"80%"} width={"100%"} length={1} /> : componentMap[currentRender]}
    </View>

  </>)
}

const ItemList = ({ active, text, onPress }) =>
  <TouchableOpacity style={{ borderBottomWidth: 1.5, paddingVertical: 5, borderBottomColor: active ? colors.cyan : "transparent" }} onPress={() => onPress()}>
    <Text style={[appStyles.subHeaderText,fonts.semiBold,{fontSize:14}]}>
      {text}
    </Text>
  </TouchableOpacity>



const items = [
  { text: 'Vends', key: 'VendRunList' },
  { text: ' Refill', key: 'RefillList' },
  { text: 'Feedback', key: 'RecentFeed' },
  { text: 'Task', key: 'TaskList' },
];


