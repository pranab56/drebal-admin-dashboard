"use client";

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface IncomeRatioData {
  year: number;
  data: Array<{
    month: string;
    amount: number;
  }>;
}

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

interface IncomeRatioChartProps {
  incomeRatioData?: IncomeRatioData;
}

function IncomeRatioChart({ incomeRatioData }: IncomeRatioChartProps) {
  const [selectedYear, setSelectedYear] = useState(
    incomeRatioData?.year?.toString() || "2025"
  );

  // Transform API data to chart format
  const transformData = (apiData: IncomeRatioData['data'] = []): ChartData[] => {
    return apiData.map(item => ({
      month: item.month,
      value: item.amount
    }));
  };

  const chartData = incomeRatioData ? transformData(incomeRatioData.data) : [];

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

  // Generate year options based on available data
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => (currentYear - i).toString()
  );

  // Calculate max value for Y-axis ticks
  const maxValue = Math.max(...chartData.map(d => d.value));
  const maxTick = Math.ceil(maxValue / 1000) * 1000;
  const tickCount = 6;
  const tickStep = maxTick / (tickCount - 1);
  const ticks = Array.from(
    { length: tickCount },
    (_, i) => Math.round(i * tickStep)
  );

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
            {yearOptions.map(year => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
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
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              ticks={ticks}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              maxBarSize={35}
              fill="#7cb342"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value > 0 ? "#7cb342" : "#e0e0e0"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default IncomeRatioChart;