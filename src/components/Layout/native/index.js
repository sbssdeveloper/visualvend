import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import CustomSerach from '../../../Widgets/native/customsearch'
import Widget from '../../../Widgets/native/widget'
import { useDebouncing } from '../../../Hooks/useDebounce/useDeboucing'
import AddItemsModal from '../../../Widgets/native/modals/AddItemsModal'
import appStyles from '../../../Assets/native/appStyles'
import { colors } from '../../../Assets/native/colors'
import DurationModal from '../../../Widgets/native/modals/durationmodal'
import MachineIdModal from '../../../Widgets/native/modals/machineIdModal'
import CustomLine from '../../../Widgets/native/customLine';
import SpecificProduct from './specificProduct';
import { machineList } from '../../Dashboard/action';
import useInfiniteFetchData from '../../../Hooks/fetchCustomInfiniteData/useFetchInfineData';
import useModalStates from '../../../Hooks/modalStates/useModalStates';
import ProductHeadings from '../../../Widgets/native/ProductHeadings';
import useFetchData from '../../../Hooks/fetchCustomData/useFetchData'


const Layout = () => {

    const [modalStates, setModalStates] = useModalStates();
    const [searchText, setSearchText] = useState('');
    const [debounceSearch] = useDebouncing(searchText, 1000);

    const {data:{data:machineDetails}={}} = useFetchData({  key: "GETMACHINELIST", fn: machineList });

    return (
        <SafeAreaView>
            <View style={[appStyles.mainContainer, { paddingHorizontal: undefined, }]}>

                {
                    false &&
                    <>
                        <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" />

                        <View style={[appStyles.gap_10]}>
                            <Widget
                                setMddalStates={setModalStates}
                                modalStates={modalStates}
                            />
                        </View>
                    </>
                }

                <ScrollView style={{ backgroundColor: colors.appBackground, marginTop: 12 }}>
                    <View
                        style={[
                            appStyles.mainContainer,
                            { backgroundColor: colors.appBackground },
                        ]}>

                        <View style={[appStyles.pv_10]}>

                            <AddItemsModal
                                setMddalStates={setModalStates}
                                modalStates={modalStates}
                            />

{/* 
                            <ProductHeadings heading={"Machine Product Heading"}
                                subHeading={"By Row"}
                            /> */}

                            {
                                <SpecificProduct />
                            }
                      
                        </View>

                    </View>
                </ScrollView>

                <DurationModal
                    modalStates={modalStates}
                    setMddalStates={setModalStates}
                />

                <MachineIdModal
                  machineDetails={machineDetails?.data}
                    modalStates={modalStates}
                    setMddalStates={setModalStates}
                />
            </View>
        </SafeAreaView>
    )
}

export default Layout



// const ProductType = ({ item }) => {
//     return (
//         <View style={[{ paddingVertical: 10 }]}>


//             <View style={[appStyles.rowSpaceBetweenAlignCenter]}>

//                 <View style={{ gap: 5 }}>

//                     <Text style={[appStyles.blackText]}>
//                         Aisles
//                     </Text>

//                     <Text style={[appStyles.blackText]}>
//                         10
//                     </Text>

//                     <Text style={[appStyles.blackText]}>
//                         5 of 10
//                     </Text>
//                 </View>

//                 <Fries />

//             </View>

//         </View>
//     );
// };




// const ProdcutDescription = ({ item, setoperationType }) => {

//     return (
//         <View style={[{ flex: 1 }]}>

//             <View style={[appStyles.rowSpaceBetweenAlignCenter, { flex: 1 }]}>

//                 <View style={{ gap: 5, flex: 1, alignItems: "flex-start" }}>
//                     <Text style={[appStyles.blackText, { color: "#DC405C" }]}>{/* {item?.productName || ""} */}
//                         smith
//                     </Text>
//                     <Text style={[appStyles.blackText, { color: "#DC405C" }]}>{/* {item?.productName || ""} */}
//                         Cheese & Onion
//                     </Text>

//                     <View style={{ width: "100%" }}>
//                         <ProgressBars bcgClrProgress={colors.lightCyan} barcolor={'#149CBE'} rateValue={"80%"} />
//                     </View>


//                 </View>

//                 <View style={[{ gap: 5 }]}>

//                     <Text style={[appStyles.blackText]}>{/* {item?.productName || ""} */}
//                         90 grams
//                     </Text>

//                     <Text style={[appStyles.blackText, { color: "#DC405C" }]}>{/* {item?.productName || ""} */}
//                         A$ 3.00
//                     </Text>

//                 </View>

//             </View>

//         </View>
//     )
// }








