import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import appStyles from '../../../Assets/native/appStyles';
import SmallColorBox from '../../../Widgets/native/smallColorBox';
const SmallColorBoxAndPaymentType = ({ cardPayment }) => {
  return (
    <>
      {cardPayment ? (
        <>
          <View style={[{ paddingVertical: 10, bottom: 10 }]}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View appStyles={[appStyles.rowSpaceBetweenAlignCenter]}>
                <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start", marginVertical: 10 },]}>
                  <SmallColorBox bcgClr={'#BBE409'} />
                  <Text style={[appStyles.subHeaderText, { fontSize: 10 }]}>Visa</Text>
                </View>

                <View
                  style={{ flexDirection: 'row', gap: 7, alignItems: 'center' }}>
                  <SmallColorBox bcgClr={'#D5A804'} />
                  <Text style={[appStyles.subHeaderText, { fontSize: 10 }]}> M/C </Text>
                </View>
              </View>

              <View appStyles={[appStyles.rowSpaceBetweenAlignCenter]}>
                <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start", marginVertical: 10 },]}>
                  <SmallColorBox bcgClr={'#D75DCC'} />
                  <Text style={[appStyles.subHeaderText, { fontSize: 10 }]}>  Debit Card</Text>
                </View>

                <View
                  style={{ flexDirection: 'row', gap: 7, alignItems: 'center' }}>
                  <SmallColorBox bcgClr={'#08CFD5'} />
                  <Text style={[appStyles.subHeaderText, { fontSize: 10 }]}> Amex </Text>
                </View>
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={[{ paddingVertical: 10, bottom: 10 }]}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View appStyles={[appStyles.rowSpaceBetweenAlignCenter]}>
                <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start", marginVertical: 10 },]}>
                  <SmallColorBox bcgClr={'#BBE409'} />
                  <Text style={[appStyles.subHeaderText, { fontSize: 10 }]}> Gpay</Text>
                </View>

                <View
                  style={{ flexDirection: 'row', gap: 7, alignItems: 'center' }}>
                  <SmallColorBox bcgClr={'#D5A804'} />
                  <Text style={[appStyles.subHeaderText, { fontSize: 10 }]}> AfterPay</Text>
                </View>
              </View>

              <View appStyles={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, alignItems: 'center' }]}>
                <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start", marginVertical: 10 }, , { marginLeft: 5 }]}>
                  <SmallColorBox bcgClr={'#D75DCC'} />
                  <Text style={[appStyles.subHeaderText, { fontSize: 10 }]}> Apple Pay</Text>
                </View>

                <View
                  style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginLeft: 5 }}>
                  <SmallColorBox bcgClr={'#08CFD5'} />
                  <Text style={[appStyles.subHeaderText, { fontSize: 10 }]}>Paypal</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default SmallColorBoxAndPaymentType;

