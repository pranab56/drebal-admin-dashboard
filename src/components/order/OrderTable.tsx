"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Filter } from 'lucide-react';
import { Order } from './types';
import Pagination from './Pagination';

interface OrderTableProps {
  orders: Order[];
  selectedOrders: string[];
  setSelectedOrders: (orders: string[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const OrderTable = ({ 
  orders, 
  selectedOrders, 
  setSelectedOrders, 
  currentPage, 
  setCurrentPage 
}: OrderTableProps) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'text-emerald-600 bg-emerald-50';
      case 'Pending':
        return 'text-blue-600 bg-blue-50';
      case 'Canceled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="bg-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4">
                  <Checkbox
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Order Id</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Items</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                    />
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                        {order.avatar}
                      </div>
                      <span className="text-sm text-gray-900">{order.customer}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{order.items}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{order.amount}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{order.date}</td>
                  <td className="py-4 px-4">
                    <Badge className={`${getStatusColor(order.status)} border-0 font-normal`}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-6">
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </CardContent>
    </Card>
  );
};

export default OrderTable;