import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import appStyles from '../../Assets/native/appStyles';
import { colors } from '../../Assets/native/colors';


const CustomButton = ({
  text,
  onPress,
  style = {},
  disabled = false,
  isPending = false,
  textClr
}) => {
  const buttonStyles = [appStyles.touchableButtonGreen];
  buttonStyles.push(style);

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || isPending}>
      {isPending ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text
          style={[
            disabled
              ? appStyles.touchableTextGreenFaded
              : appStyles.touchableTextWhite,
              {color: textClr || colors.white}
          ]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
