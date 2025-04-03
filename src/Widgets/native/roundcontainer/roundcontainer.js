import React from 'react';
import { Text, View } from 'react-native';
import appStyles, { fonts } from '../../../Assets/native/appStyles';
import RoundBox from './roundBox';
import roundcontainerstyles from './roundcontainerstyles';
import { getDimensions } from '../../../Helpers/native/constants';
import ProgressBars from '../../../components/Payments/native/progressbar';
import { colors } from '../../../Assets/native/colors';
import { reset } from '../../../redux/slices/authSlice';
import SmallColorBox from '../smallColorBox';

const RoundContainer = ({ machineData, isLoading, ...rest }) => {
  const { width } = getDimensions();
  const { headingFirst, secondHeading, subHeadingtwoValue, subHeadingOneValue, subHeadingOne, subHeadingtwo, total = null } = rest?.descriptonData || {};
  const totalValue = total ?? secondHeading;
  return (
    <>
    
      <View style={[appStyles.rowSpaceBetweenAlignCenter, { padding: 5 }]}>
        <View style={[roundcontainerstyles.roundBox, { width: width - 20, height: undefined }]}>
          <View style={[appStyles.rowSpaceBetweenAlignCenter, { marginVertical: 5,justifyContent:"flex-start",gap:2 }]}>
            <Text style={[appStyles.subHeaderText, fonts.semiBold, { fontSize: 14 }]}>{headingFirst || ""}:</Text>
            <Text style={[appStyles.subHeaderText, fonts.semiBold, { fontSize: 14 }]}>{secondHeading || "0"}</Text>
          </View>
          <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 5, justifyContent: "flex-start", width: "100%" }]}>
            {totalValue > 0 ?
              <View style={{ width: `${(subHeadingOneValue / totalValue) * 100}%`, gap: 5 }}>
                <ProgressBars bcgClrProgress={"#ED7A8C"} barcolor={"#ED7A8C"} rateValue="0%" height={10} />
              </View>
              :
              <View style={{ width: `100%`, gap: 5 }}>
                <ProgressBars bcgClrProgress={colors.veryLightGrey} barcolor={"#ED7A8C"} rateValue="0%" height={10} />
              </View>
            }
            {totalValue > 0 &&
              <View style={{ width: `${(subHeadingtwoValue / totalValue) * 100}%`, gap: 5 }}>
                <ProgressBars bcgClrProgress={"#98E189"} barcolor={"#98E189"} rateValue="0%" height={10} />
              </View>
            }
          </View>
          <View style={{ flex: 1, flexDirection: "row", width: "100%", gap: 5, top: 5 }}>
            <View style={{ width: `50%`, flex: 1, flexDirection: "row", width: "100%", gap: 5, alignItems: 'center', justifyContent: "flex-start" }}>
              <SmallColorBox custumStyle={{ height: 15, width: 15, backgroundColor: colors.maroonlight, borderRadius: undefined }} />
              <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey, textAlign: "center" }]}>{subHeadingOne || ""}</Text>
              <Text style={[appStyles.subHeaderText, { textAlign: "center" }]}> {subHeadingOneValue || "0"}</Text>
            </View>
            <View style={{ width: `50%`, flex: 1, flexDirection: "row", width: "100%", gap: 5, alignItems: 'center', justifyContent: "flex-end" }}>
              <SmallColorBox custumStyle={{ height: 15, width: 15, backgroundColor: colors.lightgreen, borderRadius: undefined }} />
              <Text style={[appStyles.subHeaderText, { color: colors.appLightGrey, textAlign: "center" }]}>{subHeadingtwo || ""}</Text>
              <Text style={[appStyles.subHeaderText, { textAlign: "center" }]}> {subHeadingtwoValue || "0"}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default RoundContainer;




// const sum = Number(machineData?.vend_beat?.connected) + Number(machineData?.vend_beat?.fluctuating) + Number(machineData?.vend_beat?.offline);
// const result = Number(machineData?.vend_beat?.total) - Number(sum);
{/* {containerContents?.map((content, index) => (
          <View key={index} style={appStyles.rowSpaceBetweenAlignCenter}>
            <RoundBox machineData={machineData} isLoading={isLoading} containerContent={content} />
          </View>

        ))} */}
{/* <View style={[]}>

              <ProgressBars bcgClrProgress={"#D6EFD8"} barcolor={colors.appGreen} rateValue="30%" height={10} />
              <View>
              <Text style={[appStyles.subHeaderText]}>Assined</Text>
              <Text style={[appStyles.subHeaderText,{textAlign:"center"}]}>4</Text>
              </View>
            </View> */}

{/* <ProgressBars bcgClrProgress={"#D6EFD8"} barcolor={colors.appGreen} rateValue="30%" height={10} /> */ }