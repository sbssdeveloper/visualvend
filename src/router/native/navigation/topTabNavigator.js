import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Dashboard from '../../../components/Dashboard/native';
import { navigationKeys } from '../../../Helpers/native/constants';
import Payments from '../../../components/Payments/native/payments';
import Stock from '../../../components/Stock/native';
import Operations from '../../../components/Operations/native';
import Assets from '../../../components/Assets/native';
import Alerts from '../../../components/Alerts/native';
import { colors } from '../../../Assets/native/colors';
import Marketing from '../../../components/Marketing/native';
import Refill from '../../../components/Refill/refill';
import Products from "../../../components/Products/native"
import Reorder from '../../../components/Reorder';
import Layout from '../../../components/Layout/native';
import Reports from '../../../components/Reports/native';
import NestedReportsNavigator from './NestedReportsNavigator';


const TopTab = createMaterialTopTabNavigator();

const TopTabNavigator = ({ navigation }) => {

    return (
        <>
            <TopTab.Navigator
                screenOptions={{
                    tabBarLabelStyle: { fontSize: 11, textTransform: 'none', color: "#222222", width: 100 },
                    tabBarItemStyle: { paddingRight: 10, width: 70 },
                    tabBarActiveTintColor: colors.transparent,
                    tabBarInactiveTintColor: colors.tabSecondary,
                    tabBarIndicatorStyle: { backgroundColor: colors.cyan },
                    tabBarScrollEnabled: true
                }}
            >
                <TopTab.Screen name={navigationKeys.home} component={Dashboard} />
                <TopTab.Screen name={navigationKeys.payments} component={Payments} />
                <TopTab.Screen name={navigationKeys.stocks} component={Stock} />
                <TopTab.Screen name={navigationKeys.refill} component={Refill} />
                <TopTab.Screen name={navigationKeys.products} component={Products} />
                <TopTab.Screen name={navigationKeys.layout} component={Layout} />
                <TopTab.Screen name={navigationKeys.reoder} component={Reorder} />
                <TopTab.Screen name={navigationKeys.reports} component={NestedReportsNavigator} />
                <TopTab.Screen name={navigationKeys.operations} component={Operations} />
                <TopTab.Screen name={navigationKeys.assets} component={Assets} />
                <TopTab.Screen name={navigationKeys.marketing} component={Marketing} />
                <TopTab.Screen name={navigationKeys.alerts} component={Alerts} />
            </TopTab.Navigator>

        </>);

}

export default TopTabNavigator;


