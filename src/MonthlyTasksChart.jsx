// src/MonthlyTasksChart.jsx
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const MonthlyTasksChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Fetch data for the monthly chart (dummy data for now)
    const data = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Tasks Completed",
          data: [5, 10, 7, 15], // Replace with actual data
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const ctx = document.getElementById("monthlyChart").getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "line",
      data,
      options: {
        plugins: {
          title: {
            display: true,
            text: "Monthly Tasks Completed",
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    });
  }, []);

  return (
    <div>
      <h2>Monthly Tasks Chart</h2>
      <canvas id="monthlyChart" width="400" height="400"></canvas>
    </div>
  );
};

export default MonthlyTasksChart;
