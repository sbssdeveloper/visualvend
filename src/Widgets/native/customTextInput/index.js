
import { colors } from "../../../Assets/native/colors"
import appStyles from "../../../Assets/native/appStyles"
import { TextInput } from "react-native"

const CustTextInput = ({ textinputText, handleChange, handleBlur, lines, style, placeholder, keyboardType,
    textInputRef,
    editable, maxLength,
}) => {

    return (
        <TextInput
            style={[appStyles.textInput, {  backgroundColor: editable === false ? colors.veryLightGrey : "transparent", borderRadius: 10, maxHeight: lines ? 40 : 60,...style, }]}
            value={textinputText}
            placeholderTextColor={colors.appLightGrey}
            onChangeText={text => handleChange(text)}
            onBlur={handleBlur}
            numberOfLines={lines || 1}
            multiline={lines ? true : false}
            placeholder={placeholder}
            keyboardType={keyboardType || "default"}
            maxLength={maxLength}
            editable={editable}
            ref={textInputRef ? textInputRef : undefined}
        />
    )
}
export default CustTextInput