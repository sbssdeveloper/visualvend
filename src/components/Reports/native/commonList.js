import { View, Text, SafeAreaView, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import CustomSerach from '../../../Widgets/native/customsearch'
import CurrentMachineHeader from '../../../Widgets/native/currentMachineHeader'
import NavigationHeader from '../../../Widgets/native/navigationHeader'
import { useNavigation } from '@react-navigation/native'
import appStyles from '../../../Assets/native/appStyles'
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData'
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing'
import { colors } from '../../../Assets/native/colors'
import { useSelector } from 'react-redux'
import useSelectedValue from '../../../Hooks/reportDropdownSelectionData/useSelectedValue'
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData'
import {
  getMobileClientFeedbackReport, getMobileCustomerReport, getMobileExpiryProductReport, getMobileGiftReport, getMobileMediaAdReport,
  getMobilePaymentReport, getMobileRefillReport, getMobileSalesReport, getMobileServiceReport, getMobileStaffReport, getMobileStockReport,
  getMobileVendActivityReport, getMobileVendErrorReport,
} from '../action'
import { feedbackStyles } from '../../Dashboard/native/allfeedbacks/feedbackstyles'
import { getDimensions, matchKey } from '../../../Helpers/native/constants'
import NoRecords from '../../../Widgets/native/noRecords'
import useModalStates from '../../../Hooks/modalStates/useModalStates'
import usePageCount from '../../../Hooks/pageCounter/usePageCount'
import Widget from '../../../Widgets/native/widget'
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData'
import { sortWordsLength } from '../../../Helpers/native'
import AppSkelton from '../../../Widgets/native/skelton'
import { planogramListingMobile } from '../../Machines/actions'
import { OptionDots, Uncheckbox } from '../../../Assets/native/images'

const CommonList = ({ listData, route: { params } = {} }) => {
  const navigation = useNavigation();
  // const [selectedValue, setSelectedValue] = useSelectedValue();
  // const [searchText, setSearchText] = useCustomTextData();
  // useDebouncing(searchText, 1000);
  // const { pageCount, incrementPageCount } = usePageCount();
  // const [modalStates, setModalStates] = useModalStates();
  const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state.filterSlice);
  const queryFn = getDynamicFuction(params?.keyOfArrayOrFunctions);
  const listArray = getDynamicArray(params?.keyOfArrayOrFunctions);
  const { height } = getDimensions();
  const halfDeviceHeight = height * 0.7;

  const getValues = () => {
    if (typeof params === 'object' && params?.item && Object?.keys(params?.item)?.length > 0) {
      const keyName = Object?.keys(params?.item)?.find(element => matchKey(element));
      return params?.item[keyName]
    }
  }

  const { data: listingData, isPending, hasNextPage, fetchNextPage } = useInfiniteFetchData({
    key: params?.querykey || "", fn: queryFn, start_date: commonDateFilter, end_date: commonEndDate,
    extraParamsForFunction: true,
    type: params?.filtersBy?.id || "machine",
    value: getValues() || "active",
    machine_id: commonMachineIdFilter,
  });

  const loadMore = () => hasNextPage && fetchNextPage();
  const renderSpinner = () => <ActivityIndicator color={colors.steelBlue} />;


  const handler = () => null;

  const renderItem = ({ item: fieledItems,index:outer } = {}) => {

    console.log("=====FIELD",fieledItems,"=======>>>>>Fild item")

    return (<>
      <View style={[{ padding: 20, }]}>
        <AdditionColumns rightColumn={<OptionDots />} LeftColumn={<Uncheckbox />} handler={handler}
          style={[appStyles.rowSpaceBetweenAlignCenter, { bottom: 10, }]}
        />
        {listArray?.map((item, index) => {
          return(
          <View style={styles.row} key={item?.id || index}>
            <Text style={styles.label}>{item?.label?.replace(/_/g, ' ')}: </Text>
            <Text style={styles.value}>{fieledItems[item?.key]}</Text>
          </View>
        )
      
  })}
        <View style={styles.lineStye} />
      </View>
    </>)
  };

  return (
    <SafeAreaView>
      <NavigationHeader navigation={navigation} />
      <CurrentMachineHeader showDrawerIcon={false} text={params?.heading} />
      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground, flex: 1, },]}>
          <View style={[feedbackStyles.feedbackListMainContainer, { marginTop: 20 }]}>
            <View style={{ height: halfDeviceHeight + 100, paddingVertical: 5, }}>
              <View style={{}}>
                {isPending ? <AppSkelton height={halfDeviceHeight + 0} length={1} width={"100%"} /> :
                  <FlatList
                    data={listingData || []}
                    renderItem={renderItem}
                    keyExtractor={(item) => item?.id}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<View style={{ paddingTop: 200 }}>
                      <NoRecords isPending={isPending} />
                    </View>
                    }
                    contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
                  />
                }
              </View>
            </View>
          </View>
        </View>

      </View>
    </SafeAreaView>
  )
}

