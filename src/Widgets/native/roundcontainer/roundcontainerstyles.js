import { Dimensions, StyleSheet } from 'react-native';
import appStyles from '../../../Assets/native/appStyles';

const deviceWidth = Dimensions.get('window').width;
const halfDeviceWidth = deviceWidth * 0.5;



export default roundContainerStyle = StyleSheet.create({
  roundBox: {
    height: 130,
    backgroundColor: 'white',
    width: halfDeviceWidth - 15,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    ...appStyles.cardElevation

  },
  largeCyanText: {
    color: '#149CBE',
    fontSize: 18,
    fontWeight: '600',
  }
});
