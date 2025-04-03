import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { reoderNavigationKeys } from '../../Helpers/native/constants';
import SupplierOrder from './SupplierOrder';
import { colors } from '../../Assets/native/colors';
import PickList from './PickList';
import RecentOrder from './recentOder';

const TopTab = createMaterialTopTabNavigator();

const ReorderStack = () => {
    return (

        <>
            <TopTab.Navigator
                screenOptions={{
                    tabBarLabelStyle: { fontSize: 11, textTransform: 'none', color: "#222222", width: 100 },
                    tabBarItemStyle: { paddingRight: 10, width: 80 },
                    tabBarActiveTintColor: colors.appBackground,
                    tabBarInactiveTintColor: colors.appBackground,
                    tabBarIndicatorStyle: { backgroundColor: colors.cyan },
                    tabBarStyle: { backgroundColor: "transparent", elevation: 0, marginBottom: 20 },
                    tabBarScrollEnabled: true
                }}
            >
                <TopTab.Screen name={reoderNavigationKeys.supplyorder} component={SupplierOrder} />
                <TopTab.Screen name={reoderNavigationKeys.picklist} component={PickList} />
                <TopTab.Screen name={reoderNavigationKeys.recentorder} component={RecentOrder} />
                <TopTab.Screen name={reoderNavigationKeys.pastorder} component={RecentOrder} />
                <TopTab.Screen name={reoderNavigationKeys.suppilers} component={RecentOrder} />
                <TopTab.Screen name={reoderNavigationKeys.content} component={RecentOrder} />






            </TopTab.Navigator>

        </>
    )
}

export default ReorderStack;


