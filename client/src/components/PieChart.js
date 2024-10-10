import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const labels = data.map((item) => item.category);
  const counts = data.map((item) => item.count);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Items Count by Category",
        data: counts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2, // Add borders between segments
        hoverOffset: 8, // Create a hover effect
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Place the legend at the bottom
        labels: {
          boxWidth: 16, // Adjust the size of the legend boxes
          padding: 20,
          font: {
            size: 14,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
      datalabels: {
        display: true,
        color: "white", // Display the data values on the pie chart
        formatter: (value, ctx) => {
          let sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
          let percentage = ((value / sum) * 100).toFixed(2) + "%";
          return percentage;
        },
      },
    },
    animation: {
      animateScale: true, // Enable animation when the chart renders
      animateRotate: true,
    },
  };

  return (
    <div className="row justify-content-center">
      <div className="col-sm-5">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
