import React, { useState } from 'react';
import { SafeAreaView, View, ScrollView, Text } from 'react-native';
import appStyles from '../../../Assets/native/appStyles';
import Widget from '../../../Widgets/native/widget';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import { colors } from '../../../Assets/native/colors';
import CustomSerach from '../../../Widgets/native/customsearch';
import { Calender, Export, UILINES } from '../../../Assets/native/images';
import CommonRoundContainer from '../../../Widgets/native/CommonRoundContainer';
import ReportsInnerTabs from './ReportsInnerTab';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import { getMobileSalesReport, getSalesReport } from '../action';
import { useSelector } from 'react-redux';
import ExportWrapper from './ExportWrapper';
import { navigationKeys, reportsNavigationKeys } from '../../../Helpers/native/constants';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { machineList } from '../../Dashboard/action';
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing';
import { modalInitialValues, REPORT_TYPE_LIST, SALES_COUNT_TABLE_COLUMNS, SLOWEST_FASTEST_SELLING_COLUMN } from '../constant';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import useSelectedValue from '../../../Hooks/reportDropdownSelectionData/useSelectedValue';
import ReportsCategoriesModal from '../../../Widgets/native/modals/ReportsCategoriesModal';
import { createAndDownloadExcelFile, generateRandomString } from '../../../Widgets/native/commonNativeFunctions';
import { showToaster } from '../../../Widgets/native/commonFunction';
import CollapsibleList from './collapsabelList';
import useSelectableData from '../../../Hooks/selectUnselectValues/useSelectableData';


const Reports = ({ navigation }) => {
  const [modalStates, setModalStates] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedValue, setSelectedValue] = useState(modalInitialValues);
  const [selectedData, handleSelection] = useSelectableData();
  const [debounceSearch] = useDebouncing(searchText, 1000);
  const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state.filterSlice);
  const { data: { data } = {}, isLoading } = useFetchData({ key: "SALESREPORT", fn: getMobileSalesReport, start_date: commonDateFilter, end_date: commonEndDate, machine_id: commonMachineIdFilter, type: selectedValue?.id, limit: 30, search: debounceSearch });
  const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });


  const addSection = (combinedData, title, headers, data) => {
    if (data && Array?.isArray(data)) {
      combinedData?.push([title]);
      if (headers) combinedData?.push(headers);
      data?.forEach(item => combinedData?.push(Object?.values(item)));
      combinedData?.push(['']);
    }
  }

  const exportAll = async () => {
    try {
      const combinedData = [];
      addSection(combinedData, 'Machines Data', ['Machine ID', 'Machine Name'], data?.data);
      addSection(combinedData, 'Least Selling Products', ['Count', 'Machine Name', 'Product ID', 'Product Name'], data?.least_selling);
      addSection(combinedData, 'Top Selling Products', ['Count', 'Machine Name', 'Product ID', 'Product Name'], data?.top_selling);

      if (data?.total_sales) {
        combinedData?.push(['Sales']);
        combinedData?.push(['Total Sales', data?.total_sales]);
      }

      if (data?.pagination?.total) {
        combinedData?.push(['Vend Items']);
        combinedData?.push(['Total Vends', data?.pagination?.total]);
      }
      createAndDownloadExcelFile(combinedData);
    } catch (error) {
      console.error('Download error:', error);
      showToaster("error", 'Failed to download file');
    }
  };

  return (
    <SafeAreaView>
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
          {/* <ScrollView style={{ flex: 1, }}> */}
            <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
              <ExportWrapper text={"Export All "} Icon={Export} handler={() => exportAll()} />
              {/* <ExportWrapper text={"Schedule Sales "} Icon={Calender} /> */}
              {/* <ExportWrapper text={"List"} Icon={UILINES} handler={() => navigation?.navigate(navigationKeys?.salesreport, selectedValue)} /> */}
            </View>

            <ScrollView style={{ flex: 1, }}>

            <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
              <CommonRoundContainer text={"Total Vends"} data={data?.pagination?.total} isLoading={isLoading} />
              <CommonRoundContainer text={"Total Sales($)"} data={data?.total_sales} isLoading={isLoading} />
            </View>


            <ReportsInnerTabs top={data?.top_selling} least={data?.least_selling} isLoading={isLoading} array={SLOWEST_FASTEST_SELLING_COLUMN}
              firstTabName={reportsNavigationKeys.topseller} secondTabName={reportsNavigationKeys.slowseller} />

            {/* <Text style={[appStyles.subHeaderText, { marginTop: 5 }]}>{"Sales Reports" || ""}</Text> */}


            <CollapsibleList listData={data}
              filtersBy={selectedValue}
              querykey={"SALESREPORTING"}
              keyOfArrayOrFunctions={"SALES"}
              search={searchText}
              // heading={"Sales Reports"}
              // isLoading={isLoading}
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

    </SafeAreaView>

  );
};

export default Reports;

