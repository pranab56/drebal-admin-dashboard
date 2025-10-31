"use client";

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ChartData {
  month: string;
  value: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
    value: number;
  }>;
}

function IncomeRatioChart() {
  const [selectedYear, setSelectedYear] = useState("2024");

  const data: ChartData[] = [
    { month: "Jan", value: 5000 },
    { month: "Feb", value: 3000 },
    { month: "Mar", value: 9000 },
    { month: "Apr", value: 9500 },
    { month: "May", value: 9000 },
    { month: "Jun", value: 9500 },
    { month: "Jul", value: 9950 },
    { month: "Aug", value: 5500 },
    { month: "Sep", value: 3000 },
    { month: "Oct", value: 9000 },
    { month: "Nov", value: 9500 },
    { month: "Dec", value: 9500 },
  ];

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 px-3 py-2 rounded shadow-lg">
          <p className="text-xs font-semibold text-gray-900">
            {payload[0].payload.month}
          </p>
          <p className="text-xs text-green-600">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Income Ratio
        </CardTitle>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[100px] h-9 border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
              ticks={[0, 2000, 4000, 6000, 8000, 10000]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={35}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#7cb342" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default IncomeRatioChart;