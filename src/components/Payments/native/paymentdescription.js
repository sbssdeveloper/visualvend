import { Text, View } from 'react-native';
import moment from 'moment';
import appStyles, { fonts } from '../../../Assets/native/appStyles';
import { CautionIcon, ShareIcon } from '../../../Assets/native/images';
import { sortWordsLength } from '../../../Helpers/native';
import { colors } from '../../../Assets/native/colors';
import { getStatusDetails } from '../../../Widgets/native/commonNativeFunctions';

const PaymentDescription = ({ item }) => {
  const date = moment(item?.created_at || new Date());
  const formattedDate = date.format('D MMM  YYYY  HH:mm:ss A');
  const { color, status } = getStatusDetails(item?.vend_status);
  return (
    <View style={[{ paddingVertical: 10, }, appStyles.gap_10,]}>
      <View style={[appStyles.rowSpaceBetweenAlignCenter, {}]}>
        <Text style={[appStyles.blackText,fonts.semiBold, { color: item?.payment_status === "SUCCESS" ? "#222222" : "#DC405C" }]}>
        {item?.payment_status === "SUCCESS" ? "Payment Accepted" :sortWordsLength(item?.failure_reason || "Payment Failed", 30)}
        </Text>
        {/* <ShareIcon /> */}
      </View>
      {
        status &&
        <Text style={[appStyles.blackText,fonts.semiBold, { color: color ? color : colors.pureBlack, }]}>{status || ""}</Text>
      }

      <View>
        <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start" },]}>
          <Text style={[appStyles.blackText,fonts.mediumm, { fontSize: 12, textAlign: "left" }]}>{sortWordsLength(item?.product_name, 35) || ""} </Text>
        </View>
        <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: undefined, top: 5, gap: 5 },]}>
          <Text style={[appStyles.blackText,fonts.mediumm, { fontSize: 12, color: colors.appLightGrey }]}>Amount:</Text>
          <Text style={[appStyles.blackText, fonts.mediumm,{ fontSize: 12, color: colors.appLightGrey}]}> {item?.amount || ""}</Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={[{ fontSize: 12, color: colors.appLightGrey },fonts.mediumm]}>Machine: {item?.machine_name || ""}</Text>
        </View>
      </View>

      <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 20 }]}>
        <Text style={[{ fontSize: 12, color: colors.appLightGrey },fonts.regular]}>{formattedDate || ""}</Text>
        <CautionIcon />
      </View>

    </View>
  );
};
export default PaymentDescription;
