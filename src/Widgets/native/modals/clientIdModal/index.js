import { FlatList, View, TouchableOpacity, Text, Modal, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { modalstyles } from "../modalstyles"

// import { setCommonMachineFilter } from "../../../redux/slices/filterSlice";
// import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../../Assets/native/images";
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../../../Assets/native/images";
import { colors } from "../../../../Assets/native/colors";
import NoRecords from '../../noRecords';
import appStyles from "../../../../Assets/native/appStyles";
import { sortWordsLength } from "../../../../Helpers/native";


const ClientIdModal = ({ modalStates, setMddalStates,
    handler,
    modalHeading,
    selectedClient,
    hasNextPage,
    isMachineListDataPending,
    fetchNextPage,
    isFetchingNextPage,
    modalData: ClientlistData,
    selectedKey
}) => {


    const closeModal = () => setMddalStates(null);
    // const dispatch = useDispatch()

    const selectValue = value => {
        handler(value);
        setMddalStates(null);
    };

    // const loadMore = () => hasNextPage && fetchNextPage();
    const renderSpinner = () => <ActivityIndicator color={colors.steelBlue} />;
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalStates === "CLIENTIDMODAL" ? true : false}
            onRequestClose={() => closeModal()}>
            <View style={[modalstyles.main]} >
                <View style={[modalstyles.modalStyle]}>
                    <View style={[appStyles.rowSpaceBetweenAlignCenter, modalstyles.headingContainer,]}>
                        <Text style={[appStyles.subHeaderText]}>{modalHeading || "Select Client Id"}</Text>
                        <TouchableOpacity onPress={() => closeModal()}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={ClientlistData || []}
                        style={{ maxHeight: 300 }}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity onPress={() => selectValue(item)}>
                                    <View
                                        style={[
                                            appStyles.rowSpaceBetweenAlignCenter,
                                            {
                                                justifyContent: undefined,
                                                marginBottom: 10,
                                                padding: 10,
                                                paddingHorizontal: 10,
                                            },
                                        ]}>
                                        {selectedClient === (item?.client_name || item?.name || item[selectedKey || ""]) ? <RadioBoxSelected /> : <RadioBoxUnSelected />}

                                        <Text style={{ marginLeft: 10, color: colors.mediummBlack }}>
                                            {sortWordsLength(item?.client_name || item?.name || item[selectedKey || ""] || "", 50)}

                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={<NoRecords isPending={false} customText={"No Record Found"} />}
                        // onEndReached={() => loadMore()}
                        onEndReachedThreshold={0.3}
                    // ListFooterComponent={renderSpinner}
                    />


                </View>

            </View>

        </Modal>

    )

}


export default ClientIdModal



