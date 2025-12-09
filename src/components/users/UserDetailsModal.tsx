import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { EventActivity, TicketActivity, User } from './userType';

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onReport: () => void;
  ticketActivities: TicketActivity[];
  eventActivities: EventActivity[];
}

export default function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onReport,
  ticketActivities,
  eventActivities,
}: UserDetailsModalProps) {
  const getPaymentBadgeColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
      case "Refunded":
        return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
    }
  };

  const getAttendedBadgeColor = (status: string) => {
    switch (status) {
      case "Attended":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
      case "Missed":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
      case "Upcoming":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
    }
  };

  if (!user) return null;

  const handleCount = () => {
    const reponse = ticketActivities.filter((ticketActivity) => {
      return ticketActivity.user_id === user.id
    })
    const reponse2 = eventActivities.filter((eventActivity) => {
      return eventActivity.user_id === user.id
    })
    return reponse.length + reponse2.length
  }

  const handleTicketCount = () => {
    const reponse = ticketActivities.filter((ticketActivity) => {
      return ticketActivity.user_id === user.id
    })
  }



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {user.role === "Attendee" ? (
          <>
            {/* Attendee Profile Header */}
            <div className=" p-8 rounded-t-lg">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="inline-block px-6 py-1 bg-green-500 text-white rounded-full text-sm font-semibold shadow-md">
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
                  <p className="text-sm font-semibold text-gray-900">{user.accountNumber || "201021"}</p>
                </div>
                <div className="border-r border-gray-200 last:border-r-0">
                  <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                  <p className="text-sm font-semibold text-gray-900">{user.dob || "12-12-2009"}</p>
                </div>
                <div className="border-r border-gray-200 last:border-r-0">
                  <p className="text-xs text-gray-500 mb-1">Join Date</p>
                  <p className="text-sm font-semibold text-gray-900">{user.joinDate || "11 Oct 24, 11.10 PM"}</p>
                </div>
                <div className="border-r border-gray-200 last:border-r-0">
                  <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-900">{user.phone || "0923532122"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{user.location || "London"}</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex justify-center gap-10">
                <div className=" w-full bg-[#E6F4EA] rounded-lg">
                  <div className="flex items-center justify-center mb-4 py-5 text-center">

                    <div>
                      <p className="text-gray-700 text-sm mb-1">Total Tickets Sold</p>
                      <p className="text-4xl font-bold text-gray-900">45</p>
                    </div>
                  </div>
                </div>

                <div className='bg-[#E6F4EA] w-full rounded-lg'>
                  <div className="flex items-center justify-center text-center  py-5 mb-4 w-full ">
                    <div>
                      <p className="text-gray-700 text-sm mb-1">Total Tickets Purchased</p>
                      <p className="text-4xl font-bold text-gray-900">112</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </>
        ) : (
          // Non-Attendee view (Organizer view)
          <div className="flex flex-col h-full">
            {/* User Info Header */}
            <div className="flex items-start gap-6 pb-6 border-b flex-shrink-0 p-8">


              <div className="w-full max-w-3xl">
                <div className="grid grid-cols-3 gap-6">
                  {/* Left Column - Profile */}
                  <div className="col-span-1">
                    <div className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center h-full ">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-2">James Don</h2>
                      <span className="inline-block px-4 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                        Organizer
                      </span>
                    </div>
                  </div>

                  {/* Right Column - Stats Grid */}
                  <div className="col-span-2 grid grid-cols-2 gap-6">
                    {/* Total Events */}
                    <div className="bg-green-50 rounded-3xl  p-6 flex flex-col items-center justify-center">
                      <p className="text-gray-600 text-sm mb-2">Total Events</p>
                      <p className="text-4xl font-bold text-gray-900">45</p>
                    </div>

                    {/* Active Events */}
                    <div className="bg-green-50 rounded-lg p-6 flex flex-col items-center justify-center">
                      <p className="text-gray-600 text-sm mb-2">Active Events</p>
                      <p className="text-4xl font-bold text-gray-900">$4125.50</p>
                    </div>

                    {/* Total Tickets Sold */}
                    <div className="bg-green-50 rounded-lg p-6 flex flex-col items-center justify-center">
                      <p className="text-gray-600 text-sm mb-2">Total Tickets Sold</p>
                      <p className="text-4xl font-bold text-gray-900">4511</p>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-green-50 rounded-lg p-6 flex flex-col items-center justify-center">
                      <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
                      <p className="text-4xl font-bold text-gray-900">$11112</p>
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
                      {eventActivities.map((activity, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="text-sm text-gray-900">{activity.eventName}</TableCell>
                          <TableCell className="text-sm text-gray-600">{activity.venue}</TableCell>
                          <TableCell className="text-sm text-gray-600">{activity.ticketSold}</TableCell>
                          <TableCell className="text-sm text-gray-600">{activity.saleDate}</TableCell>
                          <TableCell className="text-sm text-gray-900 font-medium">{activity.amount}</TableCell>
                        </TableRow>
                      ))}
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
                <span className="text-sm text-gray-600">1-3 of 100</span>
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