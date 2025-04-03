import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, } from 'react-native';
import { ArrowRight, CheckboxMarked, Uncheckbox } from '../../../Assets/native/images';
import { colors } from '../../../Assets/native/colors';
import NoRecords from '../../../Widgets/native/noRecords';
import { getDimensions, navigationKeys } from '../../../Helpers/native/constants';
import { feedbackStyles } from '../../Dashboard/native/allfeedbacks/feedbackstyles';
import { useNavigation } from '@react-navigation/native';
import AppSkelton from '../../../Widgets/native/skelton';
import appStyles, { fonts } from '../../../Assets/native/appStyles';
import { defaultFunction } from '../../../Helpers/constant';

const CollapsibleList = ({ listData, isLoading, keyOfArrayOrFunctions, filtersBy, heading, querykey, loadMore = defaultFunction, handleSelection = defaultFunction, selectedData = [] }) => {
  const navigation = useNavigation();
  const { height } = getDimensions();
  const halfDeviceHeight = height * 0.5;

  const navigateToCommonList = (data) => navigation.navigate(filtersBy?.listType || navigationKeys?.commonlist, data);


  const checkBoxHandler = (listItem = {}) => {
    const selectedData = listItem[filtersBy?.selectedId] || listItem[filtersBy?.selectedKey]
    selectedData && handleSelection(selectedData)
  }


  const renderItem = ({ item, index }) => {
    return (
      <View style={[styles.itemContainer, appStyles.rowSpaceBetweenAlignCenter,]} key={index}>
        <View>
          <TouchableOpacity onPress={() => checkBoxHandler(item)} style={[appStyles.rowSpaceBetweenAlignCenter, { flex: 0.2 }]}>
            {selectedData?.includes(item[filtersBy?.selectedId] || item[filtersBy?.selectedKey]) ? (
              <CheckboxMarked height={20} width={20} />
            ) : (
              <Uncheckbox height={20} width={20} />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigateToCommonList({ item, keyOfArrayOrFunctions: keyOfArrayOrFunctions, filtersBy, heading, querykey })} style={[appStyles.rowSpaceBetweenAlignCenter, { flex: 0.9 }]} >
          <Text style={[styles.itemText, fonts.semiBold]}>{item[filtersBy?.keyname || "machine_name"] || item["machine_name"] || ""}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateToCommonList({ item, keyOfArrayOrFunctions: keyOfArrayOrFunctions, filtersBy, heading, querykey })}>
          <ArrowRight height={20} width={20} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <>
      <View style={[feedbackStyles.feedbackListMainContainer, { marginVertical: 10 }]}>
        {isLoading ?
          <AppSkelton height={"80%"} length={1} width={"100%"} /> :
          <View style={{ height: listData?.data?.length < 5 ? "auto" : 300, }}>
            <FlatList
              data={listData?.data || listData || []}
              renderItem={renderItem}
              keyExtractor={(item) => { return Object?.values(item)[0] }}
              nestedScrollEnabled
              ListEmptyComponent={<View style={{ marginTop: 50 }}><NoRecords isPending={isLoading} /></View>}
              onEndReached={loadMore}
              onEndReachedThreshold={0.3}
              contentContainerStyle={{}}
            />
          </View>
        }
      </View>
    </>
  );
};

export default CollapsibleList;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    backgroundColor: colors.appBackground,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: "#777777",
  },
});

