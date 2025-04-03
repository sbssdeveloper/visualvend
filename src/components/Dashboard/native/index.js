import { View, SafeAreaView, ScrollView, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import React, { useEffect, useRef } from 'react';
import RoundContainer from '../../../Widgets/native/roundcontainer/roundcontainer';
import { AllFeedBack } from './allfeedbacks/allfeedback';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal';
import { useSelector } from 'react-redux';
import appStyles, { fonts } from '../../../Assets/native/appStyles';
import Widget from "../../../Widgets/native/widget";
import { colors } from '../../../Assets/native/colors';
import { useQuitHandler } from '../../../Hooks/useQuitApp';
import { dashboardInfo, machineList } from '../action';
import useFetchData from "../../../Hooks/fetchCustomData/useFetchData";
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import AllChartStatic from './statics/allStatic';
import GraphStatics from './statics/graphStatics';
import StafAndMachineUsers from './statics/stafAndMachineUsers';
import { getMachineUsersData, getProductData, getSaleData, getStaffData, getStockData } from '../constant';
import AppSkelton from '../../../Widgets/native/skelton';

const Dashboard = () => {
  useQuitHandler();
  const [modalStates, setModalStates] = useModalStates();
  const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state?.filterSlice);

  const { data: machineData, isLoading } = useFetchData({
    key: 'GETMACHINEDETAILS',
    fn: dashboardInfo,
    start_date: commonDateFilter,
    end_date: commonEndDate,
    machine_id: commonMachineIdFilter,
    type: "all",
  });

  const {data:{data:machineDetails}={}} = useFetchData({  key: "GETMACHINELIST", fn: machineList });
  const { machines = {}, products = {}, vend_sales = {}, stock_level = {}, staff = {}, machine_users = {}, "7_days_sales": salesData = {}, } = machineData?.data?.data || {};

  const renderStaffAndMachineUsers = () => (
    <View style={appStyles.rowSpaceBetweenAlignCenter}>
      <StafAndMachineUsers
        radiusClr="#FEFBDC"
        bcgClrProgress="#F9F6E8"
        barcolor="#FCEB60"
        heading="Staff"
        subHeading="Offline"
        data={getStaffData(staff)}
      />
      <StafAndMachineUsers
        radiusClr="#FBE4E8"
        bcgClrProgress="#F8F3F3"
        barcolor="#ED7A8C"
        heading="Machine User"
        subHeading="Active"
        data={getMachineUsersData(machine_users)}
      />
    </View>
  );

  return (
    <SafeAreaView>
      <View style={[appStyles.mainContainer, { paddingHorizontal: "flex-start" }]}>
        <Widget setMddalStates={setModalStates} modalStates={modalStates} />
        <ScrollView style={{ backgroundColor: colors.appBackground }}>
          {
            isLoading ? <AppSkelton height={"80%"} width={"100%"} length={1} /> :
              <AllChartStatic machineData={machines} isLoading={isLoading} />
          }

          <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground }]}>
            {isLoading ? <AppSkelton height={"30%"} width={"100%"} length={3} /> :
              <>
                <RoundContainer isLoading={isLoading} descriptonData={getProductData(products)} />
                <RoundContainer isLoading={isLoading} descriptonData={getSaleData(vend_sales)} />
                <RoundContainer isLoading={isLoading} descriptonData={getStockData(stock_level)} />
              </>
            }
            {isLoading ? <AppSkelton height={"60%"} width={"100%"} length={1} /> : renderStaffAndMachineUsers()}
            <Text style={[appStyles.subHeaderText, fonts.bold,{ marginVertical: 5 }]}>Last 7 Days Sales</Text>
            {isLoading ? <AppSkelton height={"70%"} width={"100%"} length={1} /> : <GraphStatics graphData={salesData} isLoading={isLoading} />}
            <AllFeedBack machineData={machineData?.data?.data} isLoading={isLoading} />
          </View>

        </ScrollView>
      </View>
      <DurationModal modalStates={modalStates} setMddalStates={setModalStates} />
      <MachineIdModal machineDetails={machineDetails?.data} modalStates={modalStates} setMddalStates={setModalStates} />
    </SafeAreaView>
  );
};

export default Dashboard;


// const CustomLoader = () => {
//   const animationValues = Array.from({ length: 4 }, () => new Animated.Value(0)); // Create an array of animation values

//   useEffect(() => {
//     // Chain animations to light up each segment one by one
//     const animations = animationValues.map((value) =>
//       Animated.timing(value, {
//         toValue: 1,
//         duration: 300,
//         easing: Easing.linear,
//         useNativeDriver: false,
//       })
//     );

//     // Loop the sequence of animations
//     Animated.loop(
//       Animated.sequence([
//         ...animations,
//         Animated.delay(200), // Delay before resetting
//         Animated.timing(animationValues[3], {
//           toValue: 0,
//           duration: 0,
//           useNativeDriver: false,
//         }),
//         Animated.timing(animationValues[2], {
//           toValue: 0,
//           duration: 0,
//           useNativeDriver: false,
//         }),
//         Animated.timing(animationValues[1], {
//           toValue: 0,
//           duration: 0,
//           useNativeDriver: false,
//         }),
//         Animated.timing(animationValues[0], {
//           toValue: 0,
//           duration: 0,
//           useNativeDriver: false,
//         }),
//       ])
//     ).start();
//   }, [animationValues]);

//   return (
//     <View style={styles.container}>
//       <View style={styles.loader}>
//         {animationValues.map((value, index) => (
//           <Animated.View
//             key={index}
//             style={[
//               styles.segment,
//               styles[`segment${index + 1}`],
//               { opacity: value }, // Animate opacity to simulate lighting up
//             ]}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 150,
    height: 150, // Full circle size to allow for curved segments
    borderRadius: 75,
    overflow: 'hidden',
    position: 'relative',
  },
  segment: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    borderTopLeftRadius: 75, // Curved lines for the segments
    borderTopRightRadius: 75,
    borderBottomLeftRadius: 75,
    borderBottomRightRadius: 75,
    borderWidth: 10, // Thin line-like segments
    borderColor: 'transparent',
  },
  segment1: {
    borderColor: '#98E189',
    transform: [{ rotate: '0deg' }], // First segment, starting from the top
  },
  segment2: {
    borderColor: '#FCEB60',
    transform: [{ rotate: '45deg' }], // Second segment, slightly rotated
  },
  segment3: {
    borderColor: '#8ECFCF',
    transform: [{ rotate: '90deg' }], // Third segment, further rotated
  },
  segment4: {
    borderColor: '#ED7A8C',
    transform: [{ rotate: '135deg' }], // Fourth segment, rotated even more
  },
});









