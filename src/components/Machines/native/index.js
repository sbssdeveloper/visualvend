import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import roundcontainerstyles from '../../../Widgets/native/roundcontainer/roundcontainerstyles';
import appStyles, { fonts } from '../../../Assets/native/appStyles';
import NoRecords from '../../../Widgets/native/noRecords';
import { colors } from '../../../Assets/native/colors';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { machineList } from '../../Dashboard/action';
import AppSkelton from '../../../Widgets/native/skelton';
import { getDimensions, machineNavigationKeys, } from '../../../Helpers/native/constants';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import { Add, CheckboxMarked, DeleteIcon, Edit, EditBlack, Export, MachineLogo, OptionDots, SelectIcon, TrushIcon, UILINES, Uncheckbox, } from '../../../Assets/native/images';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import CustomSerach from "../../../Widgets/native/customsearch";
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing';
import Widget from '../../../Widgets/native/widget';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import ProductHeadings from '../../../Widgets/native/ProductHeadings';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal';
import ReportsCategoriesModal from '../../../Widgets/native/modals/ReportsCategoriesModal';
import usePageCount from '../../../Hooks/pageCounter/usePageCount';
import { MACHINES_SORT_OPTIONS } from '../constants';
import ExportWrapper from '../../Reports/native/ExportWrapper';
import { deleteMachine } from '../actions';
import CustomModal from '../../../Widgets/native/customModal';
import useMutationData from '../../../Hooks/useCommonMutate';
import useInvalidateQuery from '../../../Hooks/useInvalidateQuery';
import { showToaster } from '../../../Widgets/native/commonFunction';
import useSelectedValue from '../../../Hooks/reportDropdownSelectionData/useSelectedValue';
import useSelectableData from '../../../Hooks/selectUnselectValues/useSelectableData';
import { screens } from "../constants"
import { createAndDownloadExcelFile } from '../../../Widgets/native/commonNativeFunctions';
import CustomDropDown from '../../../Widgets/native/customDropDown';
import { Swipeable } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';



