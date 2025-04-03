import { View, Text } from 'react-native';
import roundcontainerstyles from './roundcontainerstyles';
import appStyles from '../../../Assets/native/appStyles';
import { sortWordsLength } from '../../../Helpers/native';
import AppSkelton from '../skelton';

const RoundBox = ({ machineData, isLoading, containerContent }) => {
  const { outerHeading, heading, subHeading, firstText, firstSubText, secondText, secondSubText, thirdText, thirdSubText } = containerContent || {};
  return (
    <View>
      <Text style={[appStyles.subHeaderText, { fontSize: 14, marginVertical: 10 }]}> {outerHeading || ""}</Text>
      <View style={[roundcontainerstyles.roundBox]}>
        {
          isLoading ? <AppSkelton height={"80%"} width={"100%"} length={1} /> :
            <View style={[{ gap: 5 }]}>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[roundcontainerstyles.largeCyanText]} numberOfLines={0}>
                    {sortWordsLength(heading || "", 12)}
                  </Text>
                </View>

                <View style={{ alignSelf: 'flex-end', marginRight: 5 }}>
                  <Text style={[appStyles.subHeaderText, { fontSize: 12 }]}>
                    {subHeading || ""}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 5 }}>
                <Text style={[appStyles.subHeaderText,]}>{firstText || ""}
                </Text>

                <View style={{ alignSelf: 'center', }}>
                  <Text style={[appStyles.subHeaderText, { fontFamily: 'Urbanist-Regular' }]}>
                    {firstSubText || ""}
                  </Text>
                </View>
              </View>

              <Text style={[appStyles.lightGreyText]}>
                {secondText || ""} {secondSubText || ""}
              </Text>
              <Text style={[appStyles.lightGreyText]}>
                {thirdText || ""} {thirdSubText || ""}
              </Text>
              {
                containerContent?.extraBottomRight &&
                <View style={{ alignSelf: 'flex-end', }}>
                  <Text style={[appStyles.subHeaderText, { fontSize: 9 }]}>($0.0 fees)</Text>
                </View>
              }
            </View>
        }
      </View>
    </View>

  );

};

export default RoundBox;