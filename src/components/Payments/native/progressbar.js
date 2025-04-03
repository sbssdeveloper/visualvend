import { View } from 'react-native';
import { paymentstyle } from './paymentstyles';

const ProgressBars = ({ bcgClrProgress, barcolor, rateValue, height,style }) => {
  let decimalValue = parseFloat(rateValue) / 100;
  const inValid = decimalValue > 1.00;
  return (
    <>
      <View
        style={{
          padding: height ? 1 : 3,
          borderRadius: 10,
          backgroundColor: bcgClrProgress,
          borderColor: '#444444', // Border color
          shadowColor: '#444444',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 5,
          shadowRadius: 100,
          elevation: 1,
          ...style
        }}
      >
        <View
          style={{
            height: height || 5,
            backgroundColor: barcolor,
            width: inValid ? "100%" : rateValue,
            borderRadius: 10,
            elevation: 0.5,
            
          }}
        />
      </View>

    </>
  );
};
export default ProgressBars;





