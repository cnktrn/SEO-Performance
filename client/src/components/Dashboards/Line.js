import React from 'react';
import { Line } from 'react-chartjs-2';


const LineChart = ({ data }) => {
  // Render the Line Chart component here
  return <Line data={data} />;
};

export default LineChart;