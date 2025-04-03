import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { CommonActions, useNavigation } from "@react-navigation/native";
import { navigationKeys } from '../../../Helpers/native/constants';
import { AlertIcon, AssetIcon, DownArrowBlack, DownArrowGrey, GearIcon, HomeIcon, ListIcon, LogoutIcon, MachineIcon, MarketingIcon, OperationsIcon, PaymentIcon, ProductsIcon, ReportIcon, RightArrow, ScannerIcon, SnapshotIcon, StockIcon, VendLocationIcon } from '../../../Assets/native/images';
import appStyles, { fonts } from '../../../Assets/native/appStyles';
import { colors } from '../../../Assets/native/colors';
import CurrentMachineHeader from '../../../Widgets/native/currentMachineHeader';
import NavigationHeader from '../../../Widgets/native/navigationHeader';
import Payments from '../../../components/Payments/native/payments';
import ScanCode from '../../../components/ScanCode/native';
import Alerts from '../../../components/Alerts/native';
import SnapShot from '../../../components/Snapshot/native';
import Machines from '../../../components/Machines/native';
import Products from '../../../components/Products/native';
import Stock from "../../../components/Stock/native/"
import Operations from '../../../components/Operations/native';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import Setup from '../../../components/Setup/native';
import Assets from '../../../components/Assets/native';
import Reports from '../../../components/Reports/native';
import Marketing from '../../../components/Marketing/native';
import { reset } from '../../../redux/slices/authSlice';
import Dashboard from '../../../components/Dashboard/native';
import VendRun from '../../../components/VendRun/native';
import useCurrentRoute from '../../../Hooks/GetCurrentRoute/useCurrentRoute';
import { getRouteNameByIndex } from '../../../Widgets/native/commonNativeFunctions';


const Drawer = createDrawerNavigator();

