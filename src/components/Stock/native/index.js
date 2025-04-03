import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import appStyles from '../../../Assets/native/appStyles';
import DurationModal from '../../../Widgets/native/modals/durationmodal';
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal';
import Widget from '../../../Widgets/native/widget';
import CustomSerach from '../../../Widgets/native/customsearch';
import { colors } from '../../../Assets/native/colors';
import { DownArrowBlack } from '../../../Assets/native/images';
import { useSelector } from 'react-redux';
import { chunkArray } from '../../../Helpers/resource';
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing';
import LoaderComponent from '../../../Widgets/native/loaderComponent';
import StockTable from './stockTable';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData';
import { stockList } from '../action';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import { machineList } from '../../Dashboard/action';
import useCustomTextData from '../../../Hooks/customTextData/useCustomTextData';


const Stock = ({ }) => {
  const [modalStates, setModalStates] = useModalStates();
  const [searchText, setSearchText] = useCustomTextData();

  useDebouncing(searchText, 1000);
  const { commonMachineIdFilter } = useSelector(state => state.filterSlice);
  const { data: stackListData, isPending, isFetching } = useFetchData({ machine_id: commonMachineIdFilter, key: "GETSTOCKLIST", fn: stockList });
  const { stock, dimensions } = stackListData?.data?.data || {};
  const { data: { data: machineDetails } = {} } = useFetchData({ key: "GETMACHINELIST", fn: machineList });
  const stockArray = chunkArray(stock, dimensions?.machine_column, dimensions?.machine_row);
  const manageModalStatus = (param) => setModalStates(param);


  return (

    <SafeAreaView>

      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined, }]} >

        {isPending || isFetching || machineDetails.isPending && <LoaderComponent />}

        <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />

        <View style={[appStyles.gap_10]}>
          <Widget
            setMddalStates={setModalStates}
            modalStates={modalStates}
          />
        </View>

        <ScrollView style={{ backgroundColor: colors.appBackground, marginTop: 10 }}>

          <View
            style={[
              appStyles.mainContainer,
              { backgroundColor: colors.appBackground },
            ]}>

            <View style={[appStyles.pv_10]}>

              {/* <Text style={[appStyles.subHeaderText, { textAlign: "left", fontSize: 14 }]}>Stock Levels</Text>
              <View style={[{ height: 1, width: "100%", backgroundColor: colors.mediummBlack, marginVertical: 5 }]} /> */}

              <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.pv_10]}>
                <ModalOpenHeader heading={"Products"} manageModalStatus={() => manageModalStatus("PRODUCTMODAL")} />
                <ModalOpenHeader heading={"Row No#"} manageModalStatus={() => manageModalStatus("ROWMODAL")} />
                <ModalOpenHeader heading={"Aisles No #"} manageModalStatus={() => manageModalStatus("AISLEMODAL")} />
              </View>
            </View>

            <StockTable stockArray={stockArray}
              modalStates={modalStates}
              setMddalStates={setModalStates}
              totalRows={dimensions?.machine_row}
            />

          </View>
        </ScrollView>
      </View>

      <DurationModal
        modalStates={modalStates}
        setMddalStates={setModalStates}
      />
      <MachineIdModal
        machineDetails={machineDetails?.data}
        modalStates={modalStates}
        setMddalStates={setModalStates}
      />
    </SafeAreaView>
  );
};

export default Stock;

const ModalOpenHeader = ({ heading, manageModalStatus }) =>
  <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 5 }]} onPress={manageModalStatus}>
    <Text style={[appStyles.subHeaderText]}> {heading}</Text>
    <DownArrowBlack />
  </TouchableOpacity>










