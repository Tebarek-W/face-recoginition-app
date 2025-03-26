import React from 'react';
import { Card, CardHeader, CardContent } from '@mui/material';
import {
  BarChart,
  PieChart,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AttendanceChart = ({ 
  type = 'bar', 
  title = '', 
  data = [], 
  height = 300,
  showLegend = true
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      {title && <CardHeader title={title} />}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              {showLegend && <Legend />}
              <Bar dataKey="present" fill="#4CAF50" name="Present" />
              <Bar dataKey="absent" fill="#F44336" name="Absent" />
              <Bar dataKey="late" fill="#FFC107" name="Late" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              {showLegend && <Legend />}
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;