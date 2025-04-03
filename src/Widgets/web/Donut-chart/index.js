import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ data }) => {
  // Sample data for the chart
  const options = {
    cutout: '80%', // Adjust the thickness of the donut (0-100)
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // Position of the legend: 'top', 'left', 'bottom', 'right'
        align: 'center', // Alignment of the legend: 'start', 'center', 'end'
        labels: {
          // Label options
          color: 'rgb(255, 99, 132)',
          usePointStyle: true, // Use point style for legend symbols
        },
      },
    },
  };

  return (
    <div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DonutChart;
