import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import ExportWrapper from "./ExportWrapper"
import { colors } from '../../../Assets/native/colors';
import Widget from "../../../Widgets/native/widget"
import CustomSerach from "../../../Widgets/native/customsearch"
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import ProductHeadings from '../../../Widgets/native/ProductHeadings';
import { feedbackStyles } from '../../Dashboard/native/allfeedbacks/feedbackstyles';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import { Calender, DeleteBlackIcon, DeleteIcon, Export, ExportIconBlack, UILINES } from '../../../Assets/native/images';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal';
// import CollapsibleList from '../collapsabelList';
import { getMobileSalesReport, getSalesReport } from '../action';
import { useSelector } from 'react-redux';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { machineList } from '../../Dashboard/action';
import ReportsCategoriesModal from '../../../Widgets/native/modals/ReportsCategoriesModal';
import NavigationHeader from '../../../Widgets/native/navigationHeader';
import CurrentMachineHeader from '../../../Widgets/native/currentMachineHeader';
import CollapsibleList from './collapsabelList';
import { REPORT_TYPE_LIST } from '../constant';
import appStyles from '../../../Assets/native/appStyles';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import useSelectedValue from '../../../Hooks/reportDropdownSelectionData/useSelectedValue';
import usePageCount from '../../../Hooks/pageCounter/usePageCount';
import useIsScreenFocused from '../../../Hooks/FocusEffect/useIsScreenFocused';
import useSelectableData from '../../../Hooks/selectUnselectValues/useSelectableData';


const SaleReportList = ({ navigation, route: { params } = {} }) => {
  const [searchText, setSearchText] = useCustomTextData();
  const [debounceSearch] = useDebouncing(searchText, 1000);
  const { pageCount, incrementPageCount } = usePageCount();
  const [selectedData, handleSelection] = useSelectableData();
  const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state.filterSlice);
  const { data: { data } = {}, isLoading } = useFetchData({
    key: "SALESREPORTING", fn: getMobileSalesReport, start_date: commonDateFilter, end_date: commonEndDate, machine_id: commonMachineIdFilter,
    type: params?.id || "machine",
    length: 30 * pageCount, page: 1,
    search: debounceSearch,

  });
  const [modalStates, setModalStates] = useModalStates();
  const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });

  const loadMore = () => data?.data?.length > 29 && incrementPageCount();


  console.log(params,"=======>>PARAMS")
  

  return (
    <SafeAreaView>

      <NavigationHeader navigation={navigation} />
      <CurrentMachineHeader showDrawerIcon={false} text={"Sales Report"} />

      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
        <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />

        <View style={[appStyles.pv_20, appStyles.gap_10]}>
          <Widget
            setMddalStates={setModalStates}
            modalStates={modalStates}
          // extraModal={selectedValue}
          />
        </View>

        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground, flex: 1, },]}>

          <ScrollView style={{}}>
            <View>
              {/* <View style={[appStyles.pv_20]}>
                <ProductHeadings heading={"SALES REPORTS"}
                  backPressHandler={undefined}
                />
              </View> */}

              <View style={[appStyles.rowSpaceBetweenAlignCenter, { alignSelf: "flex-end" }]}>

                <ExportWrapper text={"Export All "} Icon={ExportIconBlack} textStyle={{ color: colors.lightBlack }} />
                <ExportWrapper text={"Delete Items(s) "} Icon={DeleteBlackIcon} textStyle={{ color: colors.lightBlack }} />
                {/* <ExportWrapper text={"List"} Icon={UILINES} /> */}
              </View>
            </View>
            <View style={[feedbackStyles.feedbackListMainContainer,]}>
              <CollapsibleList
                filtersBy={{...params,}}
                querykey={"SALESREPORTING"}
                keyOfArrayOrFunctions={"SALES"}
                search={searchText}
                heading={"Sales Reports"}
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


      {/* <ReportsCategoriesModal
        modalStates={modalStates}
        setMddalStates={setModalStates}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        arrayData={REPORT_TYPE_LIST}
      /> */}


    </SafeAreaView>
  )
}

export default SaleReportList


