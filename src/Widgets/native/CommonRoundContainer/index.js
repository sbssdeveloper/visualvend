import { View, Text } from "react-native"
import roundcontainerstyles from "../roundcontainer/roundcontainerstyles"
import { colors } from "../../../Assets/native/colors"
import AppSkelton from "../skelton"
import { fonts } from "../../../Assets/native/appStyles"

const CommonRoundContainer = ({ text, data, custumStyle, isLoading }) => {
  return (
    <View>
      <Text style={[appStyles.subHeaderText, fonts.bold, { fontSize: 14, marginVertical: 8, textAlign: "center" }]}>{text || ""}</Text>
      <View style={[roundcontainerstyles.roundBox, custumStyle, { height: undefined, alignItems: isLoading ? undefined : "center", justifyContent: isLoading ? undefined : "center" }]}>
        {isLoading ? <AppSkelton height={30} length={1} width={"100%"} /> :
          <Text style={[appStyles.subHeaderText, { color: colors.cyan, fontSize: 18 }]}>{data || "0"}</Text>
        }
      </View>
    </View>
  )
}
export default CommonRoundContainer