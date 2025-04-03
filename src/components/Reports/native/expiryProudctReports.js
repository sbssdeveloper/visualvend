import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import { useSelector } from 'react-redux';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import NavigationHeader from '../../../Widgets/native/navigationHeader';
import CurrentMachineHeader from '../../../Widgets/native/currentMachineHeader';
import CustomSerach from '../../../Widgets/native/customsearch';
import Widget from '../../../Widgets/native/widget';
import ProductHeadings from '../../../Widgets/native/ProductHeadings';
import ExportWrapper from './ExportWrapper';
import { Calender, Export, ExportIconBlack, UILINES } from '../../../Assets/native/images';
import CollapsibleList from './collapsabelList';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal';
import ReportsCategoriesModal from '../../../Widgets/native/modals/ReportsCategoriesModal';
import { EXPIRY_PRODUCT_TYPE_LIST, REPORT_REFILL_TYPE_LIST } from '../constant';
import { getExpiryProductReport, getMobileExpiryProductReport, getRefillReport } from '../action';
import { feedbackStyles } from '../../Dashboard/native/allfeedbacks/feedbackstyles';
import { colors } from '../../../Assets/native/colors';
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { machineList } from '../../Dashboard/action';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import useSelectedValue from '../../../Hooks/reportDropdownSelectionData/useSelectedValue';
import usePageCount from '../../../Hooks/pageCounter/usePageCount';
import useSelectableData from '../../../Hooks/selectUnselectValues/useSelectableData';


const ExpiryProudctReports = ({ navigation }) => {
 const [searchText, setSearchText] = useCustomTextData();
 const [selectedData, handleSelection] = useSelectableData();
 const { pageCount, incrementPageCount } = usePageCount();
 const [debounceSearch] = useDebouncing(searchText, 1000);
 const [modalStates, setModalStates] = useModalStates();
 const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state.filterSlice);
 const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });
 const [selectedValue, setSelectedValue] = useSelectedValue();

 const { data: { data } = {}, isLoading } = useFetchData({
  key: "EXPIRYPRODUCTDETAILS", fn: getMobileExpiryProductReport, start_date: commonDateFilter, end_date: commonEndDate, machine_id: commonMachineIdFilter, type: selectedValue?.id || "machine", length: 30 * pageCount, page: 1,
  search: debounceSearch,
 });


 const loadMore = () => data?.data?.length > 0 && incrementPageCount();

 return (
  <SafeAreaView>
   <NavigationHeader navigation={navigation} />
   <CurrentMachineHeader showDrawerIcon={false} text={"Expiry Product Reports"} />

   <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
    <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />
     <Widget
      setMddalStates={setModalStates}
      modalStates={modalStates}
      extraModal={selectedValue}
      modalType={"SALESCATOGIRES"}
     />

    <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground, flex: 1, paddingVertical: 5 },]}>
     <ScrollView style={{ flex: 1, }}>
      <View>
       {/* <View style={[appStyles.pv_20]}>
        <ProductHeadings heading={"EXPIRY PRODUCT REPORTS"}
         backPressHandler={undefined}
        />
       </View> */}

       <View style={[appStyles.rowSpaceBetweenAlignCenter, { alignSelf: "flex-end" }]}>

        <ExportWrapper text={"Export All "} Icon={Export} />
        {/* <ExportWrapper text={"Schedule Sales "} Icon={Calender} />
        <ExportWrapper text={"List"} Icon={UILINES} /> */}
       </View>

       <View style={[appStyles.rowSpaceBetweenAlignCenter, { alignSelf: "flex-end" }]}>

       <ExportWrapper text={"Export  "} Icon={ExportIconBlack} textStyle={{color:colors.lightBlack}} />

        {/* <ExportWrapper text={"Schedule Sales "} Icon={Calender} />
        <ExportWrapper text={"List"} Icon={UILINES} /> */}
       </View>

      </View>


      <View style={[feedbackStyles.feedbackListMainContainer]}>
       <CollapsibleList filtersBy={selectedValue}
        querykey={"EXPIRYPRODUCTLIST"}
        keyOfArrayOrFunctions={"EXPIRYPRODUCT"}
        search={searchText}
        heading={"Expiry Product Reports"}
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
    arrayData={EXPIRY_PRODUCT_TYPE_LIST}
   />


  </SafeAreaView>
 )
}

export default ExpiryProudctReports