import React from 'react';
import { SafeAreaView, View } from 'react-native';
import appStyles from '../../../Assets/native/appStyles';
import NoRecords from '../../../Widgets/native/noRecords';


const ScanCode = ({ navigation }) => {

  return (

    <SafeAreaView>

      <View style={[appStyles.mainContainer]}>

        <NoRecords />

      </View>

    </SafeAreaView>

  );

};

export default ScanCode;