import { View, Text } from 'react-native'
import React from 'react'
import { modalstyles } from './modalstyles'

const msgPopUps = () => {


    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={false}
            onRequestClose={() => closeModal()}>

            <View style={[modalstyles.main]} >

                <View style={[modalstyles.modalStyle]}>


                </View>
            </View>
        </Modal>

    )

}

export default msgPopUps