export default CommonList;


const AdditionColumns = ({ rightColumn, LeftColumn, style, handler }) => (
  <TouchableOpacity style={style} onPress={() => handler()}>
    {LeftColumn}
    {rightColumn}
  </TouchableOpacity>

)




const getDynamicFuction = (key) => {
  const multipleArrays = {
    'SALES': getMobileSalesReport,
    'REFILL': getMobileRefillReport,
    'STOCKLEVEL': getMobileStockReport,
    "VENDACTIVITY": getMobileVendActivityReport,
    "EXPIRYPRODUCT": getMobileExpiryProductReport,
    "VENDERROR": getMobileVendErrorReport,
    "CLIENDFEEDBACK": getMobileClientFeedbackReport,
    "MEDIAADVERTISEMENT": getMobileMediaAdReport,
    "STAFFREPORTS": getMobileStaffReport,
    "SERVICEARRAY": getMobileServiceReport,
    "CUSTOMERARRAY": getMobileCustomerReport,
    "ERECIPTARRAY": getMobileCustomerReport,
    "GIFTVENDARRAY": getMobileGiftReport,
    "PAYMENTARRAY": getMobilePaymentReport,
    "PLANOGRAMLIST": planogramListingMobile
  };
  return multipleArrays[key] || [];
};



const getDynamicArray = (key) => {
  const multipleArrays = {
    'SALES': salesArray,
    'REFILL': refillArray,
    'STOCKLEVEL': stockLevelArray,
    "VENDACTIVITY": vendActivityArray,
    "EXPIRYPRODUCT": expiryProducts,
    "VENDERROR": vendErrorArray,
    "CLIENDFEEDBACK": clientFeebBack,
    "MEDIAADVERTISEMENT": mediaAdverArray,
    "STAFFREPORTS": staffListArray,
    "SERVICEARRAY": serviceArray,
    "CUSTOMERARRAY": customerArray,
    "ERECIPTARRAY": eReciptArray,
    "GIFTVENDARRAY": giftVendArray,
    "PAYMENTARRAY": paymentArray,
    "PLANOGRAMLIST": planogramArray,
  };
  return multipleArrays[key] || [];
};

const salesArray = [
  { label: "Machine Name", key: "machine_name", id: 1 },
  { label: "Product ID", key: "product_id", id: 2 },
  { label: "Product Name", key: "product_name", id: 3 },
  { label: "Product Price", key: "product_price", id: 4 },
  { label: "Employee", key: "employee_name", id: 5 },
  { label: "SKU#", key: "sku", id: 6 },
  { label: "Aisle#", key: "aisle_no", id: 7 },
  { label: "Pickup/Return", key: "pickup_or_return", id: 8 },
  { label: "Timestamp", key: "timestamp", id: 9 },
];

const refillArray = [
  { id: 1, key: "machine_name", label: "Machine Name" },
  { id: 2, key: "product_id", label: "Product ID" },
  { id: 3, key: "product_name", label: "Product Name" },
  { id: 4, key: "aisle_no", label: "Aisle#" },
  { id: 5, key: "refill_qty", label: "Refill Qty" },
  { id: 6, key: "aisle_remain_qty", label: "Maximum Qty" },
  { id: 7, key: "timestamp", label: "Timestamp" },
];

