import { Text, View } from 'react-native';
import { paymentstyle } from './paymentstyles';
import AppSkelton from '../../../Widgets/native/skelton';
import appStyles, { fonts } from '../../../Assets/native/appStyles';
import { TouchableOpacity } from 'react-native';
import { defaultFunction } from '../../../Helpers/constant';
import { colors } from '../../../Assets/native/colors';

const SquareBox = ({ ventStatus, count, total, isloading, touchableHandler }) => {

  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={() => touchableHandler()} disabled={touchableHandler ? false : true}>
      <View style={[paymentstyle.squareBox, { alignItems: "center", justifyContent: "center", gap: 5, }]}>
        {
          isloading ?
            <View style={{ width: "100%", }}>
              <AppSkelton height={100} length={1} width={"95%"} />
            </View>
            :
            <>
              <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
                <Text style={[paymentstyle.squareBoxText, fonts.mediumm]}>{count || "0(A$)"}</Text>
                <Text style={[paymentstyle.squareBoxText, fonts.mediumm, { color: colors.lightBlack }]}>{" | "}</Text>
                <Text style={[paymentstyle.squareBoxText, fonts.mediumm]}>{total || 0} (A$)</Text>
              </View>

              <Text style={[fonts.semiBold, { color: "#777777", fontSize: 10, zIndex: 1, textAlign: "center" }]}>{ventStatus || ""}</Text>
            </>
        }
      </View>

    </TouchableOpacity>
  );
};

export default SquareBox;