const Machines = ({ navigation = {} }) => {
  const [selectedData, handleSelection] = useSelectableData();
  const [searchText, setSearchText] = useCustomTextData();
  const [debounceSearch] = useDebouncing(searchText, 1000);
  const [modalStates, setModalStates] = useModalStates();
  const { pageCount, incrementPageCount } = usePageCount();
  const { invalidateQuery } = useInvalidateQuery();
  const [selectedValue, setSelectedValue] = useState({ value: 'created_at-ASC', name: 'By Creation Date' });
  const { width } = getDimensions() || {};
  const sortedValues = selectedValue?.value.split("-");
  const swipeableRef = useRef(null);
  // const isFocused = useIsFocused();


  
  useEffect(() => {
    if (swipeableRef?.current) {
      swipeableRef?.current?.openRight();
      setTimeout(() => {
        swipeableRef?.current?.close();
      }, 2000);
    }
  }, []);



  const handleSuccess = (data) => {
    setModalStates(null);
    const { message } = data?.data || {};
    showToaster("success", message);
    invalidateQuery("GETMACHINELISTDATA");
  };

  const machineErrorHandler = (data) => {
    const { message } = data?.data || {};
    setModalStates(null);
    showToaster("error", message || "Something went wrong while deleting machine");
    setModalStates(null);
  };

  const exportToExcel = (param) => {
    if (param) {
      createAndDownloadExcelFile([param]);
      return
    }
    if (data?.data?.length > 0 && selectedData?.length > 0) {
      createAndDownloadExcelFile(data?.data?.filter(({ id }) => selectedData?.includes(id)))
    }
  }

  const allSelected = selectedData?.length > 2 ? true : false;
  const deleteMutation = useMutationData(deleteMachine, (data) => handleSuccess(data), (error) => machineErrorHandler(error));
  const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });
  const loadMore = () => data?.data?.length < data?.total && incrementPageCount();
  const sortHandler = () => setModalStates("SALESCATOGIRES");
  const navigator = (path, value) => navigation?.navigate(path, value);
  const deleteMachineUser = (param = []) => deleteMutation?.mutate(param[1]);
  const handleSelectDeselect = (data) => handleSelection(allSelected ? "deselectAll" : "selectAll", data);

  const { data: { data: { data } = {} } = {}, isLoading, isSuccess } = useFetchData({
    length: 25 * pageCount,
    key: "GETMACHINELISTDATA",
    fn: machineList,
    direction: sortedValues[1] || "ASC",
    search: debounceSearch,
    sort: sortedValues[0] || selectedValue?.value,
    extraParamsForFunction: true
  });

  const handler = (item) => navigator(machineNavigationKeys?.machineupsert, { ...item, editMode: true })


  const optionHandler = ({ item } = {}, selectedItem) => {
    if (item?.id === 3) {
      exportToExcel(selectedItem);
    } else item?.screen && navigation?.navigate(item?.screen, selectedItem)
  }

  const renderSpinner = () => <ActivityIndicator color={colors.steelBlue} size={"small"} />;

  const renderRightActions = (item) => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity onPress={() => handler(item)} style={styles.rightSideButton}>
        <EditBlack />
      </TouchableOpacity>
      <View style={styles.buttonSpacing} />
      <TouchableOpacity style={styles.rightSideButton} onPress={() => {
        setModalStates(["CUSTOMMODAL", item?.id])
      }}>
        <DeleteIcon />
      </TouchableOpacity>
    </View>
  );


  const renderItem = ({ item = {}, index }) => {

    return (
      <Swipeable
        ref={index === 0 ? swipeableRef : null}
        renderRightActions={() => renderRightActions(item)}
        rightThreshold={20}
        friction={2}
        overshootRight={false}
      >

        <View style={{ flex: 1, }}>
          <Text style={[appStyles.subHeaderText, { fontSize: 14, marginVertical: 5, left: 5 }]}>
            {item?.machine_name || ""}
          </Text>

          <View style={[roundcontainerstyles.roundBox, { height: undefined, width: "100%", paddingVertical: 5, elevation: 1, shadowColor: colors.veryLightGrey }]}>
            <View style={{ gap: 5 }}>
              {/* <TouchableOpacity onPress={() => handleSelection(item?.id)}>
              {selectedData?.includes(item?.id) ? <CheckboxMarked height={20} width={20} /> : <Uncheckbox height={20} width={20} />}
            </TouchableOpacity> */}

              <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <TouchableOpacity onPress={() => handleSelection(item?.id)} style={{ left: 10 }}>
                  {selectedData?.includes(item?.id) ? <CheckboxMarked height={20} width={20} /> : <Uncheckbox height={20} width={20} />}
                </TouchableOpacity>

                {/* <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 5, justifyContent: "flex-start", left: 10 }]} >
                  <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.gap_5]} onPress={() => navigator(machineNavigationKeys?.machineupsert, { ...item, editMode: true })}>
                    <Edit />
                    <Text style={[appStyles.subHeaderText, { color: colors.cyan }]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.gap_5]} onPress={() => setModalStates(["CUSTOMMODAL", item?.id])}>
                    <TrushIcon />
                    <Text style={[appStyles.subHeaderText, { color: "#FE0C0C" }]}>Remove</Text>
                  </TouchableOpacity>
                </View> */}

                <CustomDropDown listItem={screens?.filter((element) => [3, 4, 7]?.includes(element?.id))} width={200} setValues={(optionvalue) => optionHandler(optionvalue, item)} icon={<OptionDots />} />
              </View>


              <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start" }]}>
                <View style={{ flex: 0.2 }}>
                  <MachineLogo height={35} width={35} />
                </View>
                <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.ph_10, { flex: 0.8, justifyContent: "flex-start", }]}>
                  {screens
                    ?.filter((element) => [1, 2, 5, 6]?.includes(element?.id))
                    .map((element) => (
                      <View key={element?.id} style={{ padding: 2 }}>
                        <TouchableOpacity
                          onPress={() => navigation?.navigate(element?.screen, { ...item, listType: "CommonMachineList" })}
                          disabled={!element?.screen}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Text style={[appStyles.subHeaderText, fonts.regular, { color: colors.appLightGrey }]}>
                            {element?.text || ""}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView>
      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
        <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />
        {/* <Widget setMddalStates={setModalStates} modalStates={modalStates}  /> */}
        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground }]}>
          <ProductHeadings heading={selectedValue?.name} style={appStyles.justifyCStart} subHeading={true} rightDropHander={sortHandler} backPressHandler={() => navigation?.goBack()} />
          <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
            <ExportWrapper text={"List"} Icon={UILINES} handler={() => navigator(machineNavigationKeys?.planogramlist, { listType: machineNavigationKeys.commonmahcineList })} />
            <ExportWrapper text={allSelected ? "Deselect all" : "Select all "} Icon={SelectIcon} handler={() => handleSelectDeselect(allSelected ? null : data?.data)} />
            {selectedData?.length > 0 && <ExportWrapper text={"Export to Excel"} Icon={Export} handler={() => exportToExcel()} />}
            <ExportWrapper text={"Add"} Icon={Add} handler={() => navigator(machineNavigationKeys?.machineupsert)} extraStyle={{ gap: 0 }} />
          </View>
          {isLoading && pageCount < 2 && <AppSkelton height={100} width={width} length={10} />}

          <FlatList
            nestedScrollEnabled
            data={data?.data}
            renderItem={renderItem}
            onEndReached={loadMore}
            keyExtractor={(_, index) => index?.toString()}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.3}
            ListFooterComponent={isLoading && renderSpinner}
            ListEmptyComponent={
              <View style={{ top: 100 }}>
                <NoRecords isPending={isLoading} />
              </View>
            }
            contentContainerStyle={{ paddingBottom: !isLoading ? 120 : 0 }}
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
      <ReportsCategoriesModal
        modalStates={modalStates}
        setMddalStates={setModalStates}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        arrayData={MACHINES_SORT_OPTIONS}
      />
      <CustomModal
        text1={"Are you sure"}
        text2={"Delete this machine ? "}
        firstBtnText={"Cancel"}
        secondBtnText={"Yes"}
        onClose={() => setModalStates(null)}
        modalStates={modalStates}
        submit={() => deleteMachineUser(modalStates)}
        loading={deleteMutation?.isPending}
      />
    </SafeAreaView>
  );
};

export default Machines;


const styles = StyleSheet.create({

  itemContainer: {
    marginVertical: 5,
  },
  rightActionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: "flex-end",
    backgroundColor: "transparent",
    paddingHorizontal: 10,
  },
  rightSideButton: {
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    height: "70%",
    padding: 20,
    borderRadius: 5,
    shadowColor: colors.appLightGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 0.5,
  },
  buttonSpacing: {
    width: 10,
  },
  customListing: {
    // Add your custom styles here
  },
  noRecordsContainer: {
    paddingVertical: 50,
  },
})