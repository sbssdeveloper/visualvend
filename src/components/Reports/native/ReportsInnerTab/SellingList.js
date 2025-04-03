import { View, Text, FlatList } from 'react-native'
import React from 'react'
import NoRecords from '../../../../Widgets/native/noRecords';
import { feedbackStyles } from "../../../Dashboard/native/allfeedbacks/feedbackstyles"
import appStyles, { fonts } from '../../../../Assets/native/appStyles';
import { colors } from '../../../../Assets/native/colors';
import { SALES_COUNT_TABLE_COLUMNS } from '../../constant';
import AppSkelton from '../../../../Widgets/native/skelton';
import { sortWordsLength } from '../../../../Helpers/native';

const SellingList = ({ data, loading, dynamicArray }) => {
  const renderItem = ({ item, index }) => {
    return (
      <View style={[feedbackStyles.feedbackListMainContainer, { marginVertical: 5, padding: 5 }]}>
        <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
          {dynamicArray?.map((column, index) => (
            <View key={column.key} style={[appStyles.rowSpaceBetweenAlignCenter]}>
              <Text style={[appStyles.subHeaderText, fonts.mediumm, { right: dynamicArray?.length - 1 === index ? 10 : undefined }]}>{sortWordsLength(item[column?.key], 25)}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  //   <Text style={[appStyles.subHeaderText, { fontSize: 10, color: colors.appLightGrey }]}>
  //  
  // </Text>


  //    <View style={{ padding: 8, gap: 5, }}>

  // <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
  // {dynamicArray?.map((column) => (
  //           <View key={column.key} style={[appStyles.rowSpaceBetweenAlignCenter]}>
  //             <Text style={[appStyles.subHeaderText]}>{column?.name}</Text>
  //           </View>
  //         ))}
  // </View> 
  //    {dynamicArray?.map((column) => (
  //           <View key={column.key} style={[appStyles.rowSpaceBetweenAlignCenter]}>
  //             <Text style={[appStyles.subHeaderText]}>{column?.name}</Text>
  //           </View>
  //         ))} 
  //  </View>

  const hasKeysValue = dynamicArray?.some(element => element?.text);
  return (
    <>
      <View style={{ backgroundColor: colors.appBackground }}>
        <View style={[feedbackStyles.feedbackListMainContainer,]}>
          {loading ? <AppSkelton height={"90%"} length={1} width={"100%"} /> :
            <>
              {
                data?.length > 0 && hasKeysValue &&
                <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.ph_10, appStyles.pv_10, {
                  flexGrow: 1, flexWrap: 'wrap',
                  justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#E7E7E7"
                }]}>
                  {dynamicArray?.map((item) => (
                    <ItemList
                      key={item?.key}
                      text={item?.text}
                    />
                  ))}
                </View>
              }
              {
                data?.length > 0 &&
                <FlatList
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                  data={data || []}
                  renderItem={(item) => renderItem(item)}
                  keyExtractor={(item, index) => index.toString()}
                  ListEmptyComponent={<NoRecords isPending={loading} />}
                  ItemSeparatorComponent={() => {
                    return (
                      <View
                        style={{ height: 1, backgroundColor: "#E7E7E7" }}
                      />
                    );
                  }}
                />
              }
            </>
          }
        </View>
      </View>
    </>)
}

export default SellingList


const ItemList = ({ text, onPress }) =>
  <View>
    <Text style={[appStyles.subHeaderText, fonts.bold]}>
      {text || ""}
    </Text>
  </View>




