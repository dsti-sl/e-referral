import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import BarChart from './dashboard/BarChart';

interface DataItem {
  name: string;
  average: number;
}

interface CardProps {
  title?: string;
  topDisplay?: boolean;
  pieData?: any; // Optional pie chart data
  data?: DataItem[]; // Optional array of data
}

const Card: React.FC<CardProps> = ({ title, pieData, data, topDisplay }) => {
  return (
    <div className="w-full">
      {' '}
      {/* Fixed width and height for the card */}
      <div className="flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="mb-4 pt-4 text-center text-2xl font-bold">{title}</div>
        {pieData && (
          <div className="flex h-full flex-grow items-center justify-center">
            {' '}
            {/* Adjusted margin-bottom */}
            <div className="w-100 mb-2 flex items-center justify-center">
              <Bar data={pieData} width={750} height={378} />
              {/* Adjust pie chart size */}
            </div>
          </div>
        )}
        {data && (
          <div
            className={`${topDisplay ? 'h-25' : 'h-60'} flex-grow align-middle`}
          >
            {data.map((item, index) => (
              <div key={index} className="my-1">
                <div className="mb-2 text-wrap text-center text-2xl font-bold">
                  {item.name || 'Loading...'}
                </div>
                <div className="my-2 py-4 text-center text-4xl font-bold text-blue-500">
                  {item.average !== undefined && item.average !== null
                    ? item.average
                    : 'Loading..'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
