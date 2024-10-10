'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
}

const BarChart: React.FC<BarChartProps> = ({ data }: any) => {
  return (
    <div className="mb-8 mt-4 w-full bg-white py-4 shadow-lg">
      <div className="min-h-[400px] w-full">
        <Bar
          data={data}
          options={{
            responsive: true,
            animations: {
              tension: {
                duration: 1000,
                easing: 'linear',
                from: 1,
                to: 0,
                loop: true,
              },
            },
            plugins: {
              legend: {
                position: 'top' as const,
              },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `${context.dataset.label}: ${context.raw}`,
                },
              },
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
};

export default BarChart;
