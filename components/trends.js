"use client";
import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x-axis
  LinearScale, // y-axis
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

export default function Trends({ chartData }) {
  const defaultData = {
    labels: ["Loading..."],
    datasets: [
      {
        label: "Loading",
        data: [0],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (!chartData) {
    return <p>Loading Team Data</p>;
  } else {
    return (
      <div
        style={{
          maxWidth: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Line
          data={chartData || defaultData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top", // Position of the legend
                labels: {
                  color: "white", // Change legend text color
                },
              },
              // title: {
              //   display: true,
              //   text: "Sales Over the First Half of the Year", // Chart title
              // },
            },
            scales: {
              y: {
                beginAtZero: true, // y-axis starts at 0
                ticks: {
                  color: "rgb(186, 182, 182)", // Y-axis label color
                },
                grid: {
                  color: "rgb(186, 182, 182)", // Y-axis grid line color
                },
              },
              x: {
                ticks: {
                  color: "rgb(186, 182, 182)", // X-axis label color
                },
                grid: {
                  color: "rgb(186, 182, 182)", // X-axis grid line color
                },
              },
            },
          }}
        />
      </div>
    );
  }
}
