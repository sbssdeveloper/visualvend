import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Widget from '../../../Widgets/native/widget';
import CustomSerach from '../../../Widgets/native/customsearch';
import CurrentMachineHeader from '../../../Widgets/native/currentMachineHeader';
import NavigationHeader from '../../../Widgets/native/navigationHeader';
import ProductHeadings from '../../../Widgets/native/ProductHeadings';
import ExportWrapper from './ExportWrapper';
import { Calender, DeleteBlackIcon, Export, ExportIconBlack, UILINES } from '../../../Assets/native/images';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal';
import ReportsCategoriesModal from '../../../Widgets/native/modals/ReportsCategoriesModal';
import { getMobileStockReport, getStockReport } from '../action';
import { colors } from '../../../Assets/native/colors';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import { feedbackStyles } from '../../Dashboard/native/allfeedbacks/feedbackstyles';
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing';
import CollapsibleList from './collapsabelList';
import { REPORT_STOCK_TYPE_LIST } from '../constant';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { machineList } from '../../Dashboard/action';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import useSelectedValue from '../../../Hooks/reportDropdownSelectionData/useSelectedValue';
import { useSelector } from 'react-redux';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import usePageCount from '../../../Hooks/pageCounter/usePageCount';
import useSelectableData from '../../../Hooks/selectUnselectValues/useSelectableData';



const StockLevelReports = ({ navigation }) => {
  const [searchText, setSearchText] = useCustomTextData();
  const [selectedValue, setSelectedValue] = useSelectedValue();
  const [selectedData, handleSelection] = useSelectableData();
  const [debounceSearch] = useDebouncing(searchText, 1000);
  const { pageCount, incrementPageCount } = usePageCount();
  const [modalStates, setModalStates] = useModalStates();
  const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state.filterSlice);
  const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });
  const { data: { data } = {}, isLoading } = useFetchData({
    key: "STOCKLEVELDETAILS", fn: getMobileStockReport, start_date: commonDateFilter, end_date: commonEndDate, machine_id: commonMachineIdFilter, type: selectedValue?.id || "machine", length: 30 * pageCount, page: 1,
    search: debounceSearch,
  });

  const loadMore = () => data?.data?.length > 29 && incrementPageCount();

  return (
    <SafeAreaView>
      <NavigationHeader navigation={navigation} />
      <CurrentMachineHeader showDrawerIcon={false} text={"Stock Level Report"} />

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
          <ScrollView style={{ flex: 1, }}>
            <View>
              <View style={[appStyles.rowSpaceBetweenAlignCenter, { alignSelf: "flex-end" }]}>
                <ExportWrapper text={"Export All "} Icon={Export} />
                {/* <ExportWrapper text={"Schedule Sales "} Icon={Calender} /> */}
              </View>

              <View style={[appStyles.rowSpaceBetweenAlignCenter, { alignSelf: "flex-end" }]}>
                <ExportWrapper text={"Export All "} Icon={ExportIconBlack} textStyle={{ color: colors.lightBlack }} />
                <ExportWrapper text={"Delete Items(s) "} Icon={DeleteBlackIcon} textStyle={{ color: colors.lightBlack }} />
              </View>
            </View>

            <View style={[feedbackStyles.feedbackListMainContainer]}>
              <CollapsibleList filtersBy={selectedValue} querykey={"SALESTOCKLEVELREPORTS"} fn={getStockReport} search={searchText}
                keyOfArrayOrFunctions={"STOCKLEVEL"}
                listData={data} isLoading={isLoading} loadMore={loadMore}
                heading={"Stock Level  Reports"}
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
        arrayData={REPORT_STOCK_TYPE_LIST}
        customStyle={{ height: 300 }}
      />


    </SafeAreaView>
  )
}

export default StockLevelReports