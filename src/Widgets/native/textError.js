import React from 'react';
import { Text } from 'react-native';
import appStyles from '../styles/appStyles';

const TextError = ({ message, style = {} }) => {

    const textStyles = [appStyles.errorText];
    textStyles.push(style);

    return (
        <Text style={textStyles}>

            {message}

        </Text>
    );

};

export default TextError;