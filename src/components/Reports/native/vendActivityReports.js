import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import { getDimensions, navigationKeys } from '../../../Helpers/native/constants';
import NavigationHeader from '../../../Widgets/native/navigationHeader';
import CurrentMachineHeader from '../../../Widgets/native/currentMachineHeader';
import CustomSerach from '../../../Widgets/native/customsearch';
import Widget from '../../../Widgets/native/widget';
import ProductHeadings from '../../../Widgets/native/ProductHeadings';
import ExportWrapper from './ExportWrapper';
import CommonRoundContainer from '../../../Widgets/native/CommonRoundContainer';
import ReportsInnerTabs from './ReportsInnerTab';
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import appStyles from '../../../Assets/native/appStyles';
import { Calender, Export, UILINES } from '../../../Assets/native/images';
import { colors } from '../../../Assets/native/colors';
import { useSelector } from 'react-redux';
import { getMobileVendActivityReport, getVendActivityReport } from '../action';
import { REPORT_TYPE_CONST, REPORT_TYPE_LIST } from '../constant';
import ReportsCategoriesModal from '../../../Widgets/native/modals/ReportsCategoriesModal';
import { machineList } from '../../Dashboard/action';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import useSelectedValue from '../../../Hooks/reportDropdownSelectionData/useSelectedValue';
import CollapsibleList from './collapsabelList';
import useSelectableData from '../../../Hooks/selectUnselectValues/useSelectableData';


const VendActiveReports = () => {

  const [modalStates, setModalStates] = useModalStates();
  const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state.filterSlice);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useCustomTextData();
  const [debounceSearch] = useDebouncing(searchText, 1000);
  const [selectedData, handleSelection] = useSelectableData();
  const [selectedValue, setSelectedValue] = useSelectedValue();
  const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });

  const refillSuccess = () => { }
  const refillError = () => { }

  const { data: { data } = {}, isLoading } = useFetchData({
    fn: getMobileVendActivityReport,
    length: 50, page: 1, search: debounceSearch, start_date: commonDateFilter,
    key: "VENDACTIVITYREPORTS",
    end_date: commonEndDate, machine_id: commonMachineIdFilter, type: selectedValue?.id || "machine",
  });

  const { height } = getDimensions();

  return (
    <SafeAreaView>
      <View style={{ height: height - 90 }}>
        <NavigationHeader navigation={navigation} />
        <CurrentMachineHeader showDrawerIcon={false} text={"Vend Activity Reports"} />
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
              <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <ExportWrapper text={"Export All "} Icon={Export} />
                <ExportWrapper text={"Schedule Active "} Icon={Calender} />
                {/* <ExportWrapper text={"List"} Icon={UILINES} handler={() => navigation.navigate(navigationKeys.salevendactivelist, selectedValue)} /> */}
              </View>

              <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <CommonRoundContainer text={"Total Vends"}
                  data={data?.pagination?.total}
                />
                <CommonRoundContainer text={"Total Sales($)"}
                  data={data?.sales} />
              </View>

              <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <CommonRoundContainer text={"Failed Vends"}
                  data={data?.failed}
                />
                <CommonRoundContainer text={"Transactions Cancelled"}
                  data={data?.cancelled} />
              </View>

              <CollapsibleList filtersBy={selectedValue}
                querykey={"VENDACTIVITYLISTING"}
                // fn={getVendActivityReport}
                // arraySelectionKey={"VENDACTIVITY"}
                keyOfArrayOrFunctions={"VENDACTIVITY"}
                search={searchText}
                // heading={"Vend Active Reports"}
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
          arrayData={REPORT_TYPE_LIST}
        />

      </View>
    </SafeAreaView>

  );
}

export default VendActiveReports