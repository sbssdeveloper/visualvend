import { Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import appStyles from '../styles/appStyles';
import { DrawerIcon, LeftArrow, ProfileIcon } from '../assets/images';
import { colors } from '../styles/colors';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const CurrentMachineHeader = ({ showDrawerIcon, text }) => {
  const navigation = useNavigation();
  return (
    <View
      style={[appStyles.rowSpaceBetweenAlignCenter, {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: colors.steelBlue
      },]}>
      <TouchableOpacity style={{ padding: 5 }} onPress={() => {
        showDrawerIcon
          ?
          navigation.dispatch(DrawerActions.toggleDrawer()) :
          navigation.goBack();
      }}>
        {
          showDrawerIcon ?
            <DrawerIcon /> :
            <LeftArrow />
        }
      </TouchableOpacity>
      <View>
        <Text style={appStyles?.whiteText}>
          {text || ""}
        </Text>
      </View>
      <ProfileIcon />

    </View>

  );

};

export default CurrentMachineHeader;


