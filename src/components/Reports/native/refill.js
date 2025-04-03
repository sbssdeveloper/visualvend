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
import { getMobileRefillReport, getMobileSalesReport, getRefillReport } from '../action';
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
import { REPORT_REFILL_TYPE_LIST, SALES_COUNT_TABLE_COLUMNS, SLOWEST_FASTEST_SELLING_COLUMN } from '../constant';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import ReportsCategoriesModal from '../../../Widgets/native/modals/ReportsCategoriesModal';
import useSelectedValue from '../../../Hooks/reportDropdownSelectionData/useSelectedValue';
import CollapsibleList from './collapsabelList';
import useSelectableData from '../../../Hooks/selectUnselectValues/useSelectableData';

const Refill = () => {

  const [modalStates, setModalStates] = useModalStates();
  const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state.filterSlice);
  const [searchText, setSearchText] = useCustomTextData();
  const [selectedValue, setSelectedValue] = useSelectedValue();
  const [selectedData, handleSelection] = useSelectableData();
  const [debounceSearch] = useDebouncing(searchText, 1000);
  const navigation = useNavigation();
  const { height } = getDimensions();
  const refillSuccess = () => { }
  const refillError = () => { }

  const { data: { data } = {}, isLoading } = useFetchData({
    fn: getMobileRefillReport,
    length: 50, page: 1, refill_type: "sale", search: debounceSearch, start_date: commonDateFilter,
    key: "REFILLSALES",
    end_date: commonEndDate, machine_id: commonMachineIdFilter, type: selectedValue?.id || "machine",
  });
  const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });


  return (
    <SafeAreaView>
      <View style={{ height: height - 90 }}>
        <NavigationHeader navigation={navigation} />
        <CurrentMachineHeader showDrawerIcon={false} text={"Refill Reports"} />
        <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
          <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />
          <View style={[appStyles.gap_10]}>
            <Widget
              setMddalStates={setModalStates}
              modalStates={modalStates}
              extraModal={selectedValue}
              modalType={"SALESCATOGIRES"}

            />
          </View>
          <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground, flex: 1, paddingVertical: 5 },]}>
            <ScrollView style={{ flex: 1 }}>
              {/* <View style={[appStyles.pv_20]}>
                <ProductHeadings heading={"SALES REPORTS"}
                  backPressHandler={undefined}
                />
              </View> */}
              <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <ExportWrapper text={"Export All "} Icon={Export} />
                <ExportWrapper text={"Schedule Refill "} Icon={Calender} />
                {/* <ExportWrapper text={"List"} Icon={UILINES} handler={() => navigation.navigate(navigationKeys.salesrefillreportslist, selectedValue)} /> */}
              </View>
              <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <CommonRoundContainer text={"Total Refills"}
                  data={data?.total_refills}
                />
                <CommonRoundContainer text={"Vended Refills"}
                  data={data?.vended_refills} />
              </View>

              <CommonRoundContainer text={"Total Machines"}
                data={data?.total_machines}
                custumStyle={{ width: "100%" }}
              />
              <ReportsInnerTabs top={data?.top_refilling} least={data?.least_refilling} isLoading={isLoading}
                firstTabName={reportsNavigationKeys.toprefillingproducts}
                secondTabName={reportsNavigationKeys.slowestrefillingproducts}
                array={SLOWEST_FASTEST_SELLING_COLUMN}
              />

              {/* <Text style={[appStyles.subHeaderText, { marginTop: 5 }]}>{"Refill  Reports" || ""}</Text> */}

              <CollapsibleList
                filtersBy={selectedValue}
                querykey={"REFILLREPORTLIST"}
                // fn={getMobileSalesReport} arraySelectionKey={"REFILL"}
                keyOfArrayOrFunctions={"REFILL"}
                search={searchText}
                // heading={"Refill Reports"}
                listData={data}
                isLoading={isLoading}
                //  loadMore={loadMore}
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
          arrayData={REPORT_REFILL_TYPE_LIST}
        />
      </View>
    </SafeAreaView>

  );
}

export default Refill