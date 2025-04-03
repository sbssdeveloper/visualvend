import { View, Text } from 'react-native'
import React, { useMemo } from 'react'
import { PieChart } from 'react-native-svg-charts';
import appStyles, { fonts } from '../../../../Assets/native/appStyles';
import ColorAndTextField from '../colorAndTextFields/colorAndTextField';
import roundcontainerstyles from '../../../../Widgets/native/roundcontainer/roundcontainerstyles';
import { getDimensions } from '../../../../Helpers/native/constants';

const AllChartStatic = ({ machineData = {}, isLoading }) => {

 const { _active, _fluctuate, _disconnected, _offline } = useMemo(() => {
  if (machineData) {
   let _total = machineData?.total;
   let _active = ((machineData?.connected / _total) * 100)?.toFixed(2);
   let _fluctuate = ((machineData?.fluctuating / _total) * 100)?.toFixed(2);
   let _disconnected = ((machineData?.not_connected / _total) * 100)?.toFixed(2);
   let _offline = ((machineData?.offline / _total) * 100)?.toFixed(2);
   return { _active, _fluctuate, _disconnected, _offline };
  }
  return { _active: 0, _fluctuate: 0, _disconnected: 0, _offline: 0 };
 }, [machineData]);

 const data = [
  {
   key: 1,
   amount: _active,
   svg: { fill: '#98E189' },
  },
  {
   key: 2,
   amount: _fluctuate,
   svg: { fill: '#FCEB60' },
  },
  {
   key: 3,
   amount: _disconnected,
   svg: { fill: '#8ECFCF' },
  },
  {
   key: 4,
   amount: _offline,
   svg: { fill: '#ED7A8C' },
  },
 ];

 const { width } = getDimensions();
 return (
  <View style={[roundcontainerstyles.roundBox, { width: width - 20, marginVertical: 10, marginHorizontal: 12, paddingVertical: undefined, height: 200 }]}>
   <View style={{ alignItems: 'center' }}>
    <>
     <PieChart
      style={{ height: 200, width: 200, transform: [{ rotate: '+90deg', }] }}
      data={data}
      valueAccessor={({ item }) => item?.amount}
      outerRadius={'85%'}
      innerRadius={'70%'}
      startAngle={-Math.PI}
      endAngle={0}
     >
     </PieChart>
     <View style={{ position: "absolute", top: 50, gap: 5, alignSelf: "center", }}>
      <Text style={[appStyles.subHeaderText, fonts.bold, { fontSize: 24, textAlign: "center" }]}>{machineData?.total || ""}</Text>
      <Text style={[appStyles.subHeaderText, fonts.bold, { fontSize: 14, textAlign: "center" }]}>Machines</Text>
     </View>
    </>
   </View>
   <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.ph_20, { bottom: 60 }]}>
    <ColorAndTextField heading={"Active"} value={machineData?.connected || "0"} clr={"#98E189"} />
    <ColorAndTextField heading={"Fluctuating"} value={machineData?.fluctuating || "0"} clr={"#FCEB60"} />
    <ColorAndTextField heading={"Not Connected"} value={machineData?.not_connected || "0"} clr={"#8ECFCF"} />
    <ColorAndTextField heading={"Offline"} value={machineData?.offline || "0"} clr={"#ED7A8C"} />
   </View>
  </View>
 );
}

export default AllChartStatic