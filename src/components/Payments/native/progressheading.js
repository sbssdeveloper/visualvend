import { Text, View } from 'react-native';
import appStyles from '../../../Assets/native/appStyles';


const ProgressingHeading = ({ heading, rateValue,color }) => {
  return (
    <View style={[appStyles.rowSpaceBetweenAlignCenter]}>
      <Text style={[appStyles.subHeaderText]}>{heading}</Text>
      <Text style={{color:color}} >{rateValue || "%"}</Text>
    </View>
  );
};

export default ProgressingHeading;
