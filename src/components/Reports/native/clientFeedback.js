import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomSerach from '../../../Widgets/native/customsearch';
import Widget from '../../../Widgets/native/widget';
import ProductHeadings from '../../../Widgets/native/ProductHeadings';
import ExportWrapper from './ExportWrapper';
import CommonRoundContainer from '../../../Widgets/native/CommonRoundContainer';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal';
import ReportsCategoriesModal from '../../../Widgets/native/modals/ReportsCategoriesModal';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import { colors } from '../../../Assets/native/colors';
import { Calender, DeleteBlackIcon, Export, ExportIconBlack, UILINES } from '../../../Assets/native/images';
import useMutationData from '../../../Hooks/useCommonMutate';
import { getClientFeedbackReport, getMobileClientFeedbackReport, getRefillReport, getVendErrorReport } from '../action';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import { useSelector } from 'react-redux';
import ReportsInnerTabs from './ReportsInnerTab';
import NavigationHeader from '../../../Widgets/native/navigationHeader';
import CurrentMachineHeader from '../../../Widgets/native/currentMachineHeader';
import { useNavigation } from '@react-navigation/native';
import { getDimensions, navigationKeys } from '../../../Helpers/native/constants';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { machineList } from '../../Dashboard/action';
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing';
import { feedbackStyles } from '../../Dashboard/native/allfeedbacks/feedbackstyles';
import CollapsibleList from './collapsabelList';
import { REPORT_CLIENT_FEEDBACK_LIST, REPORT_VEND_ERROR_LIST } from '../constant';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import useSelectedValue from '../../../Hooks/reportDropdownSelectionData/useSelectedValue';
import usePageCount from '../../../Hooks/pageCounter/usePageCount';
import useSelectableData from '../../../Hooks/selectUnselectValues/useSelectableData';

const ClientFeedback = ({ navigation={} }) => {
  const [searchText, setSearchText] = useCustomTextData();
  const [selectedData, handleSelection] = useSelectableData();
  const [debounceSearch] = useDebouncing(searchText, 1000);
  const { pageCount, incrementPageCount } = usePageCount();
  const [selectedValue, setSelectedValue] = useSelectedValue();
  const [modalStates, setModalStates] = useModalStates();
  const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state.filterSlice);
  const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });

  const { data: { data } = {}, isLoading } = useFetchData({ key: "CLIENTFEEDBACKREPORTS", fn: getMobileClientFeedbackReport, start_date: commonDateFilter, end_date: commonEndDate, machine_id: commonMachineIdFilter, type: selectedValue?.id || "machine", length: 30 * pageCount, page: 1, search: debounceSearch });
  const loadMore = () => data?.data?.length > 29 && incrementPageCount();
  return (
    <SafeAreaView>

      <NavigationHeader navigation={navigation} />
      <CurrentMachineHeader showDrawerIcon={false} text={"Feedback Reports"} />

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
              <View style={[appStyles.pv_20]}>
                {/* <ProductHeadings heading={"FEEDBACK REPORTS"}
         backPressHandler={undefined}
        /> */}
              </View>

              <View style={[appStyles.rowSpaceBetweenAlignCenter]}>

                <ExportWrapper text={"Export All "} Icon={Export} />
                <ExportWrapper text={"Schedule Feedback Reports "} Icon={Calender} />
                {/* <ExportWrapper text={"List"} Icon={UILINES} /> */}
              </View>

              <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <ExportWrapper text={"Export"} Icon={ExportIconBlack} textStyle={{ color: colors.lightBlack }} />
                <ExportWrapper text={"Delete Items (s) "} Icon={DeleteBlackIcon} textStyle={{ color: colors.lightBlack }} />
              </View>
            </View>
            <View style={[feedbackStyles.feedbackListMainContainer]}>
              <CollapsibleList filtersBy={selectedValue}
                heading={"Feedback Reports"}
                listData={data} isLoading={isLoading} loadMore={loadMore}
                querykey={"CLIENTFEEDBACKREPORTS"} keyOfArrayOrFunctions={"CLIENDFEEDBACK"} search={searchText}
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
        arrayData={REPORT_CLIENT_FEEDBACK_LIST}
      />
    </SafeAreaView>
  )
}

export default ClientFeedback