import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import { EventActivity, TicketActivity, User } from './userType';

// Define interface for live event data
interface LiveEvent {
  eventName: string;
  eventCode: string;
  organizerName: string;
  ticketSaleStart: string;
  outstandingUnits: number;
}

// Define interface for single user data
interface SingleUserData {
  totalEvent?: number;
  activeEvents?: number;
  totalSold?: number;
  totalRevenue?: number;
  totalTicketSold?: number;
  purchaseQuantity?: number;
  allLiveEvent?: LiveEvent[];
  user?: {
    name?: string;
    email?: string;
    image?: string;
    personalInfo?: Record<string, unknown>;
    address?: Record<string, unknown>;
  };
}

interface UserDetailsModalProps {
  user: User | null;
  singleUserData?: SingleUserData;
  isOpen: boolean;
  onClose: () => void;
  onReport?: () => void;
  ticketActivities?: TicketActivity[];
  eventActivities?: EventActivity[];
  isLoading?: boolean;
}

export default function UserDetailsModal({
  user,
  singleUserData,
  isOpen,
  onClose,
  eventActivities = [],
  isLoading = false,
}: UserDetailsModalProps) {
  if (!user) return null;

  // Determine if user is attendee based on role
  const isAttendee = user.role === 'Attendee' || user.role === 'USER';
  const isOrganizer = user.role === 'Organizer' || user.role === 'ORGANIZER';

  // Use singleUserData for organizer stats if available
  const organizerStats = isOrganizer ? singleUserData : null;
  const attendeeStats = isAttendee ? singleUserData : null;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogTitle className="sr-only">Loading User Details</DialogTitle>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading user details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogTitle className="sr-only">
          {user.name} - {user.role} Details
        </DialogTitle>

        {isAttendee ? (
          <>
            {/* Attendee Profile Header */}
            <div className="p-8 rounded-t-lg">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                    <Image
                      src={user.avatar || "/default-avatar.png"}
                      alt={user.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                      priority
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="inline-block px-6 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold shadow-md">
                      {user.role}
                    </span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                <p className="text-gray-600 text-lg">{user.email}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
              {/* Info Grid */}
              <div className="grid grid-cols-5 gap-4 mb-8 text-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="border-r border-gray-200 last:border-r-0">
                  <p className="text-xs text-gray-500 mb-1">Account Number</p>
                  <p className="text-sm font-semibold text-gray-900">{user.accountNumber || "N/A"}</p>
                </div>
                <div className="border-r border-gray-200 last:border-r-0">
                  <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                  <p className="text-sm font-semibold text-gray-900">{user.dob || "N/A"}</p>
                </div>
                <div className="border-r border-gray-200 last:border-r-0">
                  <p className="text-xs text-gray-500 mb-1">Join Date</p>
                  <p className="text-sm font-semibold text-gray-900">{user.joinDate || "N/A"}</p>
                </div>
                <div className="border-r border-gray-200 last:border-r-0">
                  <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-900">{user.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{user.location || "N/A"}</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex justify-center gap-10">
                <div className="w-full bg-[#E6F4EA] rounded-lg">
                  <div className="flex items-center justify-center mb-4 py-5 text-center">
                    <div>
                      <p className="text-gray-700 text-sm mb-1">Total Tickets Purchased</p>
                      <p className="text-4xl font-bold text-gray-900">{attendeeStats?.totalTicketSold || user.totalTicketsPurchased || 0}</p>
                    </div>
                  </div>
                </div>

                <div className='bg-[#E6F4EA] w-full rounded-lg'>
                  <div className="flex items-center justify-center text-center py-5 mb-4 w-full">
                    <div>
                      <p className="text-gray-700 text-sm mb-1">Total Spend</p>
                      <p className="text-4xl font-bold text-gray-900">{attendeeStats?.purchaseQuantity ? `$${attendeeStats.purchaseQuantity}` : user.totalSpend || "$0"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Events for Attendee (if any) */}
              {attendeeStats?.allLiveEvent && attendeeStats.allLiveEvent.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Live Events</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-green-50 hover:bg-green-50">
                          <TableHead className="font-semibold text-gray-700 text-xs">Event Name</TableHead>
                          <TableHead className="font-semibold text-gray-700 text-xs">Event Code</TableHead>
                          <TableHead className="font-semibold text-gray-700 text-xs">Organizer</TableHead>
                          <TableHead className="font-semibold text-gray-700 text-xs">Ticket Sale Start</TableHead>
                          <TableHead className="font-semibold text-gray-700 text-xs">Outstanding Units</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendeeStats.allLiveEvent.map((event: LiveEvent, index: number) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="text-sm text-gray-900">{event.eventName}</TableCell>
                            <TableCell className="text-sm text-gray-600">{event.eventCode}</TableCell>
                            <TableCell className="text-sm text-gray-600">{event.organizerName}</TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {new Date(event.ticketSaleStart).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">{event.outstandingUnits}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // Organizer view
          <div className="flex flex-col h-full">
            {/* User Info Header */}
            <div className="flex items-start gap-6 pb-6 border-b flex-shrink-0 p-8">
              <div className="w-full max-w-3xl">
                <div className="grid grid-cols-3 gap-6">
                  {/* Left Column - Profile */}
                  <div className="col-span-1">
                    <div className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center h-full">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md relative">
                        <Image
                          src={user.avatar || "/default-avatar.png"}
                          alt="Profile"
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-2">{user.name}</h2>
                      <span className="inline-block px-4 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Right Column - Stats Grid */}
                  <div className="col-span-2 grid grid-cols-2 gap-6">
                    {/* Total Events */}
                    <div className="bg-green-50 rounded-3xl p-6 flex flex-col items-center justify-center">
                      <p className="text-gray-600 text-sm mb-2">Total Events</p>
                      <p className="text-4xl font-bold text-gray-900">{organizerStats?.totalEvent || user.totalEvents || 0}</p>
                    </div>

                    {/* Active Events */}
                    <div className="bg-green-50 rounded-lg p-6 flex flex-col items-center justify-center">
                      <p className="text-gray-600 text-sm mb-2">Active Events</p>
                      <p className="text-4xl font-bold text-gray-900">{organizerStats?.activeEvents || user.activeEvents || 0}</p>
                    </div>

                    {/* Total Tickets Sold */}
                    <div className="bg-green-50 rounded-lg p-6 flex flex-col items-center justify-center">
                      <p className="text-gray-600 text-sm mb-2">Total Tickets Sold</p>
                      <p className="text-4xl font-bold text-gray-900">{organizerStats?.totalSold || user.totalSold || 0}</p>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-green-50 rounded-lg p-6 flex flex-col items-center justify-center">
                      <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
                      <p className="text-4xl font-bold text-gray-900">{organizerStats?.totalRevenue ? `$${organizerStats.totalRevenue}` : user.totalRevenue || "$0"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Section for Organizers */}
            <div className="mt-6 flex-1 overflow-hidden flex flex-col min-h-0 p-8 pt-0">
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap flex-shrink-0 mt-6">
                <h3 className="text-lg font-bold text-gray-900">Event Activity</h3>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by Event and ID..."
                      className="w-full h-9 pl-10 pr-4 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Live Events Table */}
              <div className="border rounded-lg overflow-hidden flex-1 min-h-0 mb-6">
                <div className="overflow-auto max-h-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50 hover:bg-green-50">
                        <TableHead className="font-semibold text-gray-700 text-xs">Event Name</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">Event Code</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">Organizer</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">Ticket Sale Start</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">Outstanding Units</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {organizerStats?.allLiveEvent && organizerStats.allLiveEvent.length > 0 ? (
                        organizerStats.allLiveEvent.map((event: LiveEvent, index: number) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="text-sm text-gray-900">{event.eventName}</TableCell>
                            <TableCell className="text-sm text-gray-600">{event.eventCode}</TableCell>
                            <TableCell className="text-sm text-gray-600">{event.organizerName}</TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {new Date(event.ticketSaleStart).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">{event.outstandingUnits}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No live events found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Activity Table */}
              <div className="border rounded-lg overflow-hidden flex-1 min-h-0">
                <div className="overflow-auto max-h-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50 hover:bg-green-50">
                        <TableHead className="font-semibold text-gray-700 text-xs">Event Name</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">Venue</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">Ticket Sold</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">Sale Date</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventActivities.length > 0 ? (
                        eventActivities.map((activity, index) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="text-sm text-gray-900">{activity.eventName}</TableCell>
                            <TableCell className="text-sm text-gray-600">{activity.venue}</TableCell>
                            <TableCell className="text-sm text-gray-600">{activity.ticketSold}</TableCell>
                            <TableCell className="text-sm text-gray-600">{activity.saleDate}</TableCell>
                            <TableCell className="text-sm text-gray-900 font-medium">{activity.amount}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No event activities found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center mt-4 gap-4 flex-shrink-0 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <Select defaultValue="3">
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
                <span className="text-sm text-gray-600">1-3 of {eventActivities.length}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}