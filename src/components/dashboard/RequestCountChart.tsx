import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { aggregateRequestCounts, eRoseColor } from '@/utils/helpers';

const RequestCountChart: React.FC = ({ data }: any) => {
  const chartData = aggregateRequestCounts(data);
  return (
    <div className="my-4 border-separate bg-white p-4 shadow-lg">
      <h4 className="mb-2 text-center text-2xl">Requests per Service</h4>
      <ResponsiveContainer width={600} height={500}>
        <BarChart data={chartData}>
          <XAxis dataKey="flowName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_requests" fill={eRoseColor} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RequestCountChart;
