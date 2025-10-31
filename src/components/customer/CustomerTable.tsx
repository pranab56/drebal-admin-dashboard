"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Pagination from './Pagination';
import SearchAndFilter from './SearchAndFilter';
import { Customer } from './types';

interface CustomerTableProps {
  customers: Customer[];
  selectedCustomers: string[];
  setSelectedCustomers: (customers: string[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  onEdit: (customer: Customer) => void;
  onView: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

const CustomerTable = ({
  customers,
  selectedCustomers,
  setSelectedCustomers,
  currentPage,
  setCurrentPage,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  onEdit,
  onView,
  onDelete,
}: CustomerTableProps) => {
  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white';
      case 'Inactive':
        return 'bg-amber-500 hover:bg-amber-600 text-white';
      case 'Suspended':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, id]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(cId => cId !== id));
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || customer.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Customer List</h2>
          <SearchAndFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4">
                  <Checkbox
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Id</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Phone</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Order</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                    />
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{customer.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{customer.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{customer.email}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{customer.phone}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{customer.order}</td>
                  <td className="py-4 px-4">
                    <Badge className={`${getStatusColor(customer.status)} border-0 px-3 py-1`}>
                      {customer.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        className="w-8 h-8 bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => onEdit(customer)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="w-8 h-8 bg-amber-500 hover:bg-amber-600"
                        onClick={() => onView(customer)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="w-8 h-8 bg-red-500 hover:bg-red-600"
                        onClick={() => onDelete(customer)}
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

        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </CardContent>
    </Card>
  );
};

export default CustomerTable;