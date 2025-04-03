import { View } from "react-native";

const SmallColorBox = ({ bcgClr,custumStyle }) => (
 <View style={[{ height: 12, width: 12, backgroundColor: bcgClr, borderRadius: 10 },custumStyle]} />
);

export default SmallColorBox