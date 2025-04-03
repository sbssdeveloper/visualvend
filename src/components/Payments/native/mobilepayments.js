
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import CustomSerach from '../../../Widgets/native/customsearch'
import moment from 'moment';
import PaymentMethodModal from './paymentMethodModal';
import PaymentStatusModal from './paymentStatusModal';
import { useSelector } from 'react-redux';
import appStyles from '../../../Assets/native/appStyles';
import { colors } from '../../../Assets/native/colors';
import NoRecords from '../../../Widgets/native/noRecords';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import { DownArrow, } from '../../../Assets/native/images';
import NavigationHeader from '../../../Widgets/native/navigationHeader';
import CurrentMachineHeader from '../../../Widgets/native/currentMachineHeader';
import AllMachineIdModal from '../../../Widgets/native/modals/allMachineIdModal';
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { paymentActivities } from '../../Payments_listing/action';
import CustomListing from '../../../Widgets/native/customListing';
import PaymentType from './paymenttype';
import PaymentDescription from './paymentdescription';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import usePageCount from '../../../Hooks/pageCounter/usePageCount';
import { paymentStatusArray, paymethod } from '../constant';
import { navigationKeys } from '../../../Helpers/native/constants';

const Mobilepayments = ({ navigation, route: { params = {} } }) => {
  const [searchText, setSearchText] = useCustomTextData();
  const [debounceSearch] = useDebouncing(searchText, 1000);
  const { pageCount, incrementPageCount } = usePageCount();

  const { commonDateFilter, commonEndDate, commonShowingDate } = useSelector(state => state.filterSlice);
  const [modalStates, setMddalStates] = useState({
    isVisible: false,
    selectValue: '',
    selectMachineId: '',
    selectMachineName: '',
    payloadValue: "all",
    paymentType: "card",
    paymentMethod: "",
    paymentMethodName: "",
  });

  const {
    isPending: isPaymentStustPending,
    data,
    isSuccess,
  } = useFetchData({
    type: params?.categoryType ? "" : modalStates?.payloadValue || "all",
    machine_id: modalStates?.selectMachineId || 'all',
    fn: paymentActivities, key: "GETPAYMENTSTATUS",
    length: 50 * pageCount,
    badge_type: params?.categoryType,
    search: debounceSearch, start_date: commonDateFilter, end_date: commonEndDate, pay_type: params?.categoryType ? "" : params?.payType || modalStates?.paymentType, pay_method: params?.categoryType ? "" : modalStates?.paymentMethod
  });

  const loadMore = param => data?.data?.pagination?.total > paymentStatusData?.length && incrementPageCount();
  const renderSpinner = param => <ActivityIndicator color={colors.steelBlue} />

  const openModal = (value) => {
    // navigation.setParams({categoryType:""});
    setMddalStates(prev => {
      return {
        ...prev,
        isVisible: value,
      };
    });
  }

  const { data: { data: paymentStatusData } = {} } = {} = data || {};

  console.log( params?.categoryType ? "" : params?.payType || modalStates?.paymentType);


  const resetParams = (isCardType) => {
    
    navigation.setParams({ ...params, categoryType: "",payType:params?.payType || params?.categoryType ? "" :  "card"});
  }


  return (
    <SafeAreaView>
      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
        <NavigationHeader />
        <CurrentMachineHeader text={"Payments"} />
        <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />
        <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.ph_10, { paddingVertical: 5, backgroundColor: 'white' }]}>

          <Filters
            selectedTitle={commonShowingDate}
            defautTitle={"Today"}
            openModal={() => openModal("selectDay")}
          />
          <Filters
            selectedTitle={modalStates?.paymentMethodName}
            defautTitle={"Select pay method"}
            openModal={() => openModal("paymentMethod")}
          />
        </View>
        <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.ph_10, { paddingVertical: 5 }]}>
          <Filters
            selectedTitle={modalStates?.selectValue}
            defautTitle={"Select event"}
            openModal={() => openModal("paymentActivity")}
          />
          <Filters
            selectedTitle={modalStates?.selectMachineName}
            defautTitle={"Select machine"}
            openModal={() => openModal("allMachineId")}
          />
        </View>

        <View style={{ backgroundColor: colors.appBackground, flex: 1 }}>

          <FlatList
            data={paymentStatusData || []}
            renderItem={({ item }) => <RenderItems item={item} />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            // ListFooterComponent={isPaymentStustPending ? renderSpinner : null}
            ListEmptyComponent={<View style={{ marginTop: 150 }}>
              <NoRecords isPending={isPaymentStustPending} customText={"No Payments Found"} />
            </View>}
          />

        </View>
      </View>
      <DurationModal modalStates={modalStates?.isVisible === "selectDay" ? "selectDay" : null} setMddalStates={setMddalStates} />
      <AllMachineIdModal modalStates={modalStates} setMddalStates={setMddalStates} />
      <PaymentStatusModal modalStates={modalStates} setMddalStates={setMddalStates} resetParams={resetParams} />
      <PaymentMethodModal modalStates={modalStates} setMddalStates={setMddalStates} resetParams={resetParams} />
    </SafeAreaView>
  );
};

export default Mobilepayments;

const RenderItems = ({ item }) => {

  return (
    <View style={{ marginHorizontal: 10, marginVertical: 5 }}>
      <CustomListing
        FirstSection={<PaymentType item={item} />}
        SecondSection={<PaymentDescription item={item} />}
      />
    </View>
  );
};

const Filters = ({ selectedTitle, openModal, defautTitle }) =>
  <TouchableOpacity onPress={() => openModal()} style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, padding: 2, }]}>
    <Text style={[appStyles.blackText]}>
      {selectedTitle || defautTitle}
    </Text>
    <DownArrow />
  </TouchableOpacity>

const getPaymentEvents = (payEvents = '') => {
  const data = paymentStatusArray?.find(item => item?.value === payEvents);
  return data ? data?.value : payEvents || "";
}







