import React from 'react';
import appStyles from '../../styles/appStyles';
import { SafeAreaView, View } from 'react-native';
import NoRecords from '../../components/noRecords';
const Reports = ({ navigation }) => {

  return (

    <SafeAreaView>

      <View style={[appStyles.mainContainer]}>

        <NoRecords />

      </View>

    </SafeAreaView>

  );

};

export default Reports;