import { TouchableOpacity, View } from 'react-native';
// import { navigationKeys } from '../utils/constants';
// import { useNavigation } from '@react-navigation/native';
import appStyles from '../../Assets/native/appStyles';
import { AppLogo, ProfileIcon, ScanIcon, SmallAppLogo } from '../../Assets/native/images';

const NavigationHeader = () => {
  // const navigation = useNavigation();
  return (
    <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.pv_10, appStyles.ph_10]}>
      <View style={{ left: 4 }}>
        <ScanIcon />
      </View>
      <AppLogo height={24} width={24} />
      <TouchableOpacity onPress={() => { }}>
        <ProfileIcon height={18} width={18} />
      </TouchableOpacity>
    </View>
  );
};

export default NavigationHeader;
