"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmationDialog from '../../../components/users/ConfirmationDialog';
import Pagination from '../../../components/users/Pagination';
import { eventActivities, ticketActivities } from '../../../components/users/userData';
import UserDetailsModal from '../../../components/users/UserDetailsModal';
import UserTable from '../../../components/users/UserTable';
import { User } from '../../../components/users/userType';
import { useGetAllUserQuery } from '../../../features/users/usersApi';
import { mapApiUserToFrontend } from '../../../../utils/userDataMapper';


export default function MainlandUserList() {
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const { data, isLoading, isError } = useGetAllUserQuery({});

  useEffect(() => {
    if (data?.data) {
      const mappedUsers = data.data.map((apiUser: any) => 
        mapApiUserToFrontend(apiUser)
      );
      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
    }
  }, [data]);

  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter((user) => {
        const matchesRole = selectedRole === "All" || 
          (selectedRole === "Organizer" && user.role === "Organizer") ||
          (selectedRole === "Attendee" && user.role === "Attendee");
        
        const matchesSearch = 
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesRole && matchesSearch;
      });
      setFilteredUsers(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [selectedRole, searchQuery, users]);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleBlockUser = (user: User) => {
    setSelectedUser(user);
    setShowBlockDialog(true);
  };

  const handleReport = () => {
    setShowReportDialog(false);
    console.log("User reported:", selectedUser?.name);
    // Add report logic here
  };

  const handleBlock = () => {
    setShowBlockDialog(false);
    console.log("User blocked:", selectedUser?.name);
    // Add block logic here
  };

  // Paginate users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600">Error loading users. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User List</h1>

        <div className="flex items-center gap-3">
          {/* Date Picker with shadcn Calendar */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-auto h-10 justify-start text-left font-normal border-gray-300"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Role Filter */}
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[140px] h-10 border-gray-300">
              <SelectValue placeholder="Role: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Role: All</SelectItem>
              <SelectItem value="Organizer">Organizer</SelectItem>
              <SelectItem value="Attendee">Attendee</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <UserTable
            users={paginatedUsers}
            onViewUser={handleViewUser}
            onBlockUser={handleBlockUser}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            totalItems={filteredUsers.length}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReport={() => setShowReportDialog(true)}
        ticketActivities={ticketActivities}
        eventActivities={eventActivities}
      />

      {/* Report Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showReportDialog}
        onOpenChange={setShowReportDialog}
        title="Report!"
        message="Are You Sure To Report The User ?"
        onConfirm={handleReport}
        type="report"
      />

      {/* Block Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        title="Block!"
        message="Are You Sure You Want to Block This User ?"
        onConfirm={handleBlock}
        type="block"
      />
    </div>
  );
}