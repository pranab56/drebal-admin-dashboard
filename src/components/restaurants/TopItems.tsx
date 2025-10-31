"use client";

import DateRangeSelector from './DateRangeSelector';
import Pagination from './Pagination';

interface TopItem {
  id: number;
  name: string;
  icon: string;
  quantity: number;
  earning: string;
}

interface TopItemsProps {
  items: TopItem[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
}

const TopItems = ({ 
  items, 
  currentPage, 
  setCurrentPage, 
  dateRange, 
  setDateRange 
}: TopItemsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Top Items</h2>
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-600">SI</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Quantity</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Earning</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-600">{String(item.id).padStart(2, '0')}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">{item.quantity}</td>
                <td className="py-4 px-4 text-gray-600">{item.earning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default TopItems;