import { eRoseColor, groupRootData } from '@/utils/helpers';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const GroupTimeSeeries: React.FC<{ data: any }> = ({ data }) => {
  const groupedData = groupRootData(data);

  // Prepare data for the chart, ensuring date is formatted
  const chartData = groupedData.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    [item.root]: item.count, // Using root as a dynamic property
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Array.from(new Set(groupedData.map((item) => item.root))).map(
          (root) => (
            <Line
              key={root}
              type="monotone"
              dataKey={root}
              stroke={eRoseColor}
            />
          ),
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GroupTimeSeeries;
