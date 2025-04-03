import { View, Text, SafeAreaView, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import appStyles from '../../../../Assets/native/appStyles'
import useInfiniteFetchData from '../../../../Hooks/fetchCustomInfiniteData/useFetchInfineData'
import { getDimensions, machineNavigationKeys, matchKey } from '../../../../Helpers/native/constants'
import { CheckboxMarked, DeleteIcon, Edit, Export, ExportIconBlack, ExportUpload, EyeIcon, OptionDots, Uncheckbox, UploadBlueIcon } from '../../../../Assets/native/images'
import { sortWordsLength } from '../../../../Helpers/native'
import NavigationHeader from '../../../../Widgets/native/navigationHeader'
import CurrentMachineHeader from '../../../../Widgets/native/currentMachineHeader'
import AppSkelton from '../../../../Widgets/native/skelton'
import { colors } from '../../../../Assets/native/colors'
import { deletePlanogram, planogramListingMobile } from '../../actions'
import { feedbackStyles } from '../../../Dashboard/native/allfeedbacks/feedbackstyles'
import NoRecords from '../../../../Widgets/native/noRecords'
import { getColors, planogramListArray } from '../../constants'
import CustomModal from '../../../../Widgets/native/customModal'
import useModalStates from '../../../../Hooks/modalStates/useModalStates'
import ExportWrapper from '../../../Reports/native/ExportWrapper'
import ProductHeadings from '../../../../Widgets/native/ProductHeadings'
import useCustomModalText from '../../../../Hooks/customModatTextData/useCustomModalText'
import useMutationData from '../../../../Hooks/useCommonMutate'
import useSelectableData from '../../../../Hooks/selectUnselectValues/useSelectableData'
import { createAndDownloadExcelFile } from '../../../../Widgets/native/commonNativeFunctions'
import useInvalidateQuery from '../../../../Hooks/useInvalidateQuery'
import { showToaster } from '../../../../Widgets/native/commonFunction'

const MachineCommonList = ({ listData = [], route: { params } = {} }) => {
  const navigation = useNavigation();
  const [modalStates, setModalStates] = useModalStates();
  const [selectedData, handleSelection] = useSelectableData();
  const { modalText, updateModalText } = useCustomModalText();
  const { invalidateQuery } = useInvalidateQuery();
  const { commonDateFilter, commonMachineIdFilter, commonEndDate } = useSelector(state => state.filterSlice);
  const { height } = getDimensions();
  const halfDeviceHeight = height * 0.7;

  const getValues = () => {
    if (typeof params === 'object' && params?.item && Object?.keys(params?.item)?.length > 0) {
      const keyName = Object?.keys(params?.item)?.find(element => matchKey(element));
      return params?.item[keyName]
    }
  }

  const handleSuccess = (data) => {
    setModalStates(null);
    const { message } = data?.data || {};
    showToaster("success", message);
    invalidateQuery("MACHINEPLANOGRAMLISTING");

  };

  const planogramErrorHandler = (data) => {
    setModalStates(null);
    const { message } = data?.data || {};
    showToaster("error", message || "Something went wrong while deleting machine");
  };


  const { data: listingData, isPending, hasNextPage, fetchNextPage } = useInfiniteFetchData({
    key: "MACHINEPLANOGRAMLISTING" || "", fn: planogramListingMobile, start_date: commonDateFilter, end_date: commonEndDate,
    extraParamsForFunction: true,
    type: params?.filtersBy?.id || "machine",
    value: getValues() || "active",
    machine_id: commonMachineIdFilter,
    length: 30
  });

  const { mutate: deletionMutate, isPending: deletePending } = useMutationData(deletePlanogram, (data) => handleSuccess(data), (error) => planogramErrorHandler(error));
  const planogramDelete = () => Array.isArray(modalStates) && deletionMutate({ uuid: modalStates[1]?.uuid, type: modalStates[1]?.planogram_type });
  const rightWidgetHandler = (item) => setModalStates(["CUSTOMMODAL", item]);
  const loadMore = () => hasNextPage && listData > 29 && fetchNextPage();
  const renderSpinner = () => isPending && <ActivityIndicator color={colors.steelBlue} />;



  const customModalHandler = (data = {}) => {
    try {
      const [_, planogramData] = Array.isArray(modalStates) ? modalStates : [modalStates];
      const { icon, ...rest } = data;
      const machinePlanogramData = { ...planogramData, id: planogramData?.machine_id, ...rest };
      if (data?.delete && data.uniqueId === 4) handleDelete();
      if (data?.uniqueId === 2 && planogramData) createAndDownloadExcelFile([machinePlanogramData])
      data?.screen?.trim() && navigation?.navigate(data?.screen, machinePlanogramData);
    } catch (error) {
      console.error("Error in customModalHandler:", error);
    } finally {
      if (!data?.delete) setModalStates(null);
    }
  };

  const handleDelete = () => {
    updateModalText({
      text1: "Are you sure", text2: "you want to Delete Planogram ?",
      firstBtnText: "Cancel", secondBtnText: "Ok", bottomModal: false,
    });
  }

  const closeModal = () => {
    updateModalText({ text1: "", text2: "", firstBtnText: "", secondBtnText: "Ok", bottomModal: true });
    setModalStates(null);
  }


  const exportToExcel = () => {
    if (listingData?.length > 0 && selectedData?.length > 0) {
      createAndDownloadExcelFile(listingData?.filter(({ uuid }) => selectedData?.includes(uuid) || []))
    } else {
      showToaster("error", "You have not any selected item ")
    }
  }


  const renderItem = ({ item: fieledItems, index } = {}) => {
    return (<>
      <View style={[{ padding: 20, }]}>
        {planogramListArray?.map((item, index) => {
          const color = item?.additionalColor ? getColors(item?.key, fieledItems[item?.key]) : colors.mediummBlack;
          return (
            <View style={styles.row} key={item?.id || index}>
              <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start", gap: 5 }]}>
                {
                  item?.id === 1 && index === 0 && (
                    <TouchableOpacity
                      style={{ right: 15 }}
                      onPress={() => handleSelection(fieledItems?.uuid)}>
                      {selectedData?.includes(fieledItems?.uuid) ? (
                        <CheckboxMarked height={20} width={20} />
                      ) : (
                        <Uncheckbox height={20} width={20} />
                      )}
                    </TouchableOpacity>
                  )
                }
                <Text style={[styles.label, { right: index < 1 ? 15 : 0 }]}>{item?.label?.replace(/_/g, ' ')}: </Text>
              </View>
              <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start", gap: 5 }]}>
                <Text style={[styles.value, { color: color, left: index < 1 ? 15 : 0 }]}>{sortWordsLength(fieledItems[item?.key] || "", 30) || ""}</Text>
                {index < 1 &&
                  <TouchableOpacity style={{ left: 15 }} onPress={() => rightWidgetHandler(fieledItems)}>
                    <OptionDots />
                  </TouchableOpacity>
                }
              </View>
            </View>
          )
        })}
        <View style={styles.lineStye} />
      </View>
    </>)
  };
  return (
    <SafeAreaView>
      <NavigationHeader navigation={navigation} />
      <CurrentMachineHeader showDrawerIcon={false} text={"Machines"} />
      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground, flex: 1, },]}>
          {/* <ProductHeadings heading={params?.item.machine_name || "Planogram List"} style={appStyles.justifyCStart} /> */}
          <View style={[appStyles.rowSpaceBetweenAlignCenter, { alignSelf: "flex-end" }]}>
            <ExportWrapper text={"Upload Planogram"} Icon={UploadBlueIcon} />
          </View>
          <View style={[appStyles.rowSpaceBetweenAlignCenter, { alignSelf: "flex-end" }]}>
            <ExportWrapper text={"Export"} Icon={ExportIconBlack} textStyle={{ color: colors.lightBlack }} handler={() => exportToExcel()} />
          </View>
          <View style={[feedbackStyles.feedbackListMainContainer, { marginTop: 20 }]}>
            <View style={{ height: halfDeviceHeight }}>
              <View>
                {isPending ? <AppSkelton height={halfDeviceHeight} length={1} width={"100%"} /> :
                  <FlatList
                    data={listingData || []}
                    renderItem={renderItem}
                    keyExtractor={(item) => item?.uuid}
                    nestedScrollEnabled
                    onEndReached={loadMore}
                    onStartReachedThreshold={0.3}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={renderSpinner}
                    ListEmptyComponent={<View style={{ paddingTop: 200 }}>
                      <NoRecords isPending={isPending} />
                    </View>
                    }
                    contentContainerStyle={{ paddingBottom: 10, flexGrow: 1 }}
                  />
                }
              </View>
            </View>
          </View>
        </View>
      </View>
      <CustomModal
        loading={deletePending}
        onClose={() => closeModal()}
        modalStates={modalStates}
        text1={modalText?.text1}
        text2={modalText?.text2}
        firstBtnText={modalText?.firstBtnText}
        secondBtnText={modalText.secondBtnText}
        bottomModal={modalText?.bottomModal}
        heading={"Select Option"}
        customArray={customArray}
        handler={customModalHandler}
        submit={() => planogramDelete()}
      />
    </SafeAreaView>
  )
}

export default MachineCommonList;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: colors.appBackground,
    borderRadius: 10,
    margin: 10,
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.appLightGrey
  },
  detailsContainer: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: colors.mediummBlack,
  },
  value: {
    color: colors.mediummBlack,
  },
  lineStye: {
    height: 1,
    width: "100%",
    backgroundColor: "#E7E7E7",
    marginVertical: 5,
  },
});

const customArray = [
  { uniqueId: 1, name: "View", icon: <EyeIcon />, screen: machineNavigationKeys?.planogram },
  { uniqueId: 2, name: "Export ", icon: <Export /> },
  // { uniqueId: 3, name: "Edit", icon: <Edit />, screen: machineNavigationKeys?.uploadplanogram, editMode: true },
  { uniqueId: 4, name: "Delete", icon: <DeleteIcon />, delete: true },
]




