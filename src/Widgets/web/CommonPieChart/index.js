import React from "react";
import Chart from "react-apexcharts";
import noRecordFound from "../../../Assets/web/images/no-record-found.svg";
import { useMediaQuery } from 'react-responsive';

const PieChart = ({ data }) => {
  const options = {
    chart: {
      type: "pie",
      width: "100%",
    },
    labels: data.labels,
    colors: data.backgroundColor,
    legend: {
      position: "left", // Set legend position to left
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, index) {
        return data.labels[index.seriesIndex] + " " + val + "%";
      },
    },
  };
const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isAllZeros = () => {
    return data.datasets.every((element) => element === 0 || Number.isNaN(element));
  };

  return (
    <>
    {!isMobile && (
       <div className="w--full position--relative innerPiaChart">
       {!isAllZeros() ? (
         <Chart options={options} series={data.datasets} type="pie" width={450} height={450} />
       ) : (
         <div className="w--full d--flex justify-content--center align-items--center h--full font--md gap--md flex--column">
           <img src={noRecordFound} alt="noRecordFound" />
           <div className="font--sm text--c">No Record Found</div>
         </div>
       )}
     </div>
    )}
     {isMobile && (
       <div className="w--full position--relative innerPiaChart">
       {!isAllZeros() ? (
         <Chart options={options} series={data.datasets} type="pie" width={300} height={300} />
       ) : (
         <div className="w--full d--flex justify-content--center align-items--center h--full font--md gap--md flex--column">
           <img src={noRecordFound} alt="noRecordFound" />
           <div className="font--sm text--c">No Record Found</div>
         </div>
       )}
     </div>
     )}
    
   
    </>
  );
};

export default PieChart;
