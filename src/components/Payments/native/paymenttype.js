import { View, Text } from 'react-native';
import { ApplePayLogo } from '../../assets/images';
import appStyles from '../../../Assets/native/appStyles';
import { getIcons } from '../function';


const PaymentType = ({ item }) => {
  return (
    <View style={[{ gap: 10, paddingVertical: 10, }]}>
      {getIcons(item?.pay_method, item) || null}
      <View style={[appStyles.rowSpaceBetweenAlignCenter, {justifyContent:"flex-start",gap:5 }]}>
        <Text style={[appStyles.blackText]}>Aisle</Text>
        <Text style={[appStyles.blackText]}>{item?.aisle_number || ""} </Text>
      </View>
      <Text style={[appStyles.blackText]}>{item?.card_type || ""}</Text>
    </View>
  );
};
export default PaymentType;
