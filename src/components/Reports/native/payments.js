import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomSerach from '../../../Widgets/native/customsearch';
import Widget from '../../../Widgets/native/widget';
import ProductHeadings from '../../../Widgets/native/ProductHeadings';
import ExportWrapper from './ExportWrapper';
import CommonRoundContainer from '../../../Widgets/native/CommonRoundContainer';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import { colors } from '../../../Assets/native/colors';
import { Calender, Export, UILINES } from '../../../Assets/native/images';
import useMutationData from '../../../Hooks/useCommonMutate';
import { getMobilePaymentReport, getPaymentReport, getRefillReport } from '../action';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import { useSelector } from 'react-redux';
import ReportsInnerTabs from './ReportsInnerTab';
import NavigationHeader from '../../../Widgets/native/navigationHeader';
import CurrentMachineHeader from '../../../Widgets/native/currentMachineHeader';
import { useNavigation } from '@react-navigation/native';
import { getDimensions, navigationKeys, reportsNavigationKeys } from '../../../Helpers/native/constants';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { machineList } from '../../Dashboard/action';
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing';
import ReportsCategoriesModal from '../../../Widgets/native/modals/ReportsCategoriesModal';
import { PAYMENTS_COUNT_TABLE_COLUMNS, PRODUCT_REPORT_TYPE_LIST } from '../constant';
import useGetDataFromCache from '../../../Hooks/getCacheData/useGetDataFromCache';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import useSelectedValue from '../../../Hooks/reportDropdownSelectionData/useSelectedValue';
import CollapsibleList from './collapsabelList';
import useSelectableData from '../../../Hooks/selectUnselectValues/useSelectableData';

const ReportsPayemnts = () => {
  const [modalStates, setModalStates] = useModalStates();
  const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state.filterSlice);
  const [searchText, setSearchText] = useCustomTextData();
  const [selectedData, handleSelection] = useSelectableData();
  useDebouncing(searchText, 1000);
  const navigation = useNavigation();
  const refillSuccess = () => { }
  const refillError = () => { }
  const [selectedValue, setSelectedValue] = useSelectedValue();

  const { data: { data } = {}, isLoading } = useFetchData({
    fn: getMobilePaymentReport,
    length: 50, page: 1, refill_type: "sale", search: "", start_date: commonDateFilter,
    key: "PAYMENTREPORT",
    end_date: commonEndDate, machine_id: commonMachineIdFilter, type: selectedValue?.id || "machine",

  });

  const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });
  const { height } = getDimensions();

  return (
    <SafeAreaView>
      <View style={{ height: height - 90 }}>
        <NavigationHeader navigation={navigation} />
        <CurrentMachineHeader showDrawerIcon={false} text={"Payment Reports"} />
        <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
          <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />
          <Widget
            setMddalStates={setModalStates}
            modalStates={modalStates}
            extraModal={selectedValue}
            modalType={"SALESCATOGIRES"}

          />
          <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground, flex: 1, paddingVertical: 5 },]}>
            <ScrollView style={{ flex: 1 }}>
              {/* <View style={[appStyles.pv_20]}>
                <ProductHeadings heading={"PAYEMENTS REPORTS"}
                  backPressHandler={undefined}
                />
              </View> */}

              <View style={[appStyles.rowSpaceBetweenAlignCenter, { alignSelf: "flex-end" }]}>
                <ExportWrapper text={"Export All "} Icon={Export} />
                {/* <ExportWrapper text={"Schedule Sales "} Icon={Calender} /> */}
                {/* <ExportWrapper text={"List"} Icon={UILINES} handler={() => navigation.navigate(navigationKeys.salesreportspaymentlist, selectedValue)} /> */}
              </View>

              <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <CommonRoundContainer text={"Total Vends"} data={data?.pagination?.total} />
                <CommonRoundContainer text={"Total Failed Vends"} data={data?.badges?.failed_vends} />
              </View>

              <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <CommonRoundContainer text={"Total Refunds"} data={data?.badges?.successfull_vends} />
                <CommonRoundContainer text={"Total Payments"} data={data?.badges?.total_payments} />
              </View>

              <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <CommonRoundContainer text={"Total Cost Vend Fails (A$)"} data={data?.badges?.failed_payments} />
                <CommonRoundContainer text={"Total Refunds (A$)"} data={data?.badges?.successfull_payments} />
              </View>

              <ReportsInnerTabs top={data?.summary} least={data?.failedSummary}
                array={PAYMENTS_COUNT_TABLE_COLUMNS}
                isLoading={isLoading}
                firstTabName={reportsNavigationKeys.paymentsummery}
                secondTabName={reportsNavigationKeys.paymentstatus}
              />

              <CollapsibleList filtersBy={selectedValue}
                querykey={"PAYMENTREPORTLIST"}
                // fn={getMobilePaymentReport}
                keyOfArrayOrFunctions={"PAYMENTARRAY"}
                search={searchText}
                listData={data}
                isLoading={isLoading}
                //  loadMore={loadMore}
                // heading={"Payment Reports"}
                selectedData={selectedData}
                handleSelection={handleSelection}
              />
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

        <ReportsCategoriesModal
          modalStates={modalStates}
          setMddalStates={setModalStates}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          arrayData={PRODUCT_REPORT_TYPE_LIST}
        />

      </View>
    </SafeAreaView>

  );
}

export default ReportsPayemnts