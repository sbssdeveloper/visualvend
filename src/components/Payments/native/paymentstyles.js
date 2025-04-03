import { StyleSheet } from 'react-native';
import { colors } from '../../../Assets/native/colors';
import appStyles from '../../../Assets/native/appStyles';

export const paymentstyle = StyleSheet.create({
  vendStausContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },

  squareBox: {
    // borderRadius: 10,
    paddingHorizontal: 2,
    marginHorizontal: 5,
    flexGrow: 1,
    paddingVertical: 10,
    // borderWidth: 1,
    // borderColor: '#E2E2E2',
    marginBottom: 10,
    backgroundColor: "white",
    ...appStyles.commonElevation

  },
  squareBoxText: {
    fontSize: 16,
    color: '#149CBE',

  },

  progressLineStyle: {
    width: '80%',
    height: 10,
    borderRadius: 10,
  },
});
