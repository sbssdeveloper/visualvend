import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native'
import React from 'react'
import appStyles from '../../../Assets/native/appStyles';
import { colors } from '../../../Assets/native/colors';
import { productStyles } from '../../../components/Products/native/productstyle';
import { ArrowLeft, BlackCloseIcon, CloseIcon } from '../../../Assets/native/images';
import { modalstyles } from './modalstyles';

const AddItemsModal = ({ modalStates, setMddalStates }) => {

const closeModal = () =>{
    setMddalStates(null);
}


    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalStates?.isVisible === "ADDPRODUCTMODAL" ? true : false}
            onRequestClose={() => closeModal()}>

            <View style={[modalstyles.main]} >

                <View style={[modalstyles.modalStyle, {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                }]}>

                    <View
                        style={[
                            appStyles.rowSpaceBetweenAlignCenter,
                            modalstyles.headingContainer,
                            {
                                borderBottomColor: 'black',
                            }

                        ]}>

                        <Text style={{ fontSize: 14, color: '#222222',fontWeight:"700" }}>

                        ADD

                        </Text>

                        <TouchableOpacity onPress={() => closeModal()}>

                            <BlackCloseIcon height={30} width={30}/>

                        </TouchableOpacity>

                    </View>

                    <View>

                        <FlatList
                            numColumns={2}
                            data={contentOptions || []}
                            style={{ height: 400 }}
                            renderItem={({ item }) => (

                                <TouchableOpacity onPress={() => selectValue(item)}>

                                    <View
                                        style={[
                                            appStyles.rowSpaceBetweenAlignCenter,
                                            {
                                                justifyContent: undefined,
                                                marginBottom: 10,
                                                padding: 5,
                                                paddingHorizontal: 10,
                                                width: 180,

                                            },
                                        ]}>
                                        <Text style={{ marginLeft: 10, color: colors.mediummBlack }}>

                                            {item?.title || ""}
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    </View>

                </View>


            </View>

        </Modal>

    )
}

export default AddItemsModal;



// data.js

export const contentOptions = [
    { key: '1', title: 'Product' },
    { key: '2', title: 'Category' },
    { key: '3', title: 'Machine' },
    { key: '4', title: 'Planogram' },
    { key: '5', title: 'Layout' },
    { key: '6', title: 'Vend Run' },
    { key: '7', title: 'Asset Information' },
    { key: '8', title: 'Task To Do' },
    { key: '9', title: 'Location' },
    { key: '10', title: 'Bump In' },
    { key: '11', title: 'Pickup' },
    { key: '12', title: 'Bump Out' },
    { key: '13', title: 'Staff' },
    { key: '14', title: 'Customer' },
    { key: '15', title: 'Supplier' },
    { key: '16', title: 'Vendor' },
    { key: '17', title: 'Access Control' },
    { key: '18', title: 'Access Restrictions' },
    { key: '19', title: 'Report' },
    { key: '20', title: 'Schedule Report' },
    { key: '21', title: 'Media Ad Video/Image' },
    { key: '22', title: 'Ad Campaign' },
    { key: '23', title: 'Media Ad Image' },
    { key: '24', title: 'Promotion' },
    // Repeat the items to match your list
    { key: '25', title: 'Product' },
    { key: '26', title: 'Category' },
    { key: '27', title: 'Machine' },
    { key: '28', title: 'Planogram' },
    { key: '29', title: 'Layout' },
    { key: '30', title: 'Vend Run' },
    { key: '31', title: 'Asset Information' },
    { key: '32', title: 'Task To Do' },
    { key: '33', title: 'Location' },
    { key: '34', title: 'Bump In' },
    { key: '35', title: 'Pickup' },
    { key: '36', title: 'Bump Out' },
    { key: '37', title: 'Staff' },
    { key: '38', title: 'Customer' },
    { key: '39', title: 'Supplier' },
    { key: '40', title: 'Vendor' },
    { key: '41', title: 'Access Control' },
    { key: '42', title: 'Access Restrictions' },
    { key: '43', title: 'Report' },
    { key: '44', title: 'Schedule Report' },
    { key: '45', title: 'Media Ad Video/Image' },
    { key: '46', title: 'Ad Campaign' },
    { key: '47', title: 'Media Ad Image' },
    { key: '48', title: 'Promotion' },
];




