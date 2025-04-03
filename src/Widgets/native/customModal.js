// CustomModal.js
import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import appStyles from '../../Assets/native/appStyles';
import { colors } from '../../Assets/native/colors';
import { CloseIcon } from '../../Assets/native/images';

const CustomModal = ({  onClose, modalStates, customArray, bottomModal, handler,
  text1, text2, text3, firstBtnText, secondBtnText, submit, loading,heading }) => {
  const [visibleFor] = Array.isArray(modalStates) ? modalStates : [modalStates];

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visibleFor === "CUSTOMMODAL"}
      onRequestClose={onClose}
    >
      { !bottomModal ?
          <View style={[styles.overlay,]}>
            <View style={styles.modalContainer}>
              { loading ?
                  <View style={[appStyles.ph_10]}>
                    <ActivityIndicator color={colors.steelBlue} size={"large"} />
                  </View>
                  :
                  <>
                    {text1 && <Text style={[appStyles.subHeaderText, { fontSize: 16 }]}>{text1}</Text>}
                    {text2 && <Text style={[appStyles.subHeaderText, { fontSize: 12 }]}>{text2}</Text>}
                    {text3 && <Text style={[appStyles.subHeaderText, { fontSize: 14 }]}>{""}</Text>}
                    <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 20 }]}>
                      <TouchableOpacity style={styles.closeButton} onPress={() => onClose()} disabled={loading}>
                        <Text style={[{ color: colors.appLightGrey }]}>{firstBtnText}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.button} onPress={() => submit()}>
                        <Text style={[{ color: colors.white }]}>{secondBtnText}</Text>
                      </TouchableOpacity>
                    </View>
                  </>
              }
            </View>
          </View>
          :
          <View style={[styles.main]}>
            <View style={[styles.modalStyle]}>
              <View style={[appStyles.rowSpaceBetweenAlignCenter, styles.headingContainer]}>
                <Text style={{ fontSize: 14, color: '#222222' }}>
                    {heading || "Select filter"}  
                    </Text>
                <TouchableOpacity onPress={() => onClose(null)} style={{ padding: 5 }}>
                  <CloseIcon />
                </TouchableOpacity>
              </View>
              <FlatList
                data={customArray}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handler(item)}>
                    <View style={[ appStyles.rowSpaceBetweenAlignCenter,appStyles.ph_10,
                      {justifyContent: "flex-start", marginBottom: 10,padding: 10,gap:5},]}>
                      { item?.icon}
                      <Text style={{ color: colors.mediummBlack }}>
                        {item?.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
      }
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: "center",
  },
  closeButton: {
    marginTop: 10,
    padding: 5,
    paddingHorizontal: 30,
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E7E7E7",

  },
  button: {
    marginTop: 10,
    padding: 5,
    paddingHorizontal: 30,
    backgroundColor: colors.cyan,
    borderRadius: 5,
  },

  closeButtonText: {
    color: colors.appLightGrey,
    fontSize: 16,
  },

  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: 5,
    position: "absolute",
    width: "100%"
  },
  main: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headingContainer: {
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
  },
  modalStyle: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
  },


});

export default CustomModal;