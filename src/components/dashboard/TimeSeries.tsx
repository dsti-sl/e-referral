import { prepareData, eRoseColor } from '@/utils/helpers';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const TimeSeriesChart = ({ data }: any) => {
  const chartData = prepareData(data);

  return (
    <div className="my-4 border-separate bg-white p-6 shadow-lg">
      <h4 className="mb-2 text-center text-2xl">Daily Requests</h4>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke={eRoseColor} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;
