import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

interface DataItem {
  name: string;
  average: number;
}

interface CardProps {
  title?: string;
  pieData?: any; // Optional pie chart data
  data?: DataItem[]; // Optional array of data
}

const Card: React.FC<CardProps> = ({ title, pieData, data }) => {
  return (
    <div className="mb-20 w-full">
      {' '}
      {/* Fixed width and height for the card */}
      <div className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-white p-4 shadow-lg">
        <div className="mb-4 text-center text-2xl font-bold">{title}</div>
        {pieData && (
          <div className="mb-16 flex h-full flex-grow items-center justify-center">
            {' '}
            {/* Adjusted margin-bottom */}
            <div className="flex items-center justify-center">
              <Pie data={pieData} width={400} height={400} />{' '}
              {/* Adjust pie chart size */}
            </div>
          </div>
        )}
        {data && (
          <div className="h-60 flex-grow align-middle">
            {data.map((item, index) => (
              <div key={index} className="my-4">
                <div className="mb-3 text-wrap text-center text-2xl font-bold">
                  {item.name}
                </div>
                <div className="mt-6 py-10 text-center text-4xl font-bold text-blue-500">
                  {item.average}
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
