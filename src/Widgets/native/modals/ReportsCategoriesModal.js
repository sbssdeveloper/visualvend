import { useRef, useState } from "react";
import { Modal, View, TouchableOpacity, Text, FlatList, Animated } from "react-native";
import { modalstyles } from "./modalstyles";
import { useDispatch } from "react-redux";
import appStyles from "../../../Assets/native/appStyles";
import { CloseIcon, RadioBoxSelected, RadioBoxUnSelected } from "../../../Assets/native/images";
import { colors } from "../../../Assets/native/colors";
import CustStarEndDateSelection from "./customDateSelection";


const ReportsCategoriesModal = ({ modalStates, customStyle, setMddalStates, setSelectedValue, arrayData }) => {

  const [selectedDay, setSelectedDay] = useState("By Creation Date");

  const slideAnim = useRef(new Animated.Value(0)).current; // Initial value for the slide animation


  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setMddalStates(null);
      setSelectedDay("");
      slideAnim.setValue(0);
    });
  };

  const selectValue = (value, id) => {
    setSelectedValue(value);
    setSelectedDay(value?.name);
    setMddalStates(null);
    closeModal();

  };

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={modalStates === "SALESCATOGIRES" ? true : false}
      onRequestClose={() => null}>
      <View style={[modalstyles.main]}>
        <Animated.View
          style={[modalstyles.modalStyle, { transform: [{ translateY: slideAnim }] },
          ]}>
          <View style={[appStyles.rowSpaceBetweenAlignCenter, modalstyles.headingContainer]}>
            <Text style={{ fontSize: 14, color: '#222222' }}>
              Machine Filters
            </Text>

            <TouchableOpacity onPress={() => closeModal(null)} style={{ padding: 5 }}>
              <CloseIcon />
            </TouchableOpacity>

          </View>

          {
            selectedDay === "Custom" ?
              <CustStarEndDateSelection setMddalStates={setMddalStates} setSelectedDay={setSelectedDay} />

              :
              <FlatList
                data={arrayData}
                style={{ ...customStyle }}

                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => selectValue(item)}>
                    <View style={[
                      appStyles.rowSpaceBetweenAlignCenter,
                      {
                        justifyContent: undefined,
                        marginBottom: 10,
                        padding: 10,
                        paddingHorizontal: 10,
                      },
                    ]}>

                      {selectedDay === item?.name ? (

                        <RadioBoxSelected />
                      )
                        :
                        (
                          <RadioBoxUnSelected />
                        )}
                      <Text style={{ marginLeft: 10, color: colors.mediummBlack }}>
                        {item?.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
          }

        </Animated.View>


      </View>

    </Modal>
  )

}


export default ReportsCategoriesModal




