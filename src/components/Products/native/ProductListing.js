import React, { useEffect, useRef, useState } from "react";
import { FlatList, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { useDispatch } from "react-redux";
import { Swipeable } from 'react-native-gesture-handler'; 
import { setOperationType, setProudctData } from "../../../redux/slices/productSlice";
import { deleteProduct, productList } from "../action";
import { colors } from "../../../Assets/native/colors";
import appStyles, { fonts } from "../../../Assets/native/appStyles";
import FastImage from 'react-native-fast-image';
import NoRecords from "../../../Widgets/native/noRecords";
import CustomListing from "../../../Widgets/native/customListing";
import CustomModal from "../../../Widgets/native/customModal";
import useModalStates from "../../../Hooks/modalStates/useModalStates";
import useInfiniteFetchData from "../../../Hooks/fetchCustomInfiniteData/useFetchInfineData";
import useInvalidateQuery from "../../../Hooks/useInvalidateQuery";
import useMutationData from "../../../Hooks/useCommonMutate";
import Toast from "react-native-toast-message";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { navigationKeys } from "../../../Helpers/native/constants";
import { sortWordsLength } from "../../../Helpers/native";
import { CrossIcon, DeleteIcon, EditBlack, LargeImageIcon } from "../../../Assets/native/images";
import { API_BASE_URL, MEDIA_BASE_URL_2 } from "../../../Helpers/constant";
import AppSkelton from "../../../Widgets/native/skelton";
import useFetchData from "../../../Hooks/fetchCustomData/useFetchData";
import usePageCount from "../../../Hooks/pageCounter/usePageCount";


const ProductListing = ({ debounceSearch, category_id }) => {
  const [modalStates, setModalStates] = useModalStates();
  const [selectedProudctId, setSelectedProudct] = useState(null);
  const { pageCount, incrementPageCount } = usePageCount();
  // const isFocused =  useIsFocused();

  const { data, isPending: productLoading, } = useFetchData({
    search: debounceSearch ? debounceSearch.trim() : "",
    sort: "recent",
    length: 50 * pageCount,
    key: "PRODUCTLIST",
    fn: productList,
    category_id
  });

  const { invalidateQuery } = useInvalidateQuery();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const swipeableRef = useRef(null); 



  useEffect(() => {
    if (swipeableRef?.current) {
      swipeableRef?.current?.openRight(); 
      setTimeout(() => {
        swipeableRef?.current?.close();
      }, 2000);
    }
  }, []);



  const deleteSuccess = (data) => {
    const { success, message } = data?.data || {};
    invalidateQuery("PRODUCTLIST");
    if (success) {
      setModalStates(null);
      Toast.show({ position: 'top', type: "success", text1: '', text2: message });
    }
  };

  const { mutate: deletMution, isPending } = useMutationData(deleteProduct, deleteSuccess);
  const deleteProductHandler = () => deletMution({ uuid: selectedProudctId });


  const handler = (selectedData) => {
    dispatch(setProudctData(selectedData));
    dispatch(setOperationType("EDIT"));
    navigation?.navigate(navigationKeys.productstack)
  }

  let productListingData = data?.data?.data;

  const renderRightActions = (item) => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity onPress={() => handler(item)} style={styles.rightSideButton}>
        <EditBlack />
      </TouchableOpacity>
      <View style={styles.buttonSpacing} />
      <TouchableOpacity style={styles.rightSideButton} onPress={() => {
        setSelectedProudct(item?.uuid);
        setModalStates("CUSTOMMODAL");
      }}>
        <DeleteIcon />
      </TouchableOpacity>
    </View>
  );




  const renderItem = ({ item, index }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item)}
      rightThreshold={20}
      friction={2}
      overshootRight={false}
    ref={index === 0 ? swipeableRef : null}  

    >
      <View style={styles.itemContainer}>
        <CustomListing
          FirstSection={<ProductType item={item} setSelectedProudct={setSelectedProudct} setModalStates={setModalStates} index={index} />}
          SecondSection={<ProdcutDescription item={item} setModalStates={setModalStates} setSelectedProudct={setSelectedProudct} index={index} />}
          customStyle={styles.customListing}
        />
      </View>
    </Swipeable>
  );

  const handleLoadMore = () => data?.data?.pagination?.total > productListingData?.length && incrementPageCount();

  const selectedData = Array?.isArray(productListingData) && productListingData[selectedProudctId];

  return (
    <View>
      {productLoading && <AppSkelton height={80} length={6} />}
      <FlatList
        data={productListingData || []}
        renderItem={renderItem}
        keyExtractor={(item) => item?.uuid?.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.noRecordsContainer}>
            <NoRecords isPending={productLoading} customText={"No Product Available"} />
          </View>
        }
      // ListFooterComponent={isFetchingNextPage && productLoading ? <ActivityIndicator size="large" color={colors.steelBlue} /> : null}
      />
      <CustomModal
        text1={"Are you sure"}
        text2={"Delete this product?"}
        firstBtnText={"Cancel"}
        secondBtnText={"Yes"}
        onClose={() => setModalStates(null)}
        modalStates={modalStates}
        submit={deleteProductHandler}
        loading={isPending}
      />

      <ImageModal data={selectedData} modalStates={modalStates} setModalStates={setModalStates} />
    </View>
  );
};

