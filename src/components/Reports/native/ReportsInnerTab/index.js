import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SellingList from './SellingList';
import { reportsNavigationKeys } from '../../../../Helpers/native/constants';
import { colors } from '../../../../Assets/native/colors';
import { getSalesReport } from '../../action';
import useFetchData from '../../../../Hooks/fetchCustomData/useFetchData';
import { useSelector } from 'react-redux';
import useInfiniteFetchData from '../../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { fonts } from '../../../../Assets/native/appStyles';

const TopTab = createMaterialTopTabNavigator();


const ReportsInnerTabs = ({ top, least, isLoading, array, firstTabName, secondTabName }) => {

 return (
  <>
   <TopTab.Navigator
    initialRouteName='Details'
    screenOptions={{
     tabBarLabelStyle: [{ fontSize: 12, textTransform: 'none', color: "#222222", width: "100%",  }, fonts.bold],
     tabBarItemStyle: {},
     tabBarActiveTintColor: "transparent",
     tabBarInactiveTintColor: "transparent",
     tabBarIndicatorStyle: { backgroundColor: colors.cyan },
     tabBarStyle: { backgroundColor: "transparent", elevation: 0, marginBottom: 0 },
     tabBarScrollEnabled:false
    }}
   >
    <TopTab.Screen name={firstTabName || ""} >
     {() => <SellingList data={top} loading={isLoading} dynamicArray={array} />}
    </TopTab.Screen>

    <TopTab.Screen name={secondTabName || ""}>
     {() => <SellingList data={least} loading={isLoading} dynamicArray={array} />}
    </TopTab.Screen>



   </TopTab.Navigator>

  </>
 )
}
export default ReportsInnerTabs;