const stockLevelArray = [
  { id: 1, key: "aisle_number", label: "Aisle No" },
  { id: 2, key: "category_id", label: "Category Name" },
  { id: 3, key: "product_id", label: "Product ID" },
  { id: 4, key: "product_name", label: "Product Name" },
  { id: 5, key: "last_refill_date", label: "Last Refill Date" },
  { id: 6, key: "last_refill_amount", label: "Last Refill Amount" },
  { id: 7, key: "stock_percentage", label: "Stock Qty" },
  { id: 8, key: "product_max_quantity", label: "Max Qty" },
  { id: 9, key: "need_refill_amount", label: "Need Refill Qty" },
  { id: 10, key: "", label: "SOH" },
];

const vendActivityArray = [
  { id: 1, key: "transaction_id", label: "Trans ID" },
  { id: 2, key: "machine_name", label: "Machine" },
  { id: 3, key: "aisle_no", label: "Aisle#" },
  { id: 4, key: "product_id", label: "Product Id" },
  { id: 5, key: "product_name", label: "Product Name" },
  { id: 6, key: "product_price", label: "Product Price" },
  { id: 7, key: "payment_source", label: "Payment Source" },
  { id: 8, key: "payment_status", label: "Payment Status" },
  { id: 9, key: "timestamp", label: "Vend Date" },
  { id: 10, key: "pickup_or_return", label: "Pickup/Return" },
  { id: 11, key: "vend_status", label: "Vend Status" },
  { id: 12, key: "receipt_id", label: "Receipt Id" },
  { id: 13, key: "client_user_name", label: "Client Name" },
  { id: 14, key: "client_user_number", label: "Client Number" },
];

const expiryProducts = [
  { id: 1, key: "aisle_number", label: "Aisle No" },
  { id: 2, key: "category_id", label: "Category Name" },
  { id: 3, key: "product_id", label: "Product Id" },
  { id: 4, key: "product_name", label: "Product Name" },
  { id: 5, key: "expiry_date", label: "Expiry Date" },
  { id: 6, key: "stock_percentage", label: "Stock Percentage" },
  { id: 7, key: "product_max_quantity", label: "Max Qty" },
];

const vendErrorArray = [
  { id: 1, key: "defect_id", label: "Defect Id" },
  { id: 2, key: "machine_name", label: "Machine Name" },
  { id: 3, key: "product_name", label: "Product Name" },
  { id: 4, key: "defective_location", label: "Aisle#" },
  { id: 5, key: "error_code", label: "Error Code" },
  { id: 6, key: "status", label: "Status" },
  { id: 7, key: "timestamp", label: "Timestamp" },
];

const clientFeebBack = [
  { id: 1, key: "transaction_id", label: "Transaction Id" },
  { id: 2, key: "machine_name", label: "Machine Name" },
  { id: 3, key: "product_id", label: "Product ID" },
  { id: 4, key: "product_name", label: "Product Name" },
  { id: 5, key: "customer_name", label: "Customer Name" },
  { id: 6, key: "customer_phone", label: "Customer Phone" },
  { id: 7, key: "customer_email", label: "Customer Email" },
  { id: 8, key: "complaint", label: "Complaint" },
  { id: 9, key: "feedback", label: "Feedback" },
  { id: 10, key: "timestamp", label: "Timestamp" },
];

const mediaAdverArray = [
  { id: 1, key: "advert_title", label: "Advert Title" },
  { id: 2, key: "advert_des", label: "Advert Description" },
  { id: 3, key: "advert_start_date", label: "Advert Start Date" },
  { id: 4, key: "advert_end_date", label: "Advert End Date" },
  { id: 5, key: "advert_url", label: "Advert URL" },
  { id: 6, key: "advert_photo", label: "Advert Photo" },
  { id: 7, key: "created_at", label: "Creation Date" },
];

