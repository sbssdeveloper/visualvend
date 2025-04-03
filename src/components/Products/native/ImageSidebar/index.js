import { Image, Text, View } from "react-native";
import { Gallery, LargeImageIcon } from "../../../../Assets/native/images";
import appStyles from "../../../../Assets/native/appStyles";
import { colors } from "../../../../Assets/native/colors";
import FastImage from "react-native-fast-image";
import { useEffect, useState } from "react";

const ImagerSideBar = ({ url, text, icon, index }) => {
    const [indexArr, setIndexArray] = useState([]);


    useEffect(() => {
        return () => setIndexArray([])
    }, [])

    return (
        <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
            {
                url && indexArr?.includes(index) < 1 ?
                    <View style={[{ alignItems: "center", gap: 10, }]}>
                        {text && <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey, textAlign: "center" }]}>{text || ""}</Text>}
                        <FastImage source={{ uri: url }} style={{ height: 70, width: 70, borderRadius: 10 }}
                            onError={(err) => setIndexArray([...indexArr, index])}
                        />
                    </View>
                    :
                    <View style={[{ alignItems: "center", gap: 10 }]}>
                        {text && <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey, textAlign: "center" }]}>{text || ""}</Text>}
                        {icon ? icon : <LargeImageIcon height={70} width={70} />}
                    </View>
            }
        </View>
    );
};
export default ImagerSideBar