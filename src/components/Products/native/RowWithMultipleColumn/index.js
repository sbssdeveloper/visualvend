import { View, Text } from "react-native"
import { DownArrow } from "../../../../Assets/native/images"
import appStyles from "../../../../Assets/native/appStyles"
import TextAndDrop from "../TextAndDrop"
import IncrementDecrementWidget from "../../../../Widgets/native/incrementDecrementWidget"

const RowWithMultipleColumn = ({ firstCol, SecondCol, thirdCol, fourthCol }) => {
 return (
  <View style={[appStyles.rowSpaceBetweenAlignCenter, { flexGrow: 1 }]}>
   <View style={{ flex: 0.8 }}>
    {firstCol && <Text style={[appStyles.subHeaderText]}>{firstCol}</Text>}
   </View>
   <View style={{ flex: 1 }}>
    {SecondCol && <TextAndDrop text={SecondCol} Icon={<DownArrow />} />}
   </View>
   <View style={{ flex: 0.8 }}>
    {thirdCol && <IncrementDecrementWidget value={thirdCol} />}
   </View>
   <View style={{ flex: 0.8 }}>
    {fourthCol && <IncrementDecrementWidget value={fourthCol} />}
   </View>

  </View>
 )
}
export default RowWithMultipleColumn