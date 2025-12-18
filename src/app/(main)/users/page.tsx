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
import { useCallback, useEffect, useRef, useState } from "react"; // Added useRef
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

// Mock data for activity
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
  console.log(showReportDialog)
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [modalUserData, setModalUserData] = useState<User | null>(null); // Separate state for modal

  const isUpdatingRef = useRef(false); // Ref to prevent infinite updates

  // Get all users
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
  } = useGetSingleUserQuery(
    selectedUser?._id,
    { skip: !selectedUser?._id || !isModalOpen } // Only fetch when modal is open
  );

  const [blockAndUnBlock, { isLoading: blockAndUnBlockLoading }] = useBlockAndUnBlockMutation();

  // Function to map API user data to User type
  const mapApiUserToUserType = useCallback((apiUser: ApiUser): User => {
    // Generate a simple account number from ID
    const accountNumber = `ACC-${apiUser._id.substring(0, 8).toUpperCase()}`;

    // Always use consistent role names - 'Organizer' or 'Attendee'
    const displayRole: UserRole = apiUser.role === 'ORGANIZER' ? 'Organizer' : 'Attendee';

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

    // Get status from API
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
      // Initialize stats as 0
      totalEvents: 0,
      activeEvents: 0,
      totalTicketsSoldOrg: 0,
      totalRevenue: "$0",
      totalSold: 0,
      totalTicketsPurchased: 0,
      totalSpend: "$0"
    };
  }, []);

  // Load initial user list
  useEffect(() => {
    if (allUsersData?.success && allUsersData.data) {
      const apiUsers = Array.isArray(allUsersData.data) ? allUsersData.data : [allUsersData.data];

      const mappedUsers = apiUsers.map((user: ApiUser) => mapApiUserToUserType(user));

      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
    }
  }, [allUsersData, mapApiUserToUserType]);

  // Update modal user data when single user data is fetched - FIXED to prevent infinite loop
  useEffect(() => {
    if (isUpdatingRef.current || !singleUserData?.success || !singleUserData.data || !selectedUser) {
      return;
    }

    const singleData = singleUserData.data;

    // Prevent infinite update loop
    isUpdatingRef.current = true;

    // Create updated user data for modal
    const updatedUser: User = {
      ...selectedUser,
      // Update stats from single user data
      totalEvents: singleData.totalEvent || selectedUser.totalEvents || 0,
      activeEvents: singleData.activeEvents || selectedUser.activeEvents || 0,
      totalTicketsSoldOrg: singleData.totalSold || selectedUser.totalTicketsSoldOrg || 0,
      totalRevenue: singleData.totalRevenue ? `$${singleData.totalRevenue}` : selectedUser.totalRevenue || "$0",
      totalSold: singleData.totalSold || selectedUser.totalSold || 0,
      totalTicketsPurchased: singleData.totalTicketSold || selectedUser.totalTicketsPurchased || 0,
      totalSpend: singleData.purchaseQuantity ? `$${singleData.purchaseQuantity}` : selectedUser.totalSpend || "$0"
    };

    setModalUserData(updatedUser);

    // Reset ref after a delay
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);

  }, [singleUserData, selectedUser]);

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
      setCurrentPage(1);
    }
  }, [selectedRole, searchQuery, users]);

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setModalUserData(user); // Initialize modal data with basic user info
    setIsModalOpen(true);
  };

  const handleBlockUser = (user: User) => {
    setSelectedUser(user);
    setShowBlockDialog(true);
  };

  const handleConfirmBlock = async () => {
    if (!selectedUser) return;

    try {
      const response = await blockAndUnBlock(selectedUser._id).unwrap();

      if (response.success && response.data) {
        // Update the specific user in the users array
        const updatedUser = mapApiUserToUserType(response.data as ApiUser);

        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === selectedUser._id ? updatedUser : user
          )
        );

        // Update selectedUser if it's the same
        if (selectedUser._id === updatedUser._id) {
          setSelectedUser(updatedUser);
        }

        // Update modalUserData if modal is open
        if (isModalOpen && selectedUser._id === updatedUser._id) {
          setModalUserData(updatedUser);
        }
      } else {
        refetch();
      }

      setShowBlockDialog(false);
    } catch (error) {
      console.error("Failed to block user:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setModalUserData(null);
    isUpdatingRef.current = false;
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

      {/* User Details Modal - Use modalUserData instead of selectedUser */}
      <UserDetailsModal
        user={modalUserData || selectedUser} // Fallback to selectedUser if modalUserData is null
        singleUserData={singleUserData?.data}
        isOpen={isModalOpen}
        onClose={handleModalClose}
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