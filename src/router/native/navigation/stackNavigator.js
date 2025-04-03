import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { machineConfigNavigationKeys, machineNavigationKeys, machineStack, machineStackNavigationKeys, navigationKeys } from '../../../Helpers/native/constants';
import { colors } from '../../../Assets/native/colors';
import Signin from '../../../components/Login/native';
import AppDrawer from './appDrawer';
import Dashboard from '../../../components/Dashboard/native';
import Payments from "../../../components/Payments/native/payments"
import Mobilepayments from "../../../components/Payments/native/mobilepayments"
import Setting from '../../../components/Settings/native/setting';
import { getToken } from '../../../Helpers/native';
import CollapsibleList from '../../../components/Reports/native/collapsabelList';
import Refill from '../../../components/Reports/native/refill';
import RefillReportList from '../../../components/Reports/native/refillReportList';
import StockLevelReports from '../../../components/Reports/native/stockLevelReports';
import VENDACTIVITYREPORT from '../../../components/Reports/native/vendActivityReports';
import VendAcitveReportList from '../../../components/Reports/native/vendActiveReportList';
import VendActivityReportList from '../../../components/Reports/native/vendActivityReports';
import VendActiveReports from '../../../components/Reports/native/vendActivityReports';
import SaleReportList from '../../../components/Reports/native/SaleReportList';
import ExpiryProudctReports from '../../../components/Reports/native/expiryProudctReports';
import VendErrorFeedback from '../../../components/Reports/native/VendErrorFeedback';
import ClientFeedback from '../../../components/Reports/native/clientFeedback';
import MediaAdvertisement from '../../../components/Reports/native/mediaAd';
import Staff from '../../../components/Reports/native/staff';
import Service from '../../../components/Reports/native/Service';
import Customer from '../../../components/Reports/native/Customer';
import Erecipt from '../../../components/Reports/native/eRecipt';
import GiftVends from '../../../components/Reports/native/gitfVends';
import ReportsPayemnts from '../../../components/Reports/native/payments';
import PaymentListing from '../../../components/Reports/native/PaymentListing'
import CommonList from '../../../components/Reports/native/commonList';
import VendRun from '../../../components/VendRun/native';
import PlanogramList from '../../../components/Machines/native/planogram/planogramList';
import AddMachine from '../../../components/Machines/native/upsert/addMachine';
import planograms from '../../../components/Machines/native/planogram/planograms';
import Planograms from '../../../components/Machines/native/planogram/planograms';
import ResetPlanogram from '../../../components/Machines/native/planogram/resetPlanogram';
import MachineClone from '../../../components/Machines/native/clone/machineClone';
import UploadPlanogram from '../../../components/Machines/native/planogram/uploadPlanogram';
import MachineCommonList from '../../../components/Machines/native/commonlist-machine/machineCommonList';
import ProductStack from '../../../components/Products/native/productStack';
import MachineConfigure from '../../../components/Machines/native/configure/machineConfigure';
import UpdatePlanogram from '../../../components/Machines/native/upsert/updatePlanogram';


const StackNavigator = () => {
  const token = getToken();
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        headerTintColor: colors.pureBlack,
        headerStyle: { backgroundColor: colors.white },
      }}
      initialRouteName={token ? navigationKeys.appDrawer : navigationKeys.signin}
    >
      <Stack.Screen
        name={navigationKeys.signin}
        component={Signin}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.appDrawer}
        component={AppDrawer}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationKeys.home}
        component={Dashboard}
        options={{
          headerShown: true,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.payments}
        component={Payments}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.mobilepayment}
        component={Mobilepayments}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.setting}
        component={Setting}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.vendrun}
        component={VendRun}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.reportslist}
        component={CollapsibleList}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.productstack}
        component={ProductStack}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />




      <Stack.Screen
        name={navigationKeys.salesreport}
        component={SaleReportList}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.salesrefill}
        component={Refill}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.salesrefillreportslist}
        component={RefillReportList}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.salesstocklevelreport}
        component={StockLevelReports}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.salesvendactive}
        component={VendActiveReports}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.salevendactivelist}
        component={VendAcitveReportList}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.saleproductexpiryreports}
        component={ExpiryProudctReports}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.venderrorfeedback}
        component={VendErrorFeedback}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.clientfeedback}
        component={ClientFeedback}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.mediaAd}
        component={MediaAdvertisement}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.staff}
        component={Staff}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.service}
        component={Service}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.customer}
        component={Customer}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.erecipt}
        component={Erecipt}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.giftVend}
        component={GiftVends}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.salesreportspayment}
        component={ReportsPayemnts}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.salesreportspaymentlist}
        component={PaymentListing}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={navigationKeys.commonlist}
        component={CommonList}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={machineNavigationKeys.machineupsert}
        component={AddMachine}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={machineNavigationKeys.planogramlist}
        component={PlanogramList}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={machineNavigationKeys.planogram}
        component={Planograms}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={machineNavigationKeys.resetplanogram}
        component={ResetPlanogram}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={machineNavigationKeys.clonemachine}
        component={MachineClone}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={machineNavigationKeys.uploadplanogram}
        component={UploadPlanogram}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={machineNavigationKeys.commonmahcineList}
        component={MachineCommonList}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />

      <Stack.Screen
        name={machineConfigNavigationKeys.machineStack}
        component={MachineConfigure}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />



<Stack.Screen
        name={machineNavigationKeys.updatePlanogram}
        component={UpdatePlanogram}
        options={{
          headerShown: false,
          headerTitleStyle: { flex: 1, textAlign: 'center' },
        }}
      />


      



    </Stack.Navigator>
  );

};

export default StackNavigator;










