import { StyleSheet } from "react-native";
import { colors } from "../../../../Assets/native/colors";
import appStyles from "../../../../Assets/native/appStyles";


export const feedbackStyles = StyleSheet.create({

  feedbackText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#777777',
  },

  main: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },


  feedbackListMainContainer: {
    gap: 5,
    justifyContent: undefined,
    alignSelf: "center",
    backgroundColor: "white",
    width: "100%",
    borderRadius: 10,
   marginVertical:10
  },

  feedbackTextContainer: {
    justifyContent: undefined,
    gap: 5,
    alignSelf: "center",
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.appOffGrey,
    width: '100%'
  },
  headingText:{
    color:colors.lightBlack,
    fontSize:12
  }

});