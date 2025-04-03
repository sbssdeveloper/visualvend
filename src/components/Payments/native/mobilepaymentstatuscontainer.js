import { View } from 'react-native';
import { paymentstyle } from './paymentstyles';
import AmountAndType from './amountandtype';
import PaymentTypeHeading from './paymenttypeheading';
import ProgressBars from './progressbar';
import SquareBox from './squarebox';
import ProgressingHeading from './progressheading';
import { colors } from '../../../Assets/native/colors';
import { getPercentageData } from '../../../Helpers/constant';

const MobilePaymentStatusContainer = ({
  editable,
  paymentData,
  isCardPayment,
  isLoading
}) => {

  console.log(paymentData,"pay data")

  return (
    <>
      <PaymentTypeHeading
        heading={"Total Mobile Vends"}
        editable={editable}
        subHeading={"View All"}
        paymentData={paymentData}
        type={"mobile"}
        allPayments={paymentData?.total_mobile_vends || 0}
      />
      <View style={[paymentstyle.vendStausContainer, { gap: 10 }]}>
        <ProgressingHeading
          heading={`Mobile Vend Success Rate (${paymentData?.total_mobile_vend_success || 0})`}
          rateValue={getPercentageData(+paymentData?.total_mobile_vend_success || 0, +paymentData?.total_mobile_vends || 0) + "%"}
          color={colors.appGreen}
        />
        <ProgressBars bcgClrProgress={"#D6EFD8"} barcolor={isLoading ? "transparent" : colors.appGreen} rateValue={getPercentageData(+paymentData?.total_mobile_vend_success || 0, +paymentData?.total_mobile_vends || 0) + "%"} />
        <ProgressingHeading
          heading={`Mobile Vend Failed Rate (${paymentData?.total_mobile_vend_fail || 0})`}
          rateValue={getPercentageData(+paymentData?.total_mobile_vend_fail || 0, +paymentData?.total_mobile_vends || 0) + "%"}
          color={colors.barRed} />
        <ProgressBars bcgClrProgress={colors.lightRed} barcolor={isLoading ? "transparent" : colors.barRed} rateValue={getPercentageData(+paymentData?.total_mobile_vend_fail || 0, +paymentData?.total_mobile_vends || 0) + "%"} />
        <ProgressingHeading
          heading={`Mobile Payment Success Rate  (${paymentData?.total_mobile_payment_success || 0})`}
          rateValue={getPercentageData(+paymentData?.total_mobile_payment_success || 0, +paymentData?.total_mobile_vends || 0) + "%"}
          color={colors.cyan} />
        <ProgressBars bcgClrProgress={colors.lightCyan} barcolor={isLoading ? "transparent" : colors.cyan} rateValue={getPercentageData(+paymentData?.total_mobile_payment_success || 0, +paymentData?.total_mobile_vends || 0) + "%"} />
        <ProgressingHeading
          heading={`Mobile Payment Failed Rate  (${paymentData?.total_mobile_payment_fail || 0})`}
          rateValue={getPercentageData(+paymentData?.total_mobile_payment_fail || 0, +paymentData?.total_mobile_vends || 0) + "%"}
          color={colors.cyan} />
        <ProgressBars bcgClrProgress={colors.lightMaroon} barcolor={isLoading ? "transparent" : colors.maroon} rateValue={getPercentageData(+paymentData?.total_mobile_payment_fail || 0, +paymentData?.total_mobile_vends || 0) + "%"} />
        <AmountAndType isCardPayment={isCardPayment} paymentData={paymentData} />
      </View>
    </>
  );
};
export default MobilePaymentStatusContainer;