export default ProductListing;


const ProductType = React.memo(({ item, setSelectedProudct, index, setModalStates }) => {
  let imgUrl = "";
  if (item?.product_image) {
    if (item.product_image?.includes("ngapp")) {
      imgUrl = `${MEDIA_BASE_URL_2}${item?.product_image}`
    } else {
      imgUrl = `${API_BASE_URL}s3/media/image/${item?.product_image}`;
    }
  }


  return (
    <TouchableOpacity style={[{ gap: 10, alignItems: "center", justifyContent: "center" }]} onPress={() => {
      setSelectedProudct(index);
      setModalStates("IMAGEMODAL")
    }}>
      <View style={[appStyles.rowSpaceBetweenAlignCenter, { top: 5 }]}>
        <FastImage
          style={{ width: "90%", height: 50, borderRadius: 5 }}
          source={{
            uri: imgUrl,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.stretch}
        />
      </View>
    </TouchableOpacity>
  )
})

const ProdcutDescription = ({ item, setModalStates, setSelectedProudct, index }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();


  const handler = (selectedData) => {
    dispatch(setProudctData(selectedData));
    dispatch(setOperationType("EDIT"));
    navigation?.navigate(navigationKeys.productstack)
  }

  return (
    <View style={[{ flex: 1, gap: 2, justifyContent: "center", bottom: 5 }]}>
      <TouchableOpacity hitSlop={{ top: 10, bottom: 30, left: 10, right: 10, }} activeOpacity={0.5} onPress={() => {
        setSelectedProudct(index);
        setModalStates("PRODUCTMODAL");
      }}>
        <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 5, paddingTop: 10 }]}>
          <View style={{ flex: 1 }}>
            <Text style={[appStyles.blackText, fonts.semiBold, { textAlign: "left", }]}>
              {item?.product_name && sortWordsLength(item?.product_name, 70) || ""}
            </Text>
          </View>
        </View>

        <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start" }]}>
          <Text style={[appStyles.blackText, fonts.semiBold, { fontSize: 12, }]}>
            Code : {""}
          </Text>
          <Text style={[appStyles.blackText, fonts.mediumm, { fontSize: 12, }]}>
            {item?.product_id && sortWordsLength(item?.product_id, 25) || ""}
          </Text>
        </View>

      </TouchableOpacity>


      <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
        <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start", flex: 0.8 }]}>
          <Text style={[appStyles.blackText, { color: "#DC405C", textAlign: "left", fontWeight: "500" }]}>
            A$ {""}
          </Text>
          <Text style={[appStyles.blackText, fonts.semiBold, { color: colors.appRed, textAlign: "left", }]}>
            {item?.product_price && sortWordsLength(item?.product_price, 25) || "0.0"}
          </Text>
        </View>

        {/* 
        <View style={{ flex: 0.2 }}>
          <TouchableOpacity onPress={() =>  handler(item)}>
            <EditBlack />
          </TouchableOpacity>
        </View> */}

        {/* <View style={{ flex: 0.2 }}>
          <TouchableOpacity onPress={() => {
            setModalStates("CUSTOMMODAL");
            setSelectedProudct(item?.uuid);
          }
          }>
            <DeleteIcon />
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  )
}


const ImageModal = ({ data, modalStates, setModalStates }) => (
  <Modal visible={modalStates === "IMAGEMODAL"} animationType="slide" transparent={false}>
    <View style={[appStyles.centerItems, { flex: 1, backgroundColor: "#E6E6E6" }]}>
      <View style={[appStyles.rowSpaceBetweenAlignCenter, { width: "90%", top: 20 }]}>
        <Text style={[appStyles.blackText, { fontSize: 15, fontWeight: "700" }]}>
          Product Image
        </Text>
        <TouchableOpacity onPress={() => setModalStates(null)}>
          <CrossIcon />
        </TouchableOpacity>
      </View>

      {data?.product_image ? (
        <FastImage
          style={{ width: "90%", height: 250, borderRadius: 5 }}
          source={{
            uri: `${API_BASE_URL}s3/media/image/${data?.product_image}`,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : <LargeImageIcon />}
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  itemContainer: {
    marginVertical: 5,
  },
  rightActionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: "transparent",
    paddingHorizontal: 10,
  },
  rightSideButton: {
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
    padding: 20,
    borderRadius: 5,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
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
});
