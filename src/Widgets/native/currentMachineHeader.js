import { Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import appStyles from '../../Assets/native/appStyles';
import { colors } from '../../Assets/native/colors';
import { DrawerIcon, LeftArrow, ProfileIcon } from '../../Assets/native/images';
import { useNavigation, DrawerActions } from '@react-navigation/native';


const CurrentMachineHeader = ({ showDrawerIcon, text,handler }) => {
  const navigation = useNavigation();

console.log(handler,"===>>>")
  return (
    <View
      style={[{
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: colors.steelBlue,
        flexDirection: "row"

      },]}>

      <TouchableOpacity style={{ padding: 5 }} onPress={() => {
        showDrawerIcon ? navigation.dispatch(DrawerActions.toggleDrawer()) : handler ? handler() :  navigation.goBack();
      }}>
        {showDrawerIcon ? <DrawerIcon height={20} width={20} /> :<LeftArrow height={20} width={20} />}
      </TouchableOpacity>
      <View style={{ alignSelf: "center", flex: 1 }}>
        <Text style={appStyles?.whiteText}>
          {text || ""}
        </Text>
      </View>



    </View>

  );

};

export default CurrentMachineHeader;


