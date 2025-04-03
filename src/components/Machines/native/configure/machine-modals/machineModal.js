import { View, Text, Modal, FlatList } from 'react-native'
import React from 'react'
import { modalstyles } from '../../../../../Widgets/native/modals/modalstyles'
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from '../../../../../Assets/native/images'
import { TouchableOpacity } from 'react-native'
import appStyles from '../../../../../Assets/native/appStyles'
import NoRecords from '../../../../../Widgets/native/noRecords'
import { colors } from '../../../../../Assets/native/colors'

const MachineModal = ({ modalStates, setModalStates, modalHeading, array, selectedValue, handler }) => {

 const closeModal = () => setModalStates((prev) => ({ ...prev, isOpen: false }));

 return (
  <Modal
   animationType='fade'
   transparent={true}
   visible={modalStates?.isOpen}
   onRequestClose={() => closeModal()}>
   <View style={[modalstyles.main]} >
    <View style={[modalstyles.modalStyle]}>
     <View style={[appStyles.rowSpaceBetweenAlignCenter, modalstyles.headingContainer,]}>
      <Text style={[appStyles.subHeaderText]}>{modalHeading || "Machine Configure Modal"}</Text>
      <TouchableOpacity onPress={() => closeModal()}>
       <CloseIcon />
      </TouchableOpacity>
     </View>

     <FlatList
      data={array || []}
      style={{ maxHeight: 300 }}
      renderItem={({ item, index }) => {
       return (
        <TouchableOpacity onPress={() => handler({ item, index })}>
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
          {selectedValue === item ? <RadioBoxSelected /> : <RadioBoxUnSelected />}

          <Text style={{ marginLeft: 10, color: colors.mediummBlack }}>
           {item || ""}
          </Text>
         </View>
        </TouchableOpacity>
       )
      }}
      keyExtractor={(item, index) => index?.toString()}
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

export default MachineModal