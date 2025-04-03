import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import appStyles, { fonts } from '../../../Assets/native/appStyles';
import { colors } from '../../../Assets/native/colors';
import { navigationKeys } from '../../../Helpers/native/constants';

const PaymentTypeHeading = ({ heading, subHeading, editable, paymentData, allPayments,type }) => {
  const navigation = useNavigation();
  return (
    <View style={[appStyles.rowSpaceBetweenAlignCenter, { paddingVertical: 10 }]}>
      {editable ? (
        <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
          <Text style={[appStyles.subHeaderText]}>{heading} :</Text>
          <Text style={[appStyles.subHeaderText, { color: '#149CBE' }]}> {`${` ${allPayments || ""}`}`}</Text>
        </View>
      ) : (
        <Text style={[appStyles.subHeaderText]}>{heading}</Text>
      )}
      <TouchableOpacity
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10, }}
        disabled={editable ? false : true}
        onPress={() => navigation.navigate(navigationKeys?.mobilepayment,{payType:type})}>
        <Text style={[{ color: editable ? colors.appLightGrey : colors.mediummBlack },fonts.mediumm]}>{subHeading}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default PaymentTypeHeading;
