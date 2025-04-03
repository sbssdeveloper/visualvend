import {View, Text} from 'react-native';
import appStyles from '../../styles/appStyles';

const HomeVendInfoScreen = ({heading1, heading2}) => {
  return (
    <>
      <View
        style={[appStyles.rowSpaceBetweenAlignCenter, {paddingVertical: 10,backgroundColor:"green"}]}>
        <View>
          <Text style={[appStyles.subHeaderText, {fontSize: 14}]}>
            {heading1}
          </Text>
        </View>

        <View style={{backgroundColor:"yellow"}}>
          <Text style={[appStyles.subHeaderText, {fontSize: 14}]}>
            {heading2}
          </Text>
        </View>
      </View>
    </>
  );
};

export default HomeVendInfoScreen;