const AppDrawer = ({ navigation }) => {
    const { state: { index } = {} } = useCurrentRoute() || {};
    const routeName = getRouteNameByIndex(index);
    const [reportsSubItemsVisible, setReportsSubItemsVisible] = useState(false);
    const { roleBaseDetails, _client_id } = useSelector(state => state?.authSlice);
    const isAdmin = _client_id <= 0 ? true : false;
    const shownItems = roleBaseDetails?.menus?.split(',');
    const reportsItems = roleBaseDetails?.reports?.split(',');
    const existingValues = (key, checkForReports) => checkForReports ? reportsItems?.includes(key) : shownItems?.includes(key);
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <NavigationHeader navigation={navigation} />hgghg
                <CurrentMachineHeader showDrawerIcon={true} text={routeName || "Insights"} />
                <Drawer.Navigator
                    initialRouteName={navigationKeys.topTabNavigator}
                    screenOptions={{
                        headerShown: false,
                        drawerContentContainerStyle: { paddingTop: 5 },
                    }}
                    drawerContent={(props) => (
                        <DrawerContent {...props}
                            reportsSubItemsVisible={reportsSubItemsVisible}
                            setReportsSubItemsVisible={setReportsSubItemsVisible}
                            extraData={{ isAdmin, existingValues }}
                        />
                    )}
                >
                    {/* Main Drawer Items */}
                    <Drawer.Screen
                        name={navigationKeys.home}
                        component={Dashboard}
                        options={{
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerLabel: '',
                            drawerIcon: ({ focused }) => (
                                <DrawerIcons text={"Home"} Icon={HomeIcon} focused={focused} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name={navigationKeys.products}
                        component={Products}
                        options={{
                            drawerLabel: '',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: () => (
                                <DrawerIcons text={"Products"} Icon={ProductsIcon} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="Machines"
                        component={Machines}
                        options={{
                            drawerLabel: '',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: () => (
                                <DrawerIcons text={"Machines"} Icon={MachineIcon} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name={navigationKeys.payments}
                        component={Payments}
                        options={{
                            drawerLabel: '',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: () => (
                                <DrawerIcons text={"Payments"} Icon={PaymentIcon} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="Stock"
                        component={Stock}
                        options={{
                            drawerLabel: '',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: () => (
                                <DrawerIcons text={"Stock"} Icon={StockIcon} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="Reports"
                        component={Reports}
                        options={{
                            drawerLabel: '',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: ({ focused }) => (
                                <TouchableOpacity onPress={() => setReportsSubItemsVisible(!reportsSubItemsVisible)}>
                                    <DrawerIcons text={"Reports"} Icon={ReportIcon} focused={focused} />
                                </TouchableOpacity>
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name={navigationKeys.alerts}
                        component={Alerts}
                        options={{
                            drawerLabel: '',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: () => (
                                <DrawerIcons text={"Alerts"} Icon={AlertIcon} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="Operations"
                        component={Operations}
                        options={{
                            drawerLabel: '',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: () => (
                                <DrawerIcons text={"Operations"} Icon={OperationsIcon} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="Marketing"
                        component={Marketing}
                        options={{
                            drawerLabel: '',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: () => (
                                <DrawerIcons text={"Marketing"} Icon={MarketingIcon} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="Vend Run"
                        component={VendRun}
                        options={{
                            drawerLabel: '',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: () => (
                                <DrawerIcons text={"Vend Run"} Icon={VendLocationIcon} />
                            ),
                        }}
                    />

                    {/* <Drawer.Screen
                        name="ScanCode"
                        component={ScanCode}
                        options={{
                            drawerLabel: ' ',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: ({ focused }) => (
                                <DrawerIcons text={"Scan Code"} Icon={ScannerIcon} focused={focused} />
                            ),
                        }}
                    /> */}

                    <Drawer.Screen
                        name="Assets"
                        component={Assets}
                        options={{
                            drawerLabel: '',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: () => (
                                <DrawerIcons text={"Assets"} Icon={AssetIcon} />
                            ),
                        }}
                    />

                    {/* <Drawer.Screen
                        name="SnapShot"
                        component={SnapShot}
                        options={{
                            drawerLabel: '',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: () => (
                                <DrawerIcons text={"Snapshot"} Icon={SnapshotIcon} />
                            ),
                        }}
                    /> */}

                    <Drawer.Screen
                        name="Setup"
                        component={Setup}
                        options={{
                            drawerLabel: '',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: () => (
                                <DrawerIcons text={"Setup"} Icon={GearIcon} />
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="Logout"
                        component={Logout}
                        options={{
                            drawerLabel: '',
                            drawerActiveBackgroundColor: colors.veryLightGrey,
                            drawerItemStyle: appStyles.drawerItemCustomStyle,
                            drawerIcon: () => (
                                <DrawerIcons text={"Logout"} Icon={LogoutIcon} />
                            ),
                        }}
                    />
                </Drawer.Navigator>
            </SafeAreaView>
        </>
    );
};


const DrawerContent = ({ reportsSubItemsVisible, setReportsSubItemsVisible, extraData, ...props }) => {
    const { existingValues, isAdmin } = extraData || {}
    return (
        <DrawerContentScrollView {...props}>
            <CustomDrawerItem
                label="Insights"
                onPress={() => props.navigation.navigate('Home')}
                icon={HomeIcon}
                focused={props.state.routeNames[props.state.index] === 'Home'}
            />

            {
                isAdmin || existingValues("product") ?
                    <CustomDrawerItem
                        label="Products"
                        onPress={() => props.navigation.navigate('Products')}
                        icon={ProductsIcon}
                        focused={props.state.routeNames[props.state.index] === 'Products'}
                    /> :
                    null
            }

            {
                isAdmin || existingValues("machine") ?
                    <CustomDrawerItem
                        label="Machines"
                        onPress={() => props.navigation.navigate('Machines')}
                        icon={MachineIcon}
                        focused={props.state.routeNames[props.state.index] === 'Machines'}
                    /> :
                    null

            }


            {
                isAdmin || existingValues("payments", true) ?
                    <CustomDrawerItem
                        label="Payments"
                        onPress={() => props.navigation.navigate('Payments')}
                        icon={PaymentIcon}
                        focused={props.state.routeNames[props.state.index] === 'Payments'}
                    /> :
                    null
            }

            {
                isAdmin || existingValues("refill") ?
                    <CustomDrawerItem
                        label="Stock"
                        onPress={() => props.navigation.navigate('Stock')}
                        icon={StockIcon}
                        focused={props.state.routeNames[props.state.index] === 'Stock'}
                    />
                    : null
            }

            <CustomDrawerItem
                label="Reports"
                onPress={() => setReportsSubItemsVisible(!reportsSubItemsVisible)}
                icon={reportsSubItemsVisible ? ListIcon : ReportIcon}
                focused={props.state.routeNames[props.state.index] === 'Reports'}
                status={reportsSubItemsVisible}
            />

            {/* ALL RELATED WITH REPORT SECTION  */}
            <ReportSubSection reportsSubItemsVisible={reportsSubItemsVisible} extraData={extraData} />
            {
                isAdmin || existingValues("article") ?
                    <CustomDrawerItem
                        label="Alerts"
                        onPress={() => props.navigation.navigate('Alerts')}
                        icon={AlertIcon}
                        focused={props.state.routeNames[props.state.index] === 'Alerts'}
                    /> : null
            }

            {/* NOT REQUIRED // */}
            {/* <CustomDrawerItem
                label="Scan Code"
                onPress={() => props.navigation.navigate('ScanCode')}
                icon={ScannerIcon}
                focused={props.state.routeNames[props.state.index] === 'ScanCode'}
            /> */}

            {/* NOT REQUIRED // */}
            {/* <CustomDrawerItem
                label="Snapshot"
                onPress={() => props.navigation.navigate('SnapShot')}
                icon={SnapshotIcon}
                focused={props.state.routeNames[props.state.index] === 'SnapShot'}
            /> */}

            {
                isAdmin || existingValues("operations") ?
                    <CustomDrawerItem
                        label="Operations"
                        onPress={() => props.navigation.navigate('Operations')}
                        icon={OperationsIcon}
                        focused={props.state.routeNames[props.state.index] === 'Operations'}
                    />
                    : null}

            {
                isAdmin || existingValues("marketing") ?
                    <CustomDrawerItem
                        label="Marketing"
                        onPress={() => props.navigation.navigate('Marketing')}
                        icon={MarketingIcon}
                        focused={props.state.routeNames[props.state.index] === 'Marketing'}
                    />
                    : null}

            {
                isAdmin || existingValues("vend_queue", true) ?
                    <CustomDrawerItem
                        label="Vend Run"
                        onPress={() => props.navigation.navigate(navigationKeys.vendrun)}
                        icon={VendLocationIcon}
                        focused={props.state.routeNames[props.state.index] === 'VendRun'}
                    /> :
                    null
            }

            {
                isAdmin || existingValues("assets") ?

                    <CustomDrawerItem
                        label="Assets"
                        onPress={() => props.navigation.navigate('Assets')}
                        icon={AssetIcon}
                        focused={props.state.routeNames[props.state.index] === 'Assets'}
                    /> : null
            }

            {
                isAdmin || existingValues("setup") ?
                    <CustomDrawerItem
                        label="Setup"
                        onPress={() => props.navigation.navigate('Setup')}
                        icon={GearIcon}
                        focused={props.state.routeNames[props.state.index] === 'Setup'}
                    />
                    : null}

            <CustomDrawerItem
                label="Logout"
                onPress={() => props.navigation.navigate('Logout')}
                icon={LogoutIcon}
                focused={props.state.routeNames[props.state.index] === 'Logout'}
            />

        </DrawerContentScrollView>
    );
};

// Custom DrawerItem component
const CustomDrawerItem = ({ label, onPress, icon: Icon, focused, status, rightIconnNotRequired }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[appStyles.drawerItemCustomStyle]}>
            <View style={[appStyles.rowSpaceBetweenAlignCenter, { paddingHorizontal: 16, height: 48, backgroundColor: focused ? "#E7E7E7" : "transparent" }]}>
                <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 15 }]}>
                    {Icon && <Icon />}
                    <Text style={[appStyles.subHeaderText, fonts.mediumm, { fontSize: 14, color: colors.pureBlack }]}>{label}</Text>
                </View>
                {rightIconnNotRequired ? null : status ? <DownArrowBlack height={14} width={14} /> : <RightArrow />}

            </View>
        </TouchableOpacity>
    );
};


export default AppDrawer;

const DrawerIcons = ({ text, Icon, focused }) => {
    return (
        <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
            <View style={[appStyles.rowSpaceBetweenAlignCenter, { width: "100%" }]}>
                <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10 }]}>
                    {/* {Icon && <Icon />} */}
                    <Text style={[appStyles.subHeaderText, fonts.regular, { fontSize: 14, color: focused ? colors.primary : colors.black }]}>{text}</Text>
                </View>
                <RightArrow />
            </View>
        </View>
    );
};

const Logout = ({ navigation }) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    useEffect(() => {
        reset
        dispatch(reset());
        queryClient.removeQueries();

        navigation.dispatch(
            CommonActions.reset({
                routes: [{ name: navigationKeys.signin }],
                index: 0,
            }),
        );
    }, []);
    return null;
};


const ReportSubSection = ({ reportsSubItemsVisible, extraData }) => {
    const navigation = useNavigation();
    const { isAdmin, existingValues } = extraData || {};

    return (
        reportsSubItemsVisible && (
            <>

                {isAdmin || existingValues("sale", true) ?
                    <CustomDrawerItem
                        label="Sales"
                        onPress={() => navigation.navigate(navigationKeys.reports)}
                        //   icon={ReportIcon}
                        // focused={props.state.routeNames[props.state.index] === 'SubReport1'}
                        rightIconnNotRequired={true}
                    />
                    : null}


                {isAdmin || existingValues("refill", true) ?

                    <CustomDrawerItem
                        label="Refill"
                        onPress={() => navigation.navigate(navigationKeys.salesrefill)}
                        // icon={ReportIcon}
                        // focused={props.state.routeNames[props.state.index] === 'SubReport2'}
                        rightIconnNotRequired={true}

                    />
                    : null}


                {isAdmin || existingValues("stock", true) ?
                    <CustomDrawerItem
                        label="Stock Level"
                        onPress={() => navigation.navigate(navigationKeys.salesstocklevelreport)}
                        // icon={ReportIcon}
                        // focused={props.state.routeNames[props.state.index] === 'SubReport3'}
                        rightIconnNotRequired={true}
                    />
                    : null}


                {isAdmin || existingValues("vend_activity", true) ?
                    <CustomDrawerItem
                        label="Vend Activity"
                        onPress={() => navigation.navigate(navigationKeys.salesvendactive)}
                        // icon={ReportIcon}
                        // focused={props.state.routeNames[props.state.index] === 'SubReport3'}
                        rightIconnNotRequired={true}
                    />
                    : null}



                {isAdmin || existingValues("expiry_products", true) ?
                    <CustomDrawerItem
                        label="Expiry Product"
                        onPress={() => navigation.navigate(navigationKeys.saleproductexpiryreports)}
                        // icon={ReportIcon}
                        // focused={props.state.routeNames[props.state.index] === 'SubReport3'}
                        rightIconnNotRequired={true}
                    /> : null}


                {isAdmin || existingValues("vend_error", true) ?
                    <CustomDrawerItem
                        label="Vend Error/Feedback"
                        onPress={() => navigation.navigate(navigationKeys.venderrorfeedback)}
                        // icon={ReportIcon}
                        // focused={props.state.routeNames[props.state.index] === 'SubReport3'}
                        rightIconnNotRequired={true}

                    />
                    : null}


                {isAdmin || existingValues("feedback", true) ?
                    <CustomDrawerItem
                        label="Client Feedback"
                        onPress={() => navigation.navigate(navigationKeys.clientfeedback)}
                        // icon={ReportIcon}
                        // focused={props.state.routeNames[props.state.index] === 'SubReport3'}
                        rightIconnNotRequired={true}

                    />
                    : null}


                {isAdmin || existingValues("media", true) ?
                    <CustomDrawerItem
                        label="Media Ad"
                        onPress={() => navigation.navigate(navigationKeys.mediaAd)}
                        // icon={ReportIcon}
                        // focused={props.state.routeNames[props.state.index] === 'SubReport3'}
                        rightIconnNotRequired={true}
                    />
                    : null}

                {isAdmin || existingValues("staff", true) ?
                    <CustomDrawerItem
                        label="Staff"
                        onPress={() => navigation.navigate(navigationKeys.staff)}
                        // icon={ReportIcon}
                        // focused={props.state.routeNames[props.state.index] === 'SubReport3'}
                        rightIconnNotRequired={true}
                    />
                    : null}

                {isAdmin || existingValues("service", true) ? <CustomDrawerItem
                    label="Service"
                    onPress={() => navigation.navigate(navigationKeys.service)}
                    // icon={ReportIcon}
                    // focused={props.state.routeNames[props.state.index] === 'SubReport3'}
                    rightIconnNotRequired={true}
                /> : null}


                {isAdmin || existingValues("customer", true) ?
                    <CustomDrawerItem
                        label="Customer"
                        onPress={() => navigation.navigate(navigationKeys.customer)}
                        // icon={ReportIcon}
                        // focused={props.state.routeNames[props.state.index] === 'SubReport3'}
                        rightIconnNotRequired={true}
                    />
                    : null}

                {isAdmin || existingValues("e-receipt", true) ?

                    <CustomDrawerItem
                        label="eRecipt"
                        onPress={() => navigation.navigate(navigationKeys.erecipt)}
                        // icon={ReportIcon}
                        // focused={props.state.routeNames[props.state.index] === 'SubReport3'}
                        rightIconnNotRequired={true}
                    /> :
                    null

                }

                {isAdmin || existingValues("giftvend", true) ?
                    <CustomDrawerItem
                        label="Gift Vend"
                        onPress={() => navigation.navigate(navigationKeys.giftVend)}
                        // icon={ReportIcon}
                        // focused={props.state.routeNames[props.state.index] === 'SubReport3'}
                        rightIconnNotRequired={true}
                    />
                    : null}

                {isAdmin || existingValues("payment", true) ?
                    <CustomDrawerItem
                        label="Payment"
                        onPress={() => navigation.navigate(navigationKeys.salesreportspayment)}
                        // icon={ReportIcon}
                        // focused={props.state.routeNames[props.state.index] === 'SubReport3'}
                        rightIconnNotRequired={true}
                    /> :
                    null
                }
            </>
        )
    )
}


