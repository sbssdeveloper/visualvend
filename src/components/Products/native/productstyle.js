import { StyleSheet } from "react-native";
import { colors } from "../../../Assets/native/colors";


export const productStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
    },
    gap_5: {
        gap: 5
    },

    barcodeTextField: {
        height: 50,
        backgroundColor: colors.white,
        borderRadius: 10,
        flex: 4
    },

    limitetAccessSelectStyle: {
        flex: 0.5, justifyContent: "center", alignItems: "flex-end"
    }



})