import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Widget from '../../../Widgets/native/widget';
import CustomSerach from '../../../Widgets/native/customsearch';
import CurrentMachineHeader from '../../../Widgets/native/currentMachineHeader';
import NavigationHeader from '../../../Widgets/native/navigationHeader';
import ProductHeadings from '../../../Widgets/native/ProductHeadings';
import ExportWrapper from './ExportWrapper';
import CollapsibleList from './collapsabelList';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal';
import ReportsCategoriesModal from '../../../Widgets/native/modals/ReportsCategoriesModal';
import { colors } from '../../../Assets/native/colors';
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import { getMobilePaymentReport, getPaymentReport, getRefillReport } from '../action';
import appStyles from '../../../Assets/native/appStyles';
import { useSelector } from 'react-redux';
import { Calender, DeleteBlackIcon, Export, ExportIconBlack, UILINES } from '../../../Assets/native/images';
import { feedbackStyles } from '../../Dashboard/native/allfeedbacks/feedbackstyles';
import { REPORT_REFILL_TYPE_LIST, REPORT_TYPE_LIST } from '../constant';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import useSelectedValue from '../../../Hooks/reportDropdownSelectionData/useSelectedValue';
import usePageCount from '../../../Hooks/pageCounter/usePageCount';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { machineList } from '../../Dashboard/action';
import useSelectableData from '../../../Hooks/selectUnselectValues/useSelectableData';


const PaymentListing = ({ navigation, route: { params } }) => {
   const [searchText, setSearchText] = useCustomTextData();
   const { pageCount, incrementPageCount } = usePageCount();
   useDebouncing(searchText, 1000);
   const [selectedData, handleSelection] = useSelectableData();
   const [modalStates, setModalStates] = useModalStates();
   const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state.filterSlice);
   const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });


   const { data: { data } = {}, isLoading } = useFetchData({
      fn: getMobilePaymentReport,
      length: 30 * pageCount, page: 1,
      search: "", start_date: commonDateFilter,
      key: "PAYMENTLISTINGREPORT",
      end_date: commonEndDate, machine_id: commonMachineIdFilter, type: params?.id || "machine",
      search: searchText,
   });
   const loadMore = () => data?.data?.length > 29 && incrementPageCount();

   return (
      <SafeAreaView>
         <NavigationHeader navigation={navigation} />
         <CurrentMachineHeader showDrawerIcon={false} text={"Payment Reports"} />
         <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
            <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />
            <View style={[appStyles.pv_20, appStyles.gap_10]}>
               <Widget
                  setMddalStates={setModalStates}
                  modalStates={modalStates}
               />
            </View>

            <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground, flex: 1, paddingVertical: 5 },]}>
               <ScrollView style={{ flex: 1, }}>
                  <View>

                     <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                        <ExportWrapper text={"Export All "} Icon={ExportIconBlack} textStyle={{ color: colors.lightBlack }} />
                        <ExportWrapper text={"Delete Items(s) "} Icon={DeleteBlackIcon} textStyle={{ color: colors.lightBlack }} />
                        {/* <ExportWrapper text={"List"} Icon={UILINES} /> */}
                     </View>
                  </View>


                  {/* <View style={[feedbackStyles.feedbackListMainContainer, { marginVertical: 20, padding: 10, }]}>
                     <CollapsibleList filtersBy={params}
                        querykey={"PAYMENTREPORTLIST"} fn={getMobilePaymentReport}
                        keyOfArrayOrFunctions={"PAYMENTARRAY"} search={searchText}
                        listData={data}
                        isLoading={isLoading} loadMore={loadMore}
                        heading={"Payment Reports"}
                        selectedData={selectedData}
                        handleSelection={handleSelection}
                     />
                  </View> */}

               </ScrollView>

            </View>

         </View>
         <DurationModal
            modalStates={modalStates}
            setMddalStates={setModalStates}
         />

         <MachineIdModal
            modalStates={modalStates}
            setMddalStates={setModalStates}
            machineDetails={machineDetails?.data}
         />

      </SafeAreaView>
   )
}

export default PaymentListing