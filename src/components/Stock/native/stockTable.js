import { ScrollView, View, TouchableOpacity, Text } from "react-native";
import ProductModal from "../../../Widgets/native/modals/productModal";
import RowModal from "../../../Widgets/native/modals/rowModal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useMutationData from "../../../Hooks/useCommonMutate"
import { refillStock, resetStock } from "../action";
import NoRecords from "../../../Widgets/native/noRecords";
import appStyles from "../../../Assets/native/appStyles";
import useInvalidateQuery from "../../../Hooks/useInvalidateQuery";
import { styles } from "./stockStyes";
import { stockListArray } from "../../../Helpers/native/constants";
import AisleModal from "../../../Widgets/native/modals/aisleModal";
import { colors } from "../../../Assets/native/colors";
import SmallColorBox from "../../../Widgets/native/smallColorBox";

const StockTable = ({ stockArray, modalStates, setMddalStates, totalRows }) => {
    const [aislesArray, setAisleArray] = useState([]);
    const [selectedRow, setSelectedRow] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { invalidateQuery } = useInvalidateQuery()
    const { commonMachineIdFilter, } = useSelector(state => state?.filterSlice);

    useEffect(() => {
        if (selectedRow < 1) return;
        selectRowFromModal();
    }, [selectedRow])

    const refillSuccess = ({ data: { success } = {} }) => {
        setAisleArray([]);
        setSelectedRow(0);
        setSelectedProduct(null);
        if (success) invalidateQuery("GETSTOCKLIST");
    };

    const resetSuccess = ({ data: { success } = {} }) => {
        setAisleArray([]);
        setSelectedRow(0);
        setSelectedProduct(null);
        if (success) invalidateQuery("GETSTOCKLIST");
    };

    const resetMutation = useMutationData(resetStock, (data) => resetSuccess(data));
    const refillMutation = useMutationData(refillStock, (data) => refillSuccess(data));
    const resetStockData = () => resetMutation.mutate({ machine_id: commonMachineIdFilter, aisles: aislesArray });
    const refillStockData = () => refillMutation.mutate({ machine_id: commonMachineIdFilter, aisles: aislesArray });
    const selectColumns = (id) => setAisleArray(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    const selectRowFromModal = () => stockArray?.[selectedRow - 1]?.forEach(cell => setAisleArray(prev => [...prev, cell?.aisle_no]))
    const checkProudctQuanity = (maxQty, prodQty) => prodQty === maxQty ? "#0CB358" : prodQty < maxQty ? "#ED823A" : "transparent";



    return (<>
        <View style={[styles.container]}>
            <ScrollView
                scrollEnabled={true}
                contentContainerStyle={{ flex: 1 }}
                nestedScrollEnabled
            >
                <View style={[appStyles.rowSpaceBetweenAlignCenter, { paddingHorizontal: 10, top: 2 }]}>
                    <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 3 }]}>
                        <SmallColorBox bcgClr={'#C62222'} custumStyle={{ borderRadius: undefined }} />
                        <Text style={[appStyles.subHeaderText, { fontSize: 12, color: "#C62222", fontWeight: 500 }]}>
                            Quarantined
                        </Text>
                    </View>

                    <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 3 }]}>
                        <SmallColorBox bcgClr={'#FE0C0C'} custumStyle={{ borderRadius: undefined }} />
                        <Text style={[appStyles.subHeaderText, { fontSize: 12, color: "#FE0C0C", fontWeight: 500 }]}>
                            Empty
                        </Text>
                    </View>

                    <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 3 }]}>
                        <SmallColorBox bcgClr={'#ED823A'} custumStyle={{ borderRadius: undefined }} />
                        <Text style={[appStyles.subHeaderText, { fontSize: 12, color: "#ED823A", fontWeight: 500 }]}>
                            Part Fill
                        </Text>
                    </View>

                    <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 3 }]}>
                        <SmallColorBox bcgClr={'#0CB358'} custumStyle={{ borderRadius: undefined }} />
                        <Text style={[appStyles.subHeaderText, { fontSize: 12, color: "#0CB358", fontWeight: 500 }]}>
                            Full
                        </Text>
                    </View>

                </View>

                <View style={[styles.boxUpprLines]} />
                <View style={[appStyles.rowSpaceBetweenAlignCenter, , appStyles.pv_10, styles.listHeader, appStyles.ph_10, { gap: 10 }]}>
                    <View style={{ padding: 5 }}>
                        <Text style={[styles.header, { color: colors.pureBlack }]}>Row</Text>
                    </View>
                    {
                        aislesArray.length > 0 &&
                        <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10 }]}>
                            <TouchableOpacity style={{ padding: 5, borderBottomColor: "red", }} onPress={() => resetStockData()}>
                                <Text style={[styles.header, { color: colors.cyan }]}>Reset</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ padding: 5 }} onPress={() => refillStockData()}>
                                <Text style={[styles.header, { color: colors.cyan }]}>Refill</Text>
                            </TouchableOpacity>
                        </View>

                    }
                </View>

                <View style={{ flex: 1, }}>
                    {
                        stockArray?.length > 0 ?
                            stockArray?.map((dataRow, rowIndex) => (
                                <View style={[styles.row, { flex: 1, padding: 2, flexDirection: "row" }]} key={rowIndex}>
                                    <View style={[{ borderBottomWidth: rowIndex === stockArray?.length - 1 ? 0 : 1 }, styles.rowStyle]}>
                                        <Text style={[{ fontSize: 10, color: "#777777", backgroundColor: "transparent", textAlign: "center" }]}>{rowIndex + 1}</Text>
                                    </View>

                                    {dataRow.map((cell, cellIndex) => (
                                        <View style={{
                                            borderBottomWidth: rowIndex === stockArray?.length - 1 ? 0 : 1,
                                            borderBottomColor: "#E2E2E2",
                                            paddingBottom: 2,
                                            flex: 1,
                                            alignItems: "center",
                                        }}>
                                            {/* <View style={[styles.boxUpprLines, { backgroundColor: cell?.noRecord ? "#C62222" : checkProudctQuanity(cell?.product_max_quantity, cell?.product_quantity) }]} /> */}

                                            <TouchableOpacity style={[{}, styles.editedCell, {
                                                backgroundColor: aislesArray?.includes(cell?.aisle_no) ? "#149CBE" : selectedProduct?.productId ? selectedProduct?.productId === cell?.product_id ? "#149CBE" : "#F2F6FD" : "#F2F6FD",
                                                borderWidth: 0.8,
                                                borderColor: cell?.noRecord ? "#C62222" : checkProudctQuanity(cell?.product_max_quantity, cell?.product_quantity)
                                            }]}
                                                disabled={cell?.noRecord}
                                                onPress={() => selectColumns(cell?.aisle_no)}
                                            >
                                                <Text style={{ color: aislesArray?.includes(cell?.aisle_no) ? "#FFFFFF" : selectedProduct?.productId ? selectedProduct?.productId === cell?.product_id ? "#FFFFFF" : "#777777" : "#777777", textAlign: "center", fontSize: 12 }} key={"cellIndex"}>
                                                    {cell?.aisle_no || ""}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            ))
                            :
                            <NoRecords />
                    }
                </View>
            </ScrollView>
        </View>

        <RowModal
            modalStates={modalStates}
            setMddalStates={setMddalStates}
            rowNumber={totalRows}
            setSelectRow={setSelectedRow}
        />
        <ProductModal
            modalStates={modalStates}
            setMddalStates={setMddalStates}
            setSelectedProduct={setSelectedProduct}
            productArray={stockArray}
        />

        <AisleModal
            stockArray={stockArray && stockArray?.flat()}
            modalStates={modalStates}
            setMddalStates={setMddalStates}
            rowNumber={totalRows}
            setSelectRow={setSelectedRow}
            setAisleArray={setAisleArray}
            aislesArray={aislesArray}
        />

    </>);
}
export default StockTable;




