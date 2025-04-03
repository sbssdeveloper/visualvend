import { View, Text, SafeAreaView } from 'react-native'
import React, { useMemo } from 'react'
import CustomSerach from '../../../../Widgets/native/customsearch'
import Widget from '../../../../Widgets/native/widget'
import ProductHeadings from '../../../../Widgets/native/ProductHeadings'
import DurationModal from '../../../../Widgets/native/modals/durationmodal'
import MachineIdModal from '../../../../Widgets/native/modals/machineIdModal'
import useInfiniteFetchData from '../../../../Hooks/fetchCustomInfiniteData/useFetchInfineData'
import { machineList } from '../../../Dashboard/action'
import appStyles from '../../../../Assets/native/appStyles'
import useCustomTextData from '../../../../Hooks/customTextData/useCustomTextData'
import { colors } from '../../../../Assets/native/colors'
import useModalStates from '../../../../Hooks/modalStates/useModalStates'
import { useDebouncing } from '../../../../Hooks/useDebounce/useDeboucing'
import NavigationHeader from '../../../../Widgets/native/navigationHeader'
import CurrentMachineHeader from '../../../../Widgets/native/currentMachineHeader'
import { CheckboxMarked, Edit, Export, ExportIconBlack, ExportUpload, SelectRoundBox, Uncheckbox, UnSelectedRoundBox, UploadBlueIcon } from '../../../../Assets/native/images'
import ExportWrapper from '../../../Reports/native/ExportWrapper'
import CollapsibleList from '../../../Reports/native/collapsabelList'
import { planogramListingMobile } from '../../actions'
import { useSelector } from 'react-redux'
import useSelectedValue from '../../../../Hooks/reportDropdownSelectionData/useSelectedValue'
import CustomModal from '../../../../Widgets/native/customModal'
import { machineConfigNavigationKeys, machineNavigationKeys, planogramFilter } from '../../../../Helpers/native/constants'
import useSelectableData from '../../../../Hooks/selectUnselectValues/useSelectableData'
import { createAndDownloadExcelFile } from '../../../../Widgets/native/commonNativeFunctions'
import { showToaster } from '../../../../Widgets/native/commonFunction'
import useFetchData from '../../../../Hooks/fetchCustomData/useFetchData'
import { useNavigation } from '@react-navigation/native'

const PlanogramList = ({ route: { params } }) => {
  const { listType } = params || {};
  const [searchText, setSearchText] = useCustomTextData();
  const [debounceSearch] = useDebouncing(searchText, 1000)
  const [selectedData, handleSelection] = useSelectableData();
  const [modalStates, setModalStates] = useModalStates();
  const { commonMachineIdFilter } = useSelector(state => state.filterSlice);
  const [planogramDataFetchType, setPlanogramFetchType] = useSelectedValue();
  const navigation = useNavigation()

  const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });

  const { data: planogramData, isFetching } = useInfiniteFetchData({ key: "PLANOGRAMLIST", fn: planogramListingMobile, search: debounceSearch, machine_id: commonMachineIdFilter, type: planogramDataFetchType?.id || "machine" });

  const planogramList = useMemo(() => {
    return planogramData?.map(item => planogramDataFetchType?.id === "machine" ? ({ ...item?.machine }) : item);
  }, [planogramData]);

  const handler = (data) => {
    setPlanogramFetchType(data);
    setModalStates(null);
  }

  const exportToExcel = () => {
    if (planogramList?.length > 0 && selectedData?.length > 0) {
      createAndDownloadExcelFile(planogramList?.filter(({ id }) => selectedData?.includes(id) || []))
    } else {
      showToaster("error", "You have not any selected item ")
    }
  }

  const { icon, unSelect, ...rest } = planogramDataFetchType || {};


  return (
    <SafeAreaView>
      <NavigationHeader />
      <CurrentMachineHeader text={"Machines"} />
      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
        <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />
        <View style={[appStyles.gap_10, appStyles.pv_10]}>
          {/* <Widget setMddalStates={setModalStates} modalStates={modalStates}
            extraModal={planogramDataFetchType}
            modalType={"CUSTOMMODAL"}
          /> */}
        </View>
        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground }]}>
          {/* <ProductHeadings heading={"Planogram List"} style={appStyles.justifyCStart} /> */}
          <View style={[appStyles.rowSpaceBetweenAlignCenter, { alignSelf: "flex-end" }]}>
            <ExportWrapper text={"Upload Planogram"} Icon={UploadBlueIcon} handler={() => navigation.navigate(machineNavigationKeys.uploadplanogram)} />
          </View>
          <View style={[appStyles.rowSpaceBetweenAlignCenter, { alignSelf: "flex-end", }]}>
            {planogramList?.length > 0 && selectedData?.length > 0 && <ExportWrapper text={"Export"} Icon={ExportIconBlack} textStyle={{ color: colors.lightBlack }} handler={() => exportToExcel()} />}
          </View>
          <CollapsibleList
            querykey={"PLANOGRAMNESTEDLIST"}
            keyOfArrayOrFunctions={"PLANOGRAMLIST"}
            search={searchText}
            heading={"Machines"}
            listData={planogramList}
            isLoading={isFetching}
            filtersBy={{ ...rest, selectedKey: "id", listType }}
            selectedData={selectedData}
            handleSelection={handleSelection}
          // loadMore={loadMore}
          />
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

      <CustomModal
        text1={"Are you sure"}
        text2={"Delete this machine ? "}
        firstBtnText={"Cancel"}
        secondBtnText={"Yes"}
        onClose={() => setModalStates(null)}
        modalStates={modalStates}
        submit={() => deleteMachineUser(modalStates)}
        // loading={deleteMutation?.isPending}
        customArray={planogramFilter}
        bottomModal={true}
        handler={handler}
      />
    </SafeAreaView>
  )
}

export default PlanogramList

