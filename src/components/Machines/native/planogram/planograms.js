import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import ProductHeadings from '../../../../Widgets/native/ProductHeadings'
import Widget from '../../../../Widgets/native/widget'
import { useSelector } from 'react-redux'
import useModalStates from '../../../../Hooks/modalStates/useModalStates'
import useCustomTextData from '../../../../Hooks/customTextData/useCustomTextData'
import { useDebouncing } from '../../../../Hooks/useDebounce/useDeboucing'
import ExportWrapper from '../../../Reports/native/ExportWrapper'
import { Add, Edit, Export, ExportUpload, MachineLogo, ResetIcon, SelectIcon, TrushIcon, UILINES, UploadBlueIcon } from '../../../../Assets/native/images'
import { machineNavigationKeys, navigationKeys } from '../../../../Helpers/native/constants'
import AppSkelton from '../../../../Widgets/native/skelton'
import NoRecords from '../../../../Widgets/native/noRecords'
import DurationModal from '../../../../Widgets/native/modals/durationmodal'
import MachineIdModal from '../../../../Widgets/native/modals/machineIdModal'
import ReportsCategoriesModal from '../../../../Widgets/native/modals/ReportsCategoriesModal'
import CustomModal from '../../../../Widgets/native/customModal'
import CustomSerach from '../../../../Widgets/native/customsearch'
import { colors } from '../../../../Assets/native/colors'
import { MACHINES_SORT_OPTIONS } from '../../constants'
import roundcontainerstyles from '../../../../Widgets/native/roundcontainer/roundcontainerstyles'
import appStyles, { fonts } from '../../../../Assets/native/appStyles'
import FastImage from 'react-native-fast-image'
import { planogramProducts } from '../../actions'
import NavigationHeader from '../../../../Widgets/native/navigationHeader'
import CurrentMachineHeader from '../../../../Widgets/native/currentMachineHeader'
import useFetchData from '../../../../Hooks/fetchCustomData/useFetchData';
import { sortWordsLength } from '../../../../Helpers/native'
import { API_BASE_URL, MEDIA_BASE_URL_2 } from '../../../../Helpers/constant'
import useInfiniteFetchData from '../../../../Hooks/fetchCustomInfiniteData/useFetchInfineData'
import { createAndDownloadExcelFile, generateRandomString } from '../../../../Widgets/native/commonNativeFunctions'

