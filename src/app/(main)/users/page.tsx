"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ConfirmationDialog from '../../../components/users/ConfirmationDialog';
import Pagination from '../../../components/users/Pagination';
import UserDetailsModal from '../../../components/users/UserDetailsModal';
import UserTable from '../../../components/users/UserTable';
import { ApiUser, User, UserRole } from '../../../components/users/userType';
import { useBlockAndUnBlockMutation, useGetAllUserQuery, useGetSingleUserQuery } from '../../../features/users/usersApi';

// Types for mock data
interface TicketActivity {
  eventName: string;
  category: string;
  ticketId: string;
  quantity: number;
  purchaseDate: string;
  payment: 'Paid' | 'Pending';
  eventDate: string;
  attended: 'Upcoming' | 'Attended' | 'Cancelled';
}

interface EventActivity {
  eventName: string;
  venue: string;
  ticketSold: string;
  saleDate: string;
  amount: string;
}

// Mock data for activity (you'll need to replace this with real API data)
const mockTicketActivities: TicketActivity[] = [
  {
    eventName: "Summer Music Festival",
    category: "Music",
    ticketId: "TKT-12345",
    quantity: 2,
    purchaseDate: "2024-10-15",
    payment: 'Paid',
    eventDate: "2024-12-20",
    attended: 'Upcoming',
  },
];

const mockEventActivities: EventActivity[] = [
  {
    eventName: "Tech Conference 2024",
    venue: "Convention Center",
    ticketSold: "450",
    saleDate: "2024-10-01",
    amount: "$22,500",
  },
];

