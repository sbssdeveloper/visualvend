import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../../../Assets/native/colors";
import appStyles from "../../../../Assets/native/appStyles";

const Headings = ({ heading, icon, addBtn, onPress,style }) => {

 const mainHeading = heading?.trim();
 return (
  <View style={[appStyles.rowSpaceBetweenAlignCenter,style]}>
   <View>
    <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey }]}>{mainHeading}</Text>
   </View>
   {icon && icon}

   {/* <TouchableOpacity style={{ flex: 1, padding: 5 }} onPress={() => onPress()}
    disabled={onPress ? false : true}
   >
    {!addBtn && <Text style={[appStyles.subHeaderText, { color: colors.appCyan }]}> + Add</Text>}
   </TouchableOpacity> */}
  </View>
 );
};

export default Headings;