const staffListArray = [
  { id: 1, key: "transaction_id", label: "Transaction Id" },
  { id: 2, key: "job_number", label: "Job" },
  { id: 3, key: "cost_center", label: "Cost Center" },
  { id: 4, key: "employee_id", label: "Emp. ID" },
  { id: 5, key: "employee_full_name", label: "Employee" },
  { id: 6, key: "product_id", label: "Product ID" },
  { id: 7, key: "product_name", label: "Product" },
  { id: 8, key: "product_sku", label: "Product SKU" },
  { id: 9, key: "machine_name", label: "Machine" },
  { id: 10, key: "pickup_or_return", label: "Status" },
  { id: 11, key: "timestamp", label: "Timestamp" },
];

const serviceArray = [
  { id: 1, key: "asile_no", label: "Asile No." },
  { id: 2, key: "category_id", label: "Category" },
  { id: 3, key: "machine_name", label: "Machine Name" },
  { id: 4, key: "product_id", label: "Product ID" },
  { id: 5, key: "product_name", label: "Product Name" },
  { id: 6, key: "product_price", label: "Product Price" },
  { id: 7, key: "service_type", label: "Service Type" },
  { id: 8, key: "product_quantity", label: "Stock Qty" },
];

const customerArray = [
  { id: 1, key: "machine_name", label: "Machine Name" },
  { id: 2, key: "transaction_id", label: "Trans ID" },
  { id: 3, key: "name", label: "Name" },
  { id: 4, key: "email", label: "Email" },
  { id: 5, key: "mobile_number", label: "Mobile" },
  { id: 6, key: "timestamp", label: "Timestamp" },
];

const eReciptArray = [
  { id: 1, key: "machine_name", label: "Machine Name" },
  { id: 2, key: "transaction_id", label: "Trans ID" },
  { id: 3, key: "name", label: "Name" },
  { id: 4, key: "email", label: "Email" },
  { id: 5, key: "mobile_number", label: "Mobile" },
  { id: 6, key: "timestamp", label: "Timestamp" },
];

const giftVendArray = [
  { id: 1, key: "transaction_id", label: "Transaction Id" },
  { id: 2, key: "product", label: "Product Name" },
  { id: 3, key: "price", label: "Product Price" },
  { id: 4, key: "name", label: "Name" },
  { id: 5, key: "email", label: "Email" },
  { id: 6, key: "mobile_number", label: "Mobile" },
  { id: 7, key: "skin_concern", label: "Skin Concern" },
  { id: 8, key: "client_name", label: "Client Name" },
  { id: 9, key: "machine_name", label: "Machine Name" },
  { id: 10, key: "timestamp", label: "Timestamp" },
];

const paymentArray = [
  { id: 1, key: "transaction_id", label: "Transaction ID" },
  { id: 2, key: "product_name", label: "Product Name" },
  { id: 3, key: "machine_name", label: "Machine Name" },
  { id: 4, key: "pay_method_name", label: "Payment Method" },
  { id: 5, key: "amount", label: "Amount(AUD)" },
  { id: 6, key: "payment_status", label: "Payment Status" },
  { id: 7, key: "created_at", label: "Timestamp" },
];

const planogramArray = [
  { id: 1, key: "name", label: "Name" },
  { id: 3, key: "name", label: "Machine Name" },
  { id: 2, key: "product_name", label: "Mode" },
  { id: 4, key: "age_verify", label: "Age Verify" },
  { id: 5, key: "duration", label: "Duration" },
  { id: 6, key: "payment_status", label: "Ltd Stock" },
  { id: 7, key: "start_date", label: "Start Date/Time" },
  { id: 8, key: "end_date", label: "End Date/Time" },
  { id: 9, key: "date", label: "Date" },
  { id: 10, key: "status", label: "Status" },
];

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: colors.appBackground,
    borderRadius: 10,
    margin: 10,
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#777777",
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#222222',
  },
  value: {
    color: '#333',
  },
  lineStye: {
    height: 1,
    width: "100%",
    backgroundColor: "#E7E7E7",
    marginVertical: 5,
  },
});