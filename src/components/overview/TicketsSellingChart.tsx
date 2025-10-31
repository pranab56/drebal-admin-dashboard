"use client";

import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: PieData;
  }>;
}

function TicketsSellingChart() {
  const [selectedMonth, setSelectedMonth] = useState("February");

  const data: PieData[] = [
    { name: "Direct Sales", value: 9457, color: "#7cb342" },
    { name: "Re - Sales", value: 12457, color: "#e0e0e0" },
  ];

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 px-3 py-2 rounded shadow-lg">
          <p className="text-xs font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-xs text-green-600">{payload[0].value.toLocaleString()}K</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border border-gray-200 shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Tickets Selling
        </CardTitle>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[120px] h-9 border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="February">February</SelectItem>
            <SelectItem value="January">January</SelectItem>
            <SelectItem value="March">March</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="70%" height={240}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-xs text-gray-600">Re - Sales</span>
              </div>
              <p className="text-lg font-bold text-gray-900">12,457K</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-[#7cb342]"></div>
                <span className="text-xs text-gray-600">Direct Sales</span>
              </div>
              <p className="text-lg font-bold text-gray-900">9,457K</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TicketsSellingChart;