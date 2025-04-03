import { View } from 'react-native';
import { paymentstyle } from './paymentstyles';
import ProgressHeadings from './progressheading';
import AmountAndType from './amountandtype';
import PaymentTypeHeading from './paymenttypeheading';
import ProgressBars from './progressbar';
import SquareBox from './squarebox';
import ProgressingHeading from './progressheading';
import { colors } from '../../../Assets/native/colors';
import { getPercentageData } from '../../../Helpers/constant';
const CardPaymentStatusContainer = ({
  editable,
  paymentData,
  isCardPayment,
  isLoading
}) => {

  return (
    <>
      <PaymentTypeHeading
        heading={"Total Card Vends"}
        editable={true}
        type={"card"}
        subHeading={"View All"}
        paymentData={paymentData}
        allPayments={paymentData?.total_card_vends || 0}
      />
      <View style={[paymentstyle.vendStausContainer, { gap: 10}]}>
        {/* <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
          <SquareBox ventStatus={"Total Vend | Total Payments"} vendValue={`${paymentData?.badges?.vend_total_pay_total_count || 0} | (A$) ${paymentData?.badges?.vend_total_pay_total_amount || 0} `} isLoading={isLoading} />
          <SquareBox ventStatus={"Successful Vends | Successful Payments Vends"} vendValue={`${paymentData?.badges?.vend_success_pay_success_count || 0} | (A$) ${paymentData?.badges?.vend_success_pay_success_amount || 0} `} isLoading={isLoading} />
        </View> */}

        {/* <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
          <SquareBox ventStatus={'Failed Vends | Successful Payments'} vendValue={`${paymentData?.badges?.vend_fail_pay_success_count || 0} | (A$) ${paymentData?.badges?.vend_fail_pay_success_amount || 0} `} isLoading={isLoading} />
          <SquareBox ventStatus={'Failed Vends | Failed Payments'} vendValue={`${paymentData?.badges?.vend_fail_pay_fail_count || 0} | (A$) ${paymentData?.badges?.vend_fail_pay_fail_amount || 0} `}  isLoading={isLoading}/>
        </View> */}

        <ProgressingHeading heading={`Vend Success Rate (${paymentData?.total_card_vend_success || 0})`} rateValue={getPercentageData(+paymentData?.total_card_vend_success || 0, +paymentData?.total_card_vends || 0) + "%"}  color={colors.appGreen} />

        <ProgressBars bcgClrProgress={"#D6EFD8"} barcolor={isLoading ? "transparent" : colors.appGreen} rateValue={getPercentageData(+paymentData?.total_card_vend_success || 0, +paymentData?.total_card_vends || 0) + "%"} />

        <ProgressingHeading heading={`Vend Failed Rate (${paymentData?.total_card_vend_fail || 0})`} rateValue={getPercentageData(+paymentData?.total_card_vend_fail || 0, +paymentData?.total_card_vends || 0) + "%"} color={colors.barRed} />

        <ProgressBars bcgClrProgress={colors.lightRed} barcolor={isLoading ? "transparent" : colors.barRed} rateValue={getPercentageData(+paymentData?.total_card_vend_fail || 0, +paymentData?.total_card_vends || 0) + "%"} />
        
        <ProgressingHeading heading={`Paymnent Success Rate (${paymentData?.total_card_payment_success || 0})`} rateValue={getPercentageData(+paymentData?.total_card_payment_success || 0, +paymentData?.total_card_vends || 0) + "%"} color={colors.cyan} />

        <ProgressBars bcgClrProgress={colors.lightCyan} barcolor={isLoading ? "transparent" : colors.cyan}  rateValue={getPercentageData(+paymentData?.total_card_payment_success || 0, +paymentData?.total_card_vends || 0) + "%"} />

        <ProgressingHeading heading={`Payment Failed Rate (${paymentData?.total_card_payment_fail || 0})`} rateValue={getPercentageData(+paymentData?.total_card_payment_fail || 0, +paymentData?.total_card_vends || 0) + "%"}   color={colors.cyan} />

        <ProgressBars bcgClrProgress={colors.lightMaroon} barcolor={isLoading ? "transparent" : colors.maroon}  rateValue={getPercentageData(+paymentData?.total_card_payment_fail || 0, +paymentData?.total_card_vends || 0) + "%"} />

        <AmountAndType isCardPayment={isCardPayment} paymentData={paymentData} rateValue={paymentData?.pay_failed_rate} />
      </View>
    </>
  );
};
export default CardPaymentStatusContainer;
