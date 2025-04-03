import { AllCategory, AllProducts, Gallery, NoCategory } from "../../../Assets/native/images";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
// import { interpolate } from "react-native-reanimated";
import Carousel, { } from "react-native-reanimated-carousel";
import appStyles, { fonts } from "../../../Assets/native/appStyles";
import useFetchData from "../../../Hooks/fetchCustomData/useFetchData";
import { getProductCategoriesProduct } from "../action";
import { API_BASE_URL, MEDIA_BASE_URL_2 } from "../../../Helpers/constant";
import { getDimensions } from "../../../Helpers/native/constants";
import AppSkelton from "../../../Widgets/native/skelton";
import { colors } from "../../../Assets/native/colors";
import { useDispatch } from "react-redux";
import { setOperationType, setProudctData } from "../../../redux/slices/productSlice";
import { useIsFocused } from "@react-navigation/native";

const ScrollableProducts = ({ setCategoriesDetails, categroryDetials, category, setCategory, backPressHandler }) => {


  const { data, isLoading } = useFetchData({ key: "GETPRODUCTCATEGORIES", fn: getProductCategoriesProduct, });
  const [currntItemIndex, setCurrentItemIndex] = useState(null);
  const { width } = getDimensions();
  const dispatch = useDispatch()
  const isFocus = useIsFocused()
  const selectCategory = (param) => {
    dispatch(setOperationType(true));
    setCategoriesDetails(param);
  }


  useEffect(() => {
    if (!isFocus) {
      dispatch(setOperationType(null));
      dispatch(setProudctData(null));
      setCategoriesDetails(null);
      setCategory("")
    }
  }, [isFocus])


  return (
    <>
      <View style={{ height: 100, alignSelf: undefined, marginTop: 10 }}>
        {
          isLoading ? <AppSkelton height={100} length={3} width={120} extraStyles={{ alignItems: "center", flexDirection: "row", gap: 10 }} /> :
            <>

              {
                category === "all_category" ?
                  <Carousel
                    width={120}
                    height={120}
                    autoPlay={false}
                    style={{ width: width - 30 }}
                    // customAnimation={animationStyle}
                    data={data?.data?.data?.data?.length > 0 ? data?.data?.data?.data : []}
                    scrollAnimationDuration={500}
                    mode=""
                    onSnapToItem={(index, item) => {
                      if (data?.data?.data?.data?.length > 0) { }
                    }}
                    renderItem={({ item, index }) => {
                      let imgUrl = "";
                      if (item?.category_image) {
                        if (item?.category_image?.includes("ngapp")) {
                          imgUrl = `${MEDIA_BASE_URL_2}${item?.category_image}`
                        } else {
                          imgUrl = `${API_BASE_URL}s3/media/image/${item?.category_image}`;
                        }
                      }
                      return (
                        <TouchableOpacity onPress={() => {
                          setCategoriesDetails(item?.category_id)
                          setCurrentItemIndex(index)
                        }}
                          style={[{
                            height: 100,
                            width: 100,
                            justifyContent: 'center',
                            alignItems: "center",
                            borderRadius: 15,
                            overflow: "hidden",
                            backgroundColor: currntItemIndex === index ? "#D3EFF6" : "white",
                            gap: 3,
                          }, appStyles.commonElevation]}
                        >
                          <Image source={{ uri: imgUrl }} resizeMode="center" height={60} width={60} borderRadius={10} />
                          <Text style={[appStyles.subHeaderText, { fontSize: 12, textAlign: "center" }]}>{item?.category_name}</Text>
                        </TouchableOpacity>
                      )
                    }}
                  />
                  :
                  <View style={[appStyles.rowSpaceBetweenAlignCenter, { paddingHorizontal: 0 }]}>
                    <RoundContainer text={"All Products"} icon={<AllProducts height={50} width={50} />} handler={() => selectCategory("")} categroryDetials={!categroryDetials ? true : false} />
                    <RoundContainer text={"No Category"} icon={<NoCategory height={50} width={50} />} handler={() => selectCategory("no_category")} categroryDetials={categroryDetials === "no_category" ? true : false} />
                    <RoundContainer text={"All Categories"} icon={<AllCategory height={50} width={50} />} handler={() => {
                      selectCategory("all_category")
                      setCategory("all_category")
                    }} categroryDetials={categroryDetials === "all_category" ? true : false} />
                  </View>


              }
            </>
        }

      </View>

    </>
  )
}
export default ScrollableProducts


const RoundContainer = ({ text, icon, handler, categroryDetials }) => {
  return (
    <TouchableOpacity
      onPress={handler}
      style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.gap_5, { width: "32%", flexDirection: "column", backgroundColor: categroryDetials ? "#D3EFF6" : colors.white, padding: 10, borderRadius: 10, }]}>
      {icon && icon}
      <Text style={[appStyles.subHeaderText, fonts.semiBold, { fontSize: 12, textAlign: "center" }]}>{text}</Text>
    </TouchableOpacity>
  )
}