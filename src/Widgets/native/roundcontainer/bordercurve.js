import {View} from 'react-native';
// import {BottomRoundShape, TopRoundShape} from '../../assets/images';

const BorderComponent = ({topHeader,bottom}) => {
  return (
    <>
      {topHeader ? (
        <View style={{alignItems: 'flex-end', bottom: 4, left: 11}}>
          {/* <TopRoundShape /> */}
        </View>
      ) : (
        <View style={{bottom: bottom, left: -11}}>
          {/* <BottomRoundShape /> */}
        </View>
      )}
    </>
  );
};

export default BorderComponent;
