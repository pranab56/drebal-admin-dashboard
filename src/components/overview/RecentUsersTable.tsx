"use client";

import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { useGetAllUserQuery } from '../../features/users/usersApi';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

// Define user interface
interface User {
  _id: string;
  name?: string;
  email: string;
  role: string;
  createdAt: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    phone?: string;
  };
  address?: {
    city?: string;
    country?: string;
  };
}

// Define API meta interface
interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// Define API response interface
interface ApiResponse {
  data: User[];
  meta: ApiMeta;
  message?: string;
  success?: boolean;
}

function RecentUsersTable() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10); // Default to 10 to match API limit

  console.log(searchQuery);

  const { data, isLoading } = useGetAllUserQuery(searchQuery);

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Format date with time
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(',', '');
  };

  // Calculate serial number based on page and index
  const calculateSerialNumber = (index: number): number => {
    return (currentPage - 1) * rowsPerPage + index + 1;
  };

  if (isLoading) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Users
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-600">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  const apiData = data as ApiResponse | undefined;
  const users = apiData?.data || [];
  const meta = apiData?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };
  const startItem = (meta.page - 1) * meta.limit + 1;
  const endItem = Math.min(meta.page * meta.limit, meta.total);

  return (
    <Card className="border border-gray-200 shadow-sm ">
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Users
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full h-9 pl-10 pr-4 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="overflow-x-auto">
          <Table className=''>
            <TableHeader className='h-14'>
              <TableRow className="bg-green-50 hover:bg-green-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700 text-xs">#SL</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs">
                  User ID
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs">Name</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs">Role</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs">Email</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs">
                  Date of Birth
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs">
                  Phone Number
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs">
                  Location
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs">
                  Join Date, Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: User, index: number) => (
                  <TableRow
                    key={user._id}
                    className="hover:bg-gray-50 border-b h-14 border-gray-100 last:border-0"
                  >
                    <TableCell className="text-sm text-gray-600">
                      {calculateSerialNumber(index)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user._id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 font-medium">
                      {user.name || `${user.personalInfo?.firstName || ''} ${user.personalInfo?.lastName || ''}`.trim() || 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'ORGANIZER'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                        }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user.personalInfo?.dateOfBirth
                        ? formatDate(user.personalInfo.dateOfBirth)
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user.personalInfo?.phone || 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user.address?.city || user.address?.country || 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDateTime(user.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-5 px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(v) => {
                setRowsPerPage(Number(v));
                setCurrentPage(1); // Reset to first page when changing rows per page
              }}
            >
              <SelectTrigger className="w-auto h-8 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {meta.total === 0 ? '0 results' : `${startItem}-${endItem} of ${meta.total}`}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= meta.totalPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentUsersTable;