import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import appStyles from '../../../Assets/native/appStyles';
import CustomSerach from '../../../Widgets/native/customsearch';
import { colors } from '../../../Assets/native/colors';
import ProductStack from './productStack';
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing';
import { useDispatch, useSelector } from 'react-redux';
import { setOperationType, setProudctData } from '../../../redux/slices/productSlice';
import ScrollableProducts from './ScrollableProducts';
import AddProductButton from './AddProductButton';
import ProductListing from './ProductListing';
import ProductHeadings from '../../../Widgets/native/ProductHeadings';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';
import { useNavigation } from '@react-navigation/native';
import { navigationKeys } from '../../../Helpers/native/constants';

const Products = ({ }) => {
  const [searchText, setSearchText] = useCustomTextData();
  const [categroryDetials, setCategoriesDetails] = useState(null)
  const [debounceSearch] = useDebouncing(searchText, 1000);
  const [category, setCategory] = useState("");
  const { operationType, updateProductData } = useSelector(state => state?.productSlice);
  const dispatch = useDispatch();
  const navigation = useNavigation()

  const backPressHandler = () => {
    dispatch(setOperationType(null));
    dispatch(setProudctData(null));
    setCategory("");
    setCategoriesDetails(null)
  }

  let category_id = ["all_category", "all_product"].includes(categroryDetials) ? "" : categroryDetials === "no_category" ? "no_category" : categroryDetials;

  return (
    <SafeAreaView>
      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined, }]}>
        {/* <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} /> */}
        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground }]}>
          <View style={[appStyles.pv_10, { flex: 1, backgroundColor: colors.appBackground, }]}>
            <ProductHeadings heading={updateProductData?.product_name ? updateProductData?.product_name : operationType === "ADD" ? "PRODUCT NAME" : "Product Categories"}
              backPressHandler={updateProductData?.product_name || operationType ? backPressHandler : undefined}
              style={appStyles.justifyCStart}
            />

            <ScrollableProducts setCategoriesDetails={setCategoriesDetails}
              categroryDetials={categroryDetials}
              category={category}
              // setCategory={setCategory}
              backPressHandler={backPressHandler}
              setCategory={setCategory}

            />
            <View style={[appStyles.rowSpaceBetweenAlignCenter, { marginTop: 10 }]}>
              <Text style={[appStyles.subHeaderText, { textAlign: "left", fontSize: 14 }]}>All Products </Text>
              <AddProductButton handler={() => navigation?.navigate(navigationKeys.productstack)} />
            </View>
            <View>
              <ProductListing categroryDetials={categroryDetials} debounceSearch={debounceSearch}
                category={category}
                category_id={category_id}
              />
            </View>


          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Products;





















