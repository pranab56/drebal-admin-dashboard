"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TicketsData {
  month?: string;
  directSales?: {
    amount: number;
    count: number;
  };
  resales?: {
    amount: number;
    count: number;
  };
}

interface PieData {
  name: string;
  value: number;
  count: number;
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

interface TicketsSellingChartProps {
  ticketsData?: TicketsData;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

function TicketsSellingChart({ 
  ticketsData, 
  selectedMonth, 
  onMonthChange 
}: TicketsSellingChartProps) {

  // Transform API data to chart format
  const transformData = (data: TicketsData): PieData[] => {
    return [
      {
        name: "Direct Sales",
        value: data?.directSales?.amount || 0,
        count: data?.directSales?.count || 0,
        color: "#7cb342"
      },
      {
        name: "Re - Sales",
        value: data?.resales?.amount || 0,
        count: data?.resales?.count || 0,
        color: "#e0e0e0"
      },
    ];
  };

  const data: PieData[] = ticketsData ? transformData(ticketsData) : [
    { name: "Direct Sales", value: 0, count: 0, color: "#7cb342" },
    { name: "Re - Sales", value: 0, count: 0, color: "#e0e0e0" },
  ];

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 px-3 py-2 rounded shadow-lg">
          <p className="text-xs font-semibold text-gray-900">{item.name}</p>
          <p className="text-xs text-gray-600">Amount: ${item.value.toLocaleString()}</p>
          <p className="text-xs text-gray-600">Count: {item.count}</p>
        </div>
      );
    }
    return null;
  };

  // Get month options
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Card className="border border-gray-200 shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Tickets Selling
        </CardTitle>
        <Select 
          value={selectedMonth} 
          onValueChange={onMonthChange}
        >
          <SelectTrigger className="w-[120px] h-9 border-gray-200">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map(month => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
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
              <p className="text-lg font-bold text-gray-900">
                ${(data[1]?.value || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {data[1]?.count || 0} tickets
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-[#7cb342]"></div>
                <span className="text-xs text-gray-600">Direct Sales</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                ${(data[0]?.value || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {data[0]?.count || 0} tickets
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TicketsSellingChart;