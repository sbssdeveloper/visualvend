import { Text, View, TouchableOpacity } from "react-native"
import appStyles from "../../../Assets/native/appStyles"
import { colors } from "../../../Assets/native/colors"
import { ArrowLeft, DownArrowBlack } from "../../../Assets/native/images"
import { defaultFunction } from "../../../Helpers/constant"
import { useNavigation } from "@react-navigation/native"



const ProductHeadings = ({ heading, subHeading, backPressHandler, style, rightDropHander = defaultFunction }) => {
 const mainHeading = heading?.trim();
 const sub_Heading = typeof subHeading === 'boolean' ? true : subHeading?.trim();

 return (
  <>
   <View style={[appStyles.rowSpaceBetweenAlignCenter, { paddingVertical: 5 }]}>
    <TouchableOpacity style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, ...style }]}
     disabled={mainHeading ? false : true}
     onPress={() => backPressHandler && backPressHandler()}
    >
     {backPressHandler && <ArrowLeft />}
     <Text style={[appStyles.subHeaderText, { textAlign: "left", fontSize: 14 }]}>{mainHeading}</Text>
    </TouchableOpacity>
    {
     sub_Heading &&
     <TouchableOpacity onPress={() => rightDropHander()}
      disabled={sub_Heading || rightDropHander ? false : true}
      style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, ...style }]}
     >
      <Text style={[appStyles.subHeaderText, { textAlign: "left", fontSize: 14 }]}>{sub_Heading}</Text>
      <DownArrowBlack height={25} width={20} />
     </TouchableOpacity>
    }

   </View>
   <View style={[{ height: 2, width: "100%", backgroundColor: colors.mediummBlack, marginVertical: 5 }]} />
  </>
 )
}

export default ProductHeadings