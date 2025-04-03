import { View, Text, TouchableOpacity } from "react-native"
import { colors } from '../../../Assets/native/colors';

const ExportWrapper = ({ text, Icon, handler, textStyle, extraStyle }) => {
  return (
    <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 3,marginVertical:5, ...extraStyle }]}
      disabled={handler ? false : true}
      onPress={() => handler()} activeOpacity={0.6}>
      <Icon />
      <Text style={[appStyles.subHeaderText, { color: colors.cyan }, textStyle]}>{text}</Text>
    </TouchableOpacity>
  )
}
export default ExportWrapper 
