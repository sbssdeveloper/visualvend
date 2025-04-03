// NestedReportsNavigator.js
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Reports from '../../../components/Reports/native';
import SellingList from '../../../components/Reports/native/ReportsInnerTab/SellingList';
import SaleReportList from '../../../components/Reports/native/ReportsInnerTab/SaleReportList';

const NestedTopTab = createMaterialTopTabNavigator();

const NestedReportsNavigator = () => {
 return (
  <NestedTopTab.Navigator
   screenOptions={{
    tabBarLabelStyle: { fontSize: 11, textTransform: 'none', color: "#222222", width: 100 },
    tabBarItemStyle: { paddingRight: 10, width: 70 },
    tabBarActiveTintColor: '#000000',
    tabBarInactiveTintColor: '#888888',
    tabBarIndicatorStyle: { backgroundColor: '#00FFFF' },
    tabBarScrollEnabled: true,
   }}
  >
   <NestedTopTab.Screen name="Reports" component={Reports} />
   <NestedTopTab.Screen name="Sales" component={SaleReportList} />
   {/* <NestedTopTab.Screen name="Stock Level" component={Reports} />
   <NestedTopTab.Screen name="Vend Actvity" component={SellingList} /> */}
  </NestedTopTab.Navigator>
 );
};

export default NestedReportsNavigator;
