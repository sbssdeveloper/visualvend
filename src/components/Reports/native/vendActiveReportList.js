import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing';
import { useSelector } from 'react-redux';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import NavigationHeader from '../../../Widgets/native/navigationHeader';
import Widget from '../../../Widgets/native/widget';
import CustomSerach from '../../../Widgets/native/customsearch';
import ProductHeadings from '../../../Widgets/native/ProductHeadings';
import ExportWrapper from './ExportWrapper';
import { Calender, Export, ExportIconBlack, UILINES } from '../../../Assets/native/images';
import CollapsibleList from './collapsabelList';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal';
import ReportsCategoriesModal from '../../../Widgets/native/modals/ReportsCategoriesModal';
import { getMobileVendActivityReport, getRefillReport, getVendActivityReport } from '../action';
import CurrentMachineHeader from '../../../Widgets/native/currentMachineHeader';
import { colors } from '../../../Assets/native/colors';
import { feedbackStyles } from '../../Dashboard/native/allfeedbacks/feedbackstyles';
import { REPORT_TYPE_CONST, REPORT_TYPE_LIST } from '../constant';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { machineList } from '../../Dashboard/action';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import usePageCount from '../../../Hooks/pageCounter/usePageCount';
import useSelectableData from '../../../Hooks/selectUnselectValues/useSelectableData';



const VendAcitveReportList = ({ navigation, route: { params } = {} }) => {
  const [selectedData, handleSelection] = useSelectableData();
  const [searchText, setSearchText] = useCustomTextData();
  const { pageCount, incrementPageCount } = usePageCount();
  const [debounceSearch] = useDebouncing(searchText, 1000);
  const [modalStates, setModalStates] = useModalStates();
  const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state?.filterSlice);
  const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });


  const { data: { data } = {}, isLoading } = useFetchData({
    fn: getMobileVendActivityReport,
    length: 30 * pageCount, page: 1,
    search: debounceSearch, start_date: commonDateFilter,
    key: "VENDACTIVITYLISTING",

    end_date: commonEndDate, machine_id: commonMachineIdFilter, type: params?.id || "machine",
  });

  const loadMore = () => data?.data?.length > 29 && incrementPageCount();


  return (
    <SafeAreaView>

      <NavigationHeader navigation={navigation} />
      <CurrentMachineHeader showDrawerIcon={false} text={"Vend Activity Reports"} />

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

            {/* <View style={[appStyles.pv_20]}>
        <ProductHeadings heading={"vend Activity Reports"}
         backPressHandler={undefined}
        />
       </View> */}

            <View style={[appStyles.rowSpaceBetweenAlignCenter, { alignSelf: "flex-end" }]}>
              <ExportWrapper text={"Export All "} Icon={ExportIconBlack} textStyle={{ color: colors.lightBlack }} />

              {/* <ExportWrapper text={"Schedule Sales "} Icon={Calender} />
              <ExportWrapper text={"List"} Icon={UILINES} /> */}
            </View>



            <View style={[feedbackStyles.feedbackListMainContainer, { marginVertical: 20, padding: 10, }]}>
              <CollapsibleList filtersBy={params}
                querykey={"VENDACTIVITYLISTING"}
                fn={getVendActivityReport}
                arraySelectionKey={"VENDACTIVITY"}
                keyOfArrayOrFunctions={"VENDACTIVITY"}
                search={searchText}
                heading={"Vend Active Reports"}
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

    </SafeAreaView>
  )
}

export default VendAcitveReportList