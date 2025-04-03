import { Platform, StyleSheet } from 'react-native';
import { colors } from './colors';

export default appStyles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 8,
    backgroundColor: colors.white,
  },
  modalMainContainer: {
    backgroundColor: colors.pureBlackThirty,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  modalSubContainer: {
    width: '100%',
    //maxHeight: '70%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'Urbanist-Medium',
    color: colors.pureBlack,
    textAlign: 'center',
    marginVertical: 5,
  },
  subHeaderText: {
    fontSize: 14,
    fontFamily: 'Urbanist-SemiBold',
    color: colors.mediummBlack,
    // textAlign: 'center',
    // marginVertical: 5,
    
    letterSpacing: 0.4,
  },
  lightGreyText: {
    fontSize: 10,
    //fontFamily: 'RoobertTRIAL-Regular',
    color: colors.appLightGrey,
    // textAlign: 'center',
  },
  blackText: {
    fontSize: 14,
    //fontFamily: 'RoobertTRIAL-Regular',
    color: colors.pureBlack,
    // textAlign: 'center',
  },
  whiteText: {
    fontSize: 14,
    //fontFamily: 'RoobertTRIAL-Regular',
    color: colors.white,
    textAlign: 'center',
  },
  errorText: {
    color: colors.appRed,
    fontSize: 12,
    //fontFamily: 'RoobertTRIAL-Regular',
  },
  smallGreenText: {
    color: colors.appGreen,
    fontSize: 12,
    //fontFamily: 'RoobertTRIAL-Regular',
  },
  verylightGreyText: {
    color: colors.veryLightGrey,
    fontSize: 12,
    //fontFamily: 'RoobertTRIAL-Medium',
  },
  touchableButtonWhite: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 6,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  touchableButtonGreen: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.appGreen,
    borderRadius: 6,
    backgroundColor: colors.appGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },

  touchableButtonCyan: {
    height: 40,
    width: '100%',
    borderColor: 'transparent',
    backgroundColor: colors.appCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },

  touchableButtonRed: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.appRed,
    borderRadius: 6,
    backgroundColor: colors.appRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 6,
  },
  touchableButtonGreyDisabled: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.appGreenDisabled,
    borderRadius: 6,
    backgroundColor: colors.appGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 6,
  },
  touchableButtonTransparent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.transparent,
  },
  touchableTextGreen: {
    fontSize: 16,
    //fontFamily: 'RoobertTRIAL-Medium',
    color: colors.appGreen,
  },
  textDarkGrey: {
    fontSize: 14,
    //fontFamily: 'RoobertTRIAL-Medium',
    color: colors.appDarkGrey,
  },
  textLightGrey: {
    fontSize: 14,
    //fontFamily: 'RoobertTRIAL-Medium',
    color: colors.appLightGrey,
  },
  profileNameDarkGrey: {
    fontSize: 24,
    //fontFamily: 'RoobertTRIAL-Medium',
    lineHeight: 32,
    color: colors.appDarkGrey,
    fontWeight: '600',
  },
  touchableTextGreenFaded: {
    fontSize: 16,
    //fontFamily: 'RoobertTRIAL-Medium',
    color: colors.appGreenFaded,
  },
  touchableButtonWhiteBorderGreen: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.appGreen,
    borderRadius: 6,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  touchableTextWhite: {
    fontSize: 16,
    //fontFamily: 'RoobertTRIAL-Medium',
    color: colors.white,
  },
  touchableButtonWhiteBorderGrey: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.appThinGrey,
    borderRadius: 6,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 5,
  },
  touchableTextBlack: {
    fontSize: 16,
    //fontFamily: 'RoobertTRIAL-Medium',
    color: colors.pureBlack,
  },
  textInputView: {
    height: 40,
    // padding: 5,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginHorizontal: 10,
    paddingHorizontal: 10
  },
  textInput: {

    fontSize: 12,
    color: colors.pureBlack,
    //fontFamily: 'RoobertTRIAL-Medium',
    paddingHorizontal: 10,
    backgroundColor: colors.transparent,
  },
  rowSpaceBetweenAlignCenter: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },

rowCenter:{
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
},

  ph_10: {
    paddingHorizontal: 10,
  },
  ph_20: {
    paddingHorizontal: 15,
  },
  pv_20: {
    paddingVertical: 20,
  },
  pv_10: {
    paddingVertical: 10,
  },
  gap_10: {
    gap: 10
  },
gap_5:{
gap:5
},
  drawerItemCustomStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E2E2",
  },

  justifyCStart: {
    justifyContent: "flex-start"
  },

  customInputStyles: {
    backgroundColor: "transparent", borderWidth: 1, borderColor: "#E7E7E7", height: 40
  },

  flx1: {
    flex: 1
  },

  flx2: {
    flex: 2
  },

  flx3: {
    flex: 3
  },

  a_s_c:{
    alignSelf:"center"
  },
  a_s_e:{
    alignSelf:"flex-end"
  },

  commonElevation: {
    ...Platform.select({
      ios: {
        shadowColor: '#888888',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
        shadowColor: '#888888',
        
      },
    }),
  },

  cardElevation: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#888888',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 8,
  },

});

export const fonts = {
  regular: { fontFamily: 'Urbanist-Regular' },
  bold: { fontFamily: 'Urbanist-Bold' },
  semiBold: { fontFamily: 'Urbanist-SemiBold' },
  mediumm: { fontFamily: 'Urbanist-Medium' },
};
