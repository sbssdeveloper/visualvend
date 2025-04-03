import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../styles/colors';
import {navigationKeys} from '../utils/constants';
import {useNavigation} from '@react-navigation/native';
import appStyles from '../styles/appStyles';
const Tabs = () => {
  const navigation = useNavigation();
  const navigator = screen => navigation?.navigate(screen);

  return (
    <View
      style={[
        appStyles.rowSpaceBetweenAlignCenter,
        appStyles.ph_20,
        {
          paddingVertical: 15,
          backgroundColor: colors.white,
          elevation: 1,
        },
      ]}>
      <TouchableOpacity onPress={() => navigator(navigationKeys.home)}>
        <Text style={[styles.tabTextStyle]}>All </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigator(navigationKeys.payments)}>
        <Text style={[styles.tabTextStyle]}>Payments </Text>
      </TouchableOpacity>

      <Text style={[styles.tabTextStyle]}>Stock </Text>
      <Text style={[styles.tabTextStyle]}>Operations </Text>
      <Text style={[styles.tabTextStyle]}>Assets </Text>

      <Text style={[styles.tabTextStyle]}>Marketing </Text>
    </View>
  );
};
export default Tabs;

const styles = StyleSheet.create({
  tabTextStyle: {
    color: colors.mediummBlack,
    fontSize: 12,
  },
});
