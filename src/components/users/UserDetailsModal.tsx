import { Badge } from "@/components/ui/badge";
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
import Image from 'next/image';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* User Info Header */}
        <div className="flex items-start gap-6 pb-6 border-b flex-shrink-0">
          <Image
            width={100}
            height={100}
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-gray-100"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-green-600 font-medium mt-1">{user.role}</p>
          </div>
        </div>

        {/* Stats Cards */}
        {user.role === "Attendee" ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 flex-shrink-0">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Tickets Sold</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.totalTicketsSold}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Spend</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.totalSpend}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Earn</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.totalEarn}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Tickets Purchased</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.totalTicketsPurchased}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 flex-shrink-0">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.totalEvents}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.activeEvents}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Tickets Sold</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.totalTicketsSoldOrg}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.totalRevenue}
              </p>
            </div>
          </div>
        )}

        {/* Activity Section */}
        <div className="mt-6 flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-900">
              {user.role === "Attendee" ? "Ticket Activity" : "Event Activity"}
            </h3>
            <div className="flex items-center gap-2">
              {user.role === "Attendee" && (
                <>
                  <Select defaultValue="All">
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Payment Status</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="All">
                    <SelectTrigger className="w-[120px] h-9">
                      <SelectValue placeholder="Attendance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Attendance</SelectItem>
                      <SelectItem value="Attended">Attended</SelectItem>
                      <SelectItem value="Missed">Missed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="All">
                    <SelectTrigger className="w-[110px] h-9">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Category</SelectItem>
                      <SelectItem value="Concert">Concert</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    user.role === "Attendee"
                      ? "Search by Event and ID..."
                      : "Search by Event and ID..."
                  }
                  className="w-full h-9 pl-10 pr-4 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-0 focus:ring-green-500"
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
                    {user.role === "Attendee" ? (
                      <>
                        <TableHead className="font-semibold text-gray-700 text-xs">
                          Event Name
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">
                          Category
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">
                          Ticket ID
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">
                          Quantity
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">
                          Purchase Date
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">
                          Payment
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">
                          Event Date
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">
                          Attended
                        </TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead className="font-semibold text-gray-700 text-xs">
                          Event Name
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">
                          Venue
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">
                          Ticket Sold
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">
                          Sale Date
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-xs">
                          Amount
                        </TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.role === "Attendee"
                    ? ticketActivities.map((activity, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="text-sm text-gray-900">
                          {activity.eventName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {activity.category}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {activity.ticketId}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {activity.quantity}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {activity.purchaseDate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getPaymentBadgeColor(
                              activity.payment
                            )} text-xs px-3 py-1 border font-normal`}
                          >
                            {activity.payment}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {activity.eventDate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getAttendedBadgeColor(
                              activity.attended
                            )} text-xs px-3 py-1 border font-normal`}
                          >
                            {activity.attended}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                    : eventActivities.map((activity, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="text-sm text-gray-900">
                          {activity.eventName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {activity.venue}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {activity.ticketSold}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {activity.saleDate}
                        </TableCell>
                        <TableCell className="text-sm text-gray-900 font-medium">
                          {activity.amount}
                        </TableCell>
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

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t flex-shrink-0">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white px-8 h-11"
            onClick={onClose}
          >
            Back
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white px-8 h-11"
            onClick={onReport}
          >
            Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}