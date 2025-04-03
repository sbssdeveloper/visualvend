import { FlatList, Modal, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { modalstyles } from "../../../Widgets/native/modals/modalstyles";
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../../Assets/native/images";
import { colors } from "../../../Assets/native/colors";
import useSelectedValue from "../../../Hooks/reportDropdownSelectionData/useSelectedValue";
import { paymethod } from "../constant";



const PaymentMethodModal = ({ modalStates, setMddalStates,resetParams }) => {
  const [selectedValue, setSelectedValue] = useSelectedValue();

  const closeModal = () => {
    setMddalStates(prev => {
      return {
        ...prev,
        isVisible: false,
      };
    });
  };

  const selectValue = (item) => {
    setSelectedValue(item?.title);
    setMddalStates(prev => {
      return {
        ...prev,
        paymentMethod: item?.method,
        paymentMethodName: item?.title,
        isVisible: false
      };
    });
    resetParams && resetParams(true);
  };

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={modalStates?.isVisible === "paymentMethod" ? true : false}
      onRequestClose={() => null}>

      <View style={[modalstyles.main]}>
        <View style={[modalstyles.modalStyle]}>
          <View style={[appStyles.rowSpaceBetweenAlignCenter, modalstyles.headingContainer]}>
            <Text style={{ fontSize: 14, color: '#222222' }}>
              Select Payment Methods
            </Text>

            <TouchableOpacity onPress={() => closeModal()}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View>

            <FlatList
              data={paymethod}
              style={{  }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectValue(item)}>

                  <View style={[
                    appStyles.rowSpaceBetweenAlignCenter,
                    {
                      justifyContent: undefined,
                      marginBottom: 10,
                      padding: 10,
                      paddingHorizontal: 20,
                    },
                  ]}>
                    {selectedValue === item?.title ? <RadioBoxSelected />:<RadioBoxUnSelected /> }
                    <Text style={{ marginLeft: 10, color: colors.mediummBlack }}> {item?.title} </Text>
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

export default PaymentMethodModal;

