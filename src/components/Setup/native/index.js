import React from 'react';
import { SafeAreaView,View } from 'react-native';
import NoRecords from '../../../Widgets/native/noRecords';
import appStyles from '../../../Assets/native/appStyles';

const Setup = ({ navigation }) => {

  return (

    <SafeAreaView>

      <View style={[appStyles.mainContainer]}>

      <NoRecords />

      </View>

    </SafeAreaView>

  );

};

export default Setup;