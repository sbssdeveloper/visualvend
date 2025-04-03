import React from 'react';
import { SafeAreaView, View } from 'react-native';
import appStyles from '../../../Assets/native/appStyles';
import NoRecords from '../../../Widgets/native/noRecords';
import NavigationHeader from '../../../Widgets/native/navigationHeader';
import CurrentMachineHeader from '../../../Widgets/native/currentMachineHeader';

const VendRun = ({ navigation }) => {
  return (
    <SafeAreaView>
      <NavigationHeader navigation={{}} />
      <CurrentMachineHeader text={"VendRun"} />
      <View style={[appStyles.mainContainer]}>
        <NoRecords />
      </View>
    </SafeAreaView>
  );
};

export default VendRun;