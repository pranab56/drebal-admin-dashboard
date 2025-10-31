"use client";

import DateRangeSelector from './DateRangeSelector';
import Pagination from './Pagination';

interface TopRestaurant {
  id: number;
  name: string;
  logo: string;
  sales: number;
  earning: string;
}

interface TopRestaurantsProps {
  restaurants: TopRestaurant[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
}

const TopRestaurants = ({
  restaurants,
  currentPage,
  setCurrentPage,
  dateRange,
  setDateRange
}: TopRestaurantsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Top Restaurants</h2>
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-600">SI</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Sales</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Earning</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-600">{String(restaurant.id).padStart(2, '0')}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">
                      {restaurant.logo}
                    </div>
                    <span>{restaurant.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">{restaurant.sales}</td>
                <td className="py-4 px-4 text-gray-600">{restaurant.earning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default TopRestaurants;