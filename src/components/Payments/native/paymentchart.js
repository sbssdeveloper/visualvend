import { View, Text, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import SmallColorBoxAndPaymentType from './smallcolorboxandpaymenttype';
import appStyles from '../../../Assets/native/appStyles';
import { sortWordsLength } from '../../../Helpers/native';
import { colors } from '../../../Assets/native/colors';
import { chartConfig } from '../constant';
import { PieChart } from 'react-native-chart-kit';
const deviceWidth = Dimensions.get('window').width - 50;
const halfDeviceWidth = deviceWidth * 0.5;

const PaymentChart = ({ chartData }) => {
  return (
    <>
      <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.gap_10, { paddingBottom: 10 }]}>
        <View>
          <View style={[appStyles.pv_10, appStyles.rowSpaceBetweenAlignCenter, { justifyContent: undefined, gap: 2 }]}>
            <Text style={[appStyles.subHeaderText]}>Card Payment:</Text>
            <Text style={[appStyles.subHeaderText]}>  ${sortWordsLength(chartData?.total_card_payments_amount, 8) || "0"}</Text>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              width: halfDeviceWidth,
              borderRadius: 10,
              paddingHorizontal: 10,
            }}>
            <CardPaymentChart chartData={chartData} />
            <SmallColorBoxAndPaymentType cardPayment={true} />
          </View>
        </View>
        <View>
          <View style={[appStyles.pv_10, appStyles.rowSpaceBetweenAlignCenter, { justifyContent: undefined, gap: 2 }]}>
            <Text style={[appStyles.subHeaderText]}>Mobile Payment:</Text>
            <Text style={[appStyles.subHeaderText]}>${sortWordsLength(chartData?.total_mobile_payments_amount, 8) || "0"}</Text>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              width: halfDeviceWidth,
              borderRadius: 10,
              paddingHorizontal: 20,
            }}>
            <MobilePaymentChart chartData={chartData} />
            <SmallColorBoxAndPaymentType />
          </View>
        </View>
      </View>
    </>
  );
};

export default PaymentChart;


const CardPaymentChart = ({ chartData }) => {
  const chartArray = returnChartArray(chartData) || [];
  const valueExist = chartArray?.some(item => item?.population > 0);
  return (
    <>
      <View style={{ alignSelf: "center", }}>
        {
          valueExist ?
            <PieChart
              hasLegend={false}
              data={chartArray}
              width={150}
              height={150}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="35"
            />
            :
            <View style={{ width: 150, height: 150, justifyContent: "center", paddingTop: 50 }}>
              <Text style={{ textAlign: "center", color: colors.appGrey }}>Data Not Found</Text>
            </View>
        }
      </View>
    </>
  )
}


const MobilePaymentChart = ({ chartData }) => {
  const chartArray = returnChartArray(chartData) || [];
  const valueExist = chartArray?.some(item => item?.population > 0);
  return (<>
    <View style={{ alignSelf: "center", }}>
      {
        valueExist ?
          <PieChart
            hasLegend={false}
            data={chartArray}
            width={150}
            height={150}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="35"
          />
          :
          <View style={{ width: 150, height: 150, justifyContent: "center", paddingTop: 50 }}>
            <Text style={{ textAlign: "center", color: colors.appGrey }}>Data Not Found</Text>
          </View>
      }
    </View>
  </>
  )
}

const returnChartArray = (chartData) => {
  const chartArrayData = [
    {
      name: "Apple Pay",
      population: parseFloat(chartData?.apple),
      color: "#D75DCC",

    },
    {
      name: "Gpay",
      population: parseFloat(chartData?.google_pay),
      color: "#BBE409",

    },
    {
      name: "Paypal",
      population: parseFloat(chartData?.paypal),
      color: "#08CFD5",

    },
    {
      name: "After Pay",
      population: parseFloat(chartData?.after_pay),
      color: "#D5A804",

    }
  ];
  return chartArrayData
}







  ;





