"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Download, Eye, Filter, Pencil, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Restaurant {
  id: string;
  name: string;
  city: string;
  contact: string;
  earning: string;
  status: string;
}

interface RestaurantListProps {
  restaurants: Restaurant[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  currentPage,
  setCurrentPage,
}) => {
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.contact.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || restaurant.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white';
      case 'Pending':
        return 'bg-amber-500 hover:bg-amber-600 text-white';
      case 'Rejected':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const handleSelectAll = (checked: boolean | string) => {
    if (checked === true) {
      setSelectedRestaurants(filteredRestaurants.map(r => r.id));
    } else {
      setSelectedRestaurants([]);
    }
  };

  const handleSelectRestaurant = (id: string, checked: boolean | string) => {
    if (checked === true) {
      setSelectedRestaurants([...selectedRestaurants, id]);
    } else {
      setSelectedRestaurants(selectedRestaurants.filter(rId => rId !== id));
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    console.log('Edit restaurant:', restaurant);
  };

  const handleView = (restaurant: Restaurant) => {
    console.log('View restaurant:', restaurant);
  };

  const handleDelete = (restaurant: Restaurant) => {
    console.log('Delete restaurant:', restaurant);
  };


  return (
    <Card className="border-0 shadow-sm bg-white p-0">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Restaurant List</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-48 bg-white border-gray-200"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white border-gray-200">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('approved')}>
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('rejected')}>
                  Rejected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="bg-white border-gray-200">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4">
                  <Checkbox
                    checked={selectedRestaurants.length === filteredRestaurants.length && filteredRestaurants.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Id</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">City</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Contact</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Earning</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestaurants.map((restaurant, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <Checkbox
                      checked={selectedRestaurants.includes(restaurant.id)}
                      onCheckedChange={(checked) => handleSelectRestaurant(restaurant.id, checked)}
                    />
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{restaurant.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{restaurant.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{restaurant.city}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{restaurant.contact}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{restaurant.earning}</td>
                  <td className="py-4 px-4">
                    <Badge className={`${getStatusColor(restaurant.status)} border-0 px-3 py-1`}>
                      {restaurant.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        className="w-8 h-8 bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => handleEdit(restaurant)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="w-8 h-8 bg-amber-500 hover:bg-amber-600"
                        onClick={() => handleView(restaurant)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="w-8 h-8 bg-red-500 hover:bg-red-600"
                        onClick={() => handleDelete(restaurant)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 bg-white"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            className={`w-10 h-10 ${currentPage === 1 ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            onClick={() => setCurrentPage(1)}
          >
            1
          </Button>

          <Button
            className={`w-10 h-10 ${currentPage === 2 ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            onClick={() => setCurrentPage(2)}
          >
            2
          </Button>

          <Button
            className={`w-10 h-10 ${currentPage === 3 ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            onClick={() => setCurrentPage(3)}
          >
            3
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 bg-white"
            onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
            disabled={currentPage === 3}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantList;