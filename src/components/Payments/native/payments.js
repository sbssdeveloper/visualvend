import { View, SafeAreaView, ScrollView, Text } from 'react-native';
import React, { useMemo, useState } from 'react'
import PaymentChart from './paymentchart';
import CardPaymentStatusContainer from './cardpaymentstatuscontainer';
import MobilePaymentStatusContainer from './mobilepaymentstatuscontainer';
import { useSelector } from 'react-redux';
import Widget from '../../../Widgets/native/widget';
import appStyles from '../../../Assets/native/appStyles';
import { colors } from '../../../Assets/native/colors';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal';
import LoaderComponent from '../../../Widgets/native/loaderComponent';
import { machineList } from '../../Dashboard/action';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { paymentList } from '../action';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import SquareBox from './squarebox';
import PaymentTypeHeading from './paymenttypeheading';
import { navigationKeys } from '../../../Helpers/native/constants';
import { useNavigation } from '@react-navigation/native';

const Payments = (props) => {
  const { commonMachineIdFilter, commonDateFilter, commonEndDate } = useSelector(state => state.filterSlice);
  const [modalStates, setModalStates] = useModalStates();
  const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });

  const { data: paymentData, isLoading } = useFetchData({
    key: "GETPAYMENTDETAILS", fn: paymentList, start_date: commonDateFilter, end_date: commonEndDate,
    machine_id: commonMachineIdFilter, type: "all",
    device: "mobile",
  });

  const badges = useMemo(() => paymentData?.data?.data?.badges, [paymentData])
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
        {isLoading && <LoaderComponent />}
        <View style={[appStyles.gap_10]}>
          <Widget setMddalStates={setModalStates} modalStates={modalStates} />
        </View>

        <ScrollView>
          <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground, marginBottom: 10 },]}>
            <PaymentTypeHeading
              heading={"Payments"}
              editable={false}
            // subHeading={"View All"}
            // paymentData={paymentData}
            // allPayments={paymentData?.total_card_vends || 0}
            />

            <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
              <SquareBox ventStatus={"Total Vend | Total Payments"} touchableHandler={() => navigation?.navigate(navigationKeys?.mobilepayment, { payStaus: "all", categoryType: "tvtp" })}
                count={badges?.vend_total_pay_total_count || 0}
                total={badges?.vend_total_pay_total_amount || 0} isLoading={isLoading} />

              <SquareBox ventStatus={"Successful Vends | Successful Payments"} touchableHandler={() => navigation?.navigate(navigationKeys?.mobilepayment, { payStaus: "success", categoryType: "svsp" })}
                count={badges?.vend_success_pay_success_count}
                total={badges?.vend_success_pay_success_amount}
                isLoading={isLoading} />
            </View>

            <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
              <SquareBox ventStatus={'Failed Vends | Successful Payments'} touchableHandler={() => navigation?.navigate(navigationKeys?.mobilepayment, { payStaus: "error", categoryType: "fvsp" })}
                count={badges?.vend_fail_pay_success_count}
                total={badges?.vend_fail_pay_success_amount}
                isLoading={isLoading} />

              <SquareBox ventStatus={'Failed Vends | Failed Payments'} touchableHandler={() => navigation?.navigate(navigationKeys?.mobilepayment, { payStaus: "error", categoryType: "fvfp" })}
                count={badges?.vend_fail_pay_fail_count}
                total={badges?.vend_fail_pay_fail_amount}
                isLoading={isLoading} />
            </View>


            <CardPaymentStatusContainer
              paymentData={paymentData?.data?.data}
              isCardPayment={true}
              isLoading={isLoading}
            />
            <MobilePaymentStatusContainer
              paymentData={paymentData?.data?.data}
              editable={true}
              isLoading={isLoading}
            />
            <PaymentChart chartData={paymentData?.data?.data} />
          </View>
        </ScrollView>
      </View>

      <DurationModal
        modalStates={modalStates}
        setMddalStates={setModalStates}
      />

      <MachineIdModal
        machineDetails={machineDetails?.data}
        modalStates={modalStates}
        setMddalStates={setModalStates}
      />

    </SafeAreaView>

  );

};

export default Payments;



