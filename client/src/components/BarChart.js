import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data }) => {
  const priceRanges = [
    "0-100",
    "101-200",
    "201-300",
    "301-400",
    "401-500",
    "501-600",
    "601-700",
    "701-800",
    "801-900",
    "901+",
  ];
  const itemCounts = priceRanges.map((range) => {
    const rangeData = data.find((d) => d._id === range);
    return rangeData ? rangeData.count : 0;
  });

  const chartData = {
    labels: priceRanges,
    datasets: [
      {
        label: "Number of Items Sold",
        data: itemCounts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: { beginAtZero: true , 
        ticks: {
        stepSize: 1,  // Ensure that the step between ticks is 1
      },
    max:5
    },
    },
  };

  return (
    <div className="row justify-content-center">
      <div className="col-sm-10 ">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
