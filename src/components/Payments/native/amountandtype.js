import { Text, View } from 'react-native';
import appStyles from '../../../Assets/native/appStyles';
import { sortWordsLength } from '../../../Helpers/native';

const AmountAndType = ({ isCardPayment, paymentData }) => {
  return (
    <>
      {
        isCardPayment ?
          <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
            <View style={[appStyles.gap_10]}>
              <Text style={[appStyles.subHeaderText, { textAlign: "center" }]}>${sortWordsLength(paymentData?.master_card ,10) || "0"}</Text>
              <Text style={{ color: "#000000" }}>M/C</Text>
            </View>
            <View style={[appStyles.gap_10]}>
              <Text style={[appStyles.subHeaderText, { textAlign: "center" }]}>${sortWordsLength(paymentData?.visa,10)|| "0"}</Text>
              <Text style={{ color: "#000000" }}>Visa </Text>
            </View>
            <View style={[appStyles.gap_10]}>
              <Text style={[appStyles.subHeaderText, { textAlign: "center" }]}>${sortWordsLength(paymentData?.debit_card,10)|| "0"}</Text>
              <Text style={{ color: "#000000" }}>Debit Card </Text>
            </View>
            
            <View style={[appStyles.gap_10]}>
              <Text style={[appStyles.subHeaderText, { textAlign: "center" }]}>${sortWordsLength(paymentData?.amex,10)|| "0"}</Text>
              <Text style={{ color: "#000000" }}>Amex</Text>
            </View>
          </View>
          :
          <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
            <View style={[appStyles.gap_10]}>
              <Text style={[appStyles.subHeaderText, { textAlign: "center" }]}>${sortWordsLength(paymentData?.apple,10)|| "0"}</Text>
              <Text style={{ color: "#000000" }}>Apple </Text>
            </View>

            <View style={[appStyles.gap_10]}>
              <Text style={[appStyles.subHeaderText, { textAlign: "center" }]}>${sortWordsLength(paymentData?.google_pay,10)|| "0"}</Text>
              <Text style={{ color: "#000000" }}>Gpay</Text>
            </View>

            <View style={[appStyles.gap_10]}>
              <Text style={[appStyles.subHeaderText, { textAlign: "center" }]}>${sortWordsLength(paymentData?.after_pay,10)|| "0"}</Text>
              <Text style={{ color: "#000000" }}>AfterPay </Text>
            </View>

            <View style={[appStyles.gap_10]}>
              <Text style={[appStyles.subHeaderText, { textAlign: "center" }]}>${sortWordsLength(paymentData?.paypal,10)|| "0"}</Text>
              <Text style={{ color: "#000000" }}>Paypal </Text>
            </View>
          </View>
      }
    </>
  );
};
export default AmountAndType;
