import { Text } from 'react-native';


export const ValidatonErroMsg = ({ text }) => (
    <Text
        style={[{ color: "red", fontSize: 10 }]}>
        {text}
    </Text>
);