const Planograms = ({ navigation = {}, route: { params } = {} }) => {
  const [searchText, setSearchText] = useCustomTextData();
  const [debounceSearch] = useDebouncing(searchText, 1000);
  const [modalStates, setModalStates] = useModalStates();
  const { commonMachineIdFilter, } = useSelector(state => state.filterSlice);
  const { data: productData, isLoading, hasNextPage, fetchNextPage } = useInfiniteFetchData({ key: 'GETPLANOGRAMS', fn: planogramProducts, machine_id: params?.id, length: 20, search: debounceSearch });
  const loadMore = () => hasNextPage && productData?.length > 19 && fetchNextPage();
  const renderSpinner = () => isLoading && <ActivityIndicator color={colors.steelBlue} />;

  const exportToExcel = async (param) => createAndDownloadExcelFile(productData);



  const renderItem = ({ item: productItem = {}, index }) => {
    let imgUrl = '';
    if (productItem.product_image?.includes("ngapp")) imgUrl = `${MEDIA_BASE_URL_2}${productItem?.product_image}`;
    else imgUrl = `${API_BASE_URL}s3/media/image/${productItem?.product_image}`;
    return (
      <View style={{ flex: 1, margin: 3 }}>
        <Text style={[appStyles.subHeaderText, { fontSize: 14, marginVertical: 10 }]}>{sortWordsLength(productItem?.product_name, 45) || ""}</Text>
        <View style={[roundcontainerstyles.roundBox, { height: undefined }]}>
          <View style={{ gap: 5 }}>
            <View style={appStyles.a_s_e}>
              <Text style={[appStyles.subHeaderText, { color: colors.cyan }]}>{productItem?.product_price}</Text>
            </View>
            <View style={appStyles.a_s_c}>
              <FastImage
                source={{ uri: imgUrl }}
                style={{ height: 100, width: 100 }}
                blurRadius={10}
              // defaultSource={require('../../../Assets/native/images/pepsi.jpeg')} 
              />
            </View>
            {screens?.map((item, index) => (
              <React.Fragment key={item?.id}>
                {index < 1 && (
                  <View style={{ height: 2, width: "100%", backgroundColor: "#F2F2F2", marginVertical: 5 }} />
                )}
                <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                  <Text style={[appStyles.subHeaderText, fonts.regular, { color: colors.appLightGrey }]}>{item?.text}</Text>
                  <Text style={[appStyles.subHeaderText, fonts.regular, { color: colors.appLightGrey }]}>{productItem[item?.key]}</Text>
                </View>
                <View style={{ height: 2, width: "100%", backgroundColor: "#F2F2F2", marginVertical: 5 }} />
              </React.Fragment>
            ))}

            <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start", gap: 5, alignSelf: "center" }]} onPress={() => navigation?.navigate(machineNavigationKeys.updatePlanogram, { ...productItem, client_id: params.machine_client_id })}>
              <Edit />
              <Text style={[appStyles.subHeaderText, { color: colors.cyan }]}> Edit Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    );
  };

  return (
    <SafeAreaView>
      <NavigationHeader navigation={navigation} />
      <CurrentMachineHeader showDrawerIcon={false} text={"Machines"} />
      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
        <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />
        {/* <View style={[appStyles.gap_10, appStyles.pv_10]}>
          <Widget setMddalStates={setModalStates} modalStates={modalStates} />
        </View> */}
        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground }]}>
          {/* <ProductHeadings heading={"Machine name"} style={appStyles.justifyCStart} subHeading={"machine name"} rightDropHander={"sortHandler"} /> */}
          <View style={[appStyles.rowSpaceBetweenAlignCenter, { marginVertical: 5 }]}>
            <ExportWrapper text={"Reset Planogram"} Icon={ResetIcon} handler={() => navigation?.navigate(machineNavigationKeys?.resetplanogram, params)} />
            <ExportWrapper text={"Planogram List "} Icon={UILINES} handler={() => navigation?.navigate(machineNavigationKeys?.commonmahcineList)} />
            <ExportWrapper text={"Upload Excel"} Icon={UploadBlueIcon} handler={() => productData?.length > 0 && exportToExcel()} />
          </View>
          {isLoading ?
            <AppSkelton height={500} width={400} length={2} extraStyles={{ alignItems: "center", flexDirection: "row", gap: 10 }} />
            :
            <FlatList
              nestedScrollEnabled
              data={productData || []}
              renderItem={renderItem}
              onEndReached={loadMore}
              onEndReachedThreshold={0.3}
              numColumns={2}
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={{ top: 100 }}>
                  <NoRecords isPending={isLoading} />
                </View>
              }
              ListFooterComponent={renderSpinner}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          }
        </View>
      </View>

      <DurationModal
        modalStates={modalStates}
        setMddalStates={setModalStates}
      />
      {/* <MachineIdModal
     modalStates={modalStates}
     setMddalStates={setModalStates}
     {...machineDetails}
   /> */}
      <ReportsCategoriesModal
        modalStates={modalStates}
        setMddalStates={setModalStates}
        // selectedValue={selectedValue}
        // setSelectedValue={setSelectedValue}
        arrayData={MACHINES_SORT_OPTIONS}
      />
      <CustomModal
        text1={"Are you sure"}
        text2={"Delete this machine ? "}
        firstBtnText={"Cancel"}
        secondBtnText={"Yes"}
        onClose={() => setModalStates(null)}
        modalStates={modalStates}
      // submit={() => deleteMachineUser(modalStates)}
      />
    </SafeAreaView>
  )
}

export default Planograms


export const screens = [
  { text: "Quantity", id: 1, key: "product_quantity" },
  { text: "Capacity", id: 2, key: "product_max_quantity" },
  { text: "Position", id: 3, key: "product_location" },
];