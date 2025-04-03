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
import { getMobileRefillReport, getMobileSalesReport, getRefillReport } from '../action';
import { machineList } from '../../Dashboard/action';

import appStyles from '../../../Assets/native/appStyles';
import { useSelector } from 'react-redux';
import { Calender, DeleteBlackIcon, Export, ExportIconBlack, UILINES } from '../../../Assets/native/images';
import { feedbackStyles } from '../../Dashboard/native/allfeedbacks/feedbackstyles';
import { REPORT_REFILL_TYPE_LIST, REPORT_TYPE_LIST } from '../constant';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import useSelectedValue from '../../../Hooks/reportDropdownSelectionData/useSelectedValue';
import usePageCount from '../../../Hooks/pageCounter/usePageCount';
import useSelectableData from '../../../Hooks/selectUnselectValues/useSelectableData';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';



const RefillReportList = ({ navigation, route: { params } = {} }) => {
  const [selectedData, handleSelection] = useSelectableData();
  const [searchText, setSearchText] = useCustomTextData();
  const { pageCount, incrementPageCount } = usePageCount();
  const [debounceSearch] = useDebouncing(searchText, 1000);
  const [modalStates, setModalStates] = useModalStates();
  const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state.filterSlice);

  const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });
  const { data: { data } = {}, isLoading } = useFetchData({
    fn: getMobileRefillReport,
    length: 30 * pageCount, page: 1,
    refill_type: "sale", search: "", start_date: commonDateFilter,
    key: "REFILLSALESDETAILS",
    end_date: commonEndDate, machine_id: commonMachineIdFilter, type: params?.id || "machine",
    search: debounceSearch,
  });
  const [selectedValue, setSelectedValue] = useSelectedValue();
  const loadMore = () => data?.data?.length > 0 && incrementPageCount();


  return (
    <SafeAreaView>

      <NavigationHeader navigation={navigation} />
      <CurrentMachineHeader showDrawerIcon={false} text={"Refill Reports"} />

      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
        <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />

        <View style={[appStyles.pv_20, appStyles.gap_10]}>

          <Widget
            setMddalStates={setModalStates}
            modalStates={modalStates}
          // extraModal={selectedValue}
          />

        </View>


        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground, flex: 1, paddingVertical: 5 },]}>


          <ScrollView style={{ flex: 1, }}>
            <View>
              {/* <View style={[appStyles.pv_20]}>
        <ProductHeadings heading={"REFILL REPORTS"}
         backPressHandler={undefined}
        />
       </View> */}

              <View style={[appStyles.rowSpaceBetweenAlignCenter,]}>

                <ExportWrapper text={"Export All "} Icon={ExportIconBlack} textStyle={{ color: colors.lightBlack }} />
                <ExportWrapper text={"Delete Items(s) "} Icon={DeleteBlackIcon} textStyle={{ color: colors.lightBlack }} />
                {/* <ExportWrapper text={"List"} Icon={UILINES} /> */}
              </View>

            </View>


            <View style={[feedbackStyles.feedbackListMainContainer, { marginVertical: 20, padding: 10, }]}>

              <CollapsibleList
                filtersBy={params}
                querykey={"REFILLREPORTLIST"} fn={getMobileSalesReport} arraySelectionKey={"REFILL"}
                keyOfArrayOrFunctions={"REFILL"}
                search={searchText}
                heading={"Refill Reports"}
                listData={data} isLoading={isLoading} loadMore={loadMore}
                selectedData={selectedData}
                handleSelection={handleSelection}
              />

            </View>


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


    </SafeAreaView>
  )
}

export default RefillReportList