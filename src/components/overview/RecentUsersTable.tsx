"use client";

import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

function RecentUsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  console.log(currentPage)
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const users = [
    {
      id: "01",
      accountNumber: "201021",
      name: "Bashar Islam",
      role: "Attendee",
      email: "bashar@gmail.com",
      dob: "12-12-200",
      phone: "0923847232",
      location: "London",
      joinDate: "11 Oct 24, 11:30PM",
    },
    {
      id: "01",
      accountNumber: "201021",
      name: "Bashar Islam",
      role: "Attendee",
      email: "bashar@gmail.com",
      dob: "12-12-200",
      phone: "0923847232",
      location: "London",
      joinDate: "11 Oct 24, 11:30PM",
    },
    {
      id: "01",
      accountNumber: "201021",
      name: "Bashar Islam",
      role: "Attendee",
      email: "bashar@gmail.com",
      dob: "12-12-200",
      phone: "0923847232",
      location: "London",
      joinDate: "11 Oct 24, 11:30PM",
    },
  ];

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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  Account Number
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
              {users.map((user, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-50 border-b h-14 border-gray-100 last:border-0"
                >
                  <TableCell className="text-sm text-gray-600">{user.id}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.accountNumber}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900 font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{user.role}</TableCell>
                  <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                  <TableCell className="text-sm text-gray-600">{user.dob}</TableCell>
                  <TableCell className="text-sm text-gray-600">{user.phone}</TableCell>
                  <TableCell className="text-sm text-gray-600">{user.location}</TableCell>
                  <TableCell className="text-sm text-gray-600">{user.joinDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-5 px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select value={String(rowsPerPage)} onValueChange={(v) => setRowsPerPage(Number(v))}>
              <SelectTrigger className="w-auto h-8 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">1-3 of 100</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => p + 1)}
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