import { View, Text, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { getDimensions } from '../../../../Helpers/native/constants';
import roundcontainerstyles from '../../../../Widgets/native/roundcontainer/roundcontainerstyles';
import NoRecords from '../../../../Widgets/native/noRecords';
import { chartConfig } from '../../constant';
import appStyles from '../../../../Assets/native/appStyles';
import { boolean } from 'yup';

const GraphStatics = ({ graphData, isLoading }) => {
  const [tooltipData, setTooltipData] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);
  const { width } = getDimensions();
  const labels = Object?.keys(graphData);
  const datasetArray = Object?.values(graphData);


  const data = {
    labels: labels || [],
    datasets: [
      {
        data: datasetArray || [],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 1,
      },
    ],
  };

  const showTooltip = (data) => {
    if (timeoutRef?.current) clearTimeout(timeoutRef?.current);
    setTooltipData(data);
    opacity.setValue(1);
    timeoutRef.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setTooltipData(null));
    }, 800);
  };

  useEffect(() => {
    return () => {
      timeoutRef?.current && clearTimeout(timeoutRef?.current);
    };
  }, []);


  return (
    <View style={[roundcontainerstyles.roundBox, { height: 250, width: "100%", marginVertical: 5 }]}>
      {
        labels?.length > 0 ?
          <LineChart
            data={data}
            width={width - 20}
            height={220}
            chartConfig={chartConfig}
            bezier
            onDataPointClick={({ value, x, y } = {}) => showTooltip({ value, x, y })}
          />
          :
          <NoRecords isPending={isLoading} />
      }
      {
        tooltipData &&
        <Animated.View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 5,
            height: 50,
            width: 50,
            left: tooltipData?.x + 10,
            top: tooltipData?.y > 175 ? 140 : tooltipData?.y + 10,
            position: "absolute",
            justifyContent: "center",
            borderWidth: 1.5,
            borderColor: "#E7E7E7",
            opacity,
          }}
        >
          <Text style={[appStyles.subHeaderText, { textAlign: "center" }]}>{tooltipData?.value}</Text>
        </Animated.View>
      }
    </View>
  );
};

export default GraphStatics;