export default function MainlandUserList() {
  const [selectedRole, setSelectedRole] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  console.log(showReportDialog);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [singleUserDetails, setSingleUserDetails] = useState<ApiUser | null>(null);
  console.log(singleUserDetails);

  // Get all users with refetch option
  const {
    data: allUsersData,
    isLoading,
    isError,
    refetch
  } = useGetAllUserQuery(searchQuery || undefined);

  // Get single user details when selected
  const {
    data: singleUserData,
    isLoading: singleUserLoading,
    refetch: refetchSingleUser
  } = useGetSingleUserQuery(
    selectedUser?._id,
    { skip: !selectedUser?._id }
  );

  const [blockAndUnBlock, { isLoading: blockAndUnBlockLoading }] = useBlockAndUnBlockMutation();

  // Function to map API user data to User type
  const mapApiUserToUserType = useCallback((apiUser: ApiUser, additionalData?: ApiUser): User => {
    // Generate a simple account number from ID
    const accountNumber = `ACC-${apiUser._id.substring(0, 8).toUpperCase()}`;

    // Format role for display
    const displayRole: UserRole = apiUser.role === 'ORGANIZER' ? 'Organizer' :
      apiUser.role === 'USER' ? 'Attendee' :
        apiUser.role as UserRole;

    // Format date of birth
    const dob = apiUser.personalInfo?.dateOfBirth
      ? new Date(apiUser.personalInfo.dateOfBirth).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      : 'N/A';

    // Format join date
    const joinDate = new Date(apiUser.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Get location from address
    const location = apiUser.address?.city && apiUser.address?.country
      ? `${apiUser.address.city}, ${apiUser.address.country}`
      : apiUser.address?.city || apiUser.address?.country || 'N/A';

    // Get phone number
    const phone = apiUser.personalInfo?.phone || 'N/A';

    // Default avatar
    const avatar = "https://i.ibb.co/z5YHLV9/profile.png";

    // Get status from API - ensure proper casing
    const status = apiUser.status === 'Blocked' ? 'Blocked' :
      apiUser.status === 'blocked' ? 'Blocked' :
        apiUser.status === 'Active' ? 'Active' :
          apiUser.status === 'active' ? 'Active' : 'Active';

    return {
      _id: apiUser._id,
      accountNumber,
      name: apiUser.name,
      role: displayRole,
      email: apiUser.email,
      dob,
      phone,
      location,
      joinDate,
      avatar,
      status,
      verified: false,
      personalInfo: apiUser.personalInfo,
      address: apiUser.address,
      // Add organizer stats if available in additional data
      totalEvents: additionalData?.totalEvent,
      activeEvents: additionalData?.activeEvents,
      totalTicketsSoldOrg: additionalData?.totalSold,
      totalRevenue: additionalData?.totalRevenue ? `$${additionalData.totalRevenue}` : "$0",
      totalSold: additionalData?.totalSold,
      // Add attendee stats if available in additional data
      totalTicketsPurchased: additionalData?.totalTicketSold,
      totalSpend: additionalData?.purchaseQuantity ? `$${additionalData.purchaseQuantity}` : "$0"
    };
  }, []);

  // Load initial user list - runs only when allUsersData changes
  useEffect(() => {
    if (allUsersData?.success && allUsersData.data) {
      const apiUsers = Array.isArray(allUsersData.data) ? allUsersData.data : [allUsersData.data];

      // Map API data to User type without additional data
      const mappedUsers = apiUsers.map((user: ApiUser) => mapApiUserToUserType(user));

      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
    }
  }, [allUsersData, mapApiUserToUserType]);

  // Update single user details when fetched
  useEffect(() => {
    if (singleUserData?.success && singleUserData.data) {
      const userData = singleUserData.data as ApiUser;
      setSingleUserDetails(userData);

      // Update the selected user with additional details
      if (selectedUser) {
        const updatedUser: User = {
          ...selectedUser,
          // Update organizer stats
          totalEvents: userData.totalEvent,
          activeEvents: userData.activeEvents,
          totalTicketsSoldOrg: userData.totalSold,
          totalRevenue: userData.totalRevenue ? `$${userData.totalRevenue}` : "$0",
          totalSold: userData.totalSold,
          // Update attendee stats
          totalTicketsPurchased: userData.totalTicketSold,
          totalSpend: userData.purchaseQuantity ? `$${userData.purchaseQuantity}` : "$0",
          // Update user info from nested structure
          ...(userData.user && {
            ...userData.user,
            name: userData.user.name || selectedUser.name,
            email: userData.user.email || selectedUser.email,
            avatar: userData.user.image || selectedUser.avatar,
            personalInfo: {
              ...selectedUser.personalInfo,
              ...userData.user.personalInfo
            },
            address: {
              ...selectedUser.address,
              ...userData.user.address
            }
          })
        };
        setSelectedUser(updatedUser);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleUserData]); // selectedUser is intentionally excluded as it's managed separately

  // Filter users
  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter((user) => {
        const matchesRole = selectedRole === "All" ||
          (selectedRole === "Organizer" && user.role === "Organizer") ||
          (selectedRole === "Attendee" && user.role === "Attendee");

        const matchesSearch =
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesRole && matchesSearch;
      });
      setFilteredUsers(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [selectedRole, searchQuery, users]);

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    // The single user query will automatically fetch when selectedUser._id is set
  };

  const handleBlockUser = (user: User) => {
    setSelectedUser(user);
    setShowBlockDialog(true);
  };

  const handleConfirmBlock = async () => {
    if (!selectedUser) return;

    try {
      const response = await blockAndUnBlock(selectedUser._id).unwrap();
      console.log("block and unblock response", response);

      // Check if the response contains the updated user data
      if (response.success && response.data) {
        // If API returns the updated user, update the specific user
        const updatedUser = mapApiUserToUserType(response.data as ApiUser);

        // Update the specific user in the users array
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === selectedUser._id ? updatedUser : user
          )
        );

        // Also update selectedUser if it's the same user
        if (selectedUser._id === updatedUser._id) {
          setSelectedUser(updatedUser);
        }
      } else {
        // If API doesn't return the updated user, refetch all users
        refetch();

        // Also refetch single user if modal is open
        if (isModalOpen && selectedUser?._id) {
          refetchSingleUser();
        }
      }

      setShowBlockDialog(false);
      console.log("User blocked/unblocked successfully");
    } catch (error) {
      console.error("Failed to block user:", error);
    }
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
          {/* Role Filter */}
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[140px] py-[19px] border-gray-300">
              <SelectValue placeholder="Role: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Role: All</SelectItem>
              <SelectItem value="Organizer">Organizer</SelectItem>
              <SelectItem value="Attendee">Attendee</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
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
        singleUserData={singleUserData?.data as ApiUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
          setSingleUserDetails(null);
        }}
        onReport={() => setShowReportDialog(true)}
        ticketActivities={mockTicketActivities}
        eventActivities={mockEventActivities}
        isLoading={singleUserLoading}
      />

      {/* Block Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        title="Block User!"
        message={`Are You Sure You Want to ${selectedUser?.status === 'Active' ? 'Block' : 'Unblock'} ${selectedUser?.name}?`}
        onConfirm={handleConfirmBlock}
        confirmText={selectedUser?.status === 'Active' ? 'Yes, Block' : 'Yes, Unblock'}
        type="block"
        isLoading={blockAndUnBlockLoading}
      />
    </div>
  );
}