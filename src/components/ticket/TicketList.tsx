"use client";

import { Button } from '@/components/ui/button';
import { Calendar as ShadCnCalendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Eye, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Ticket } from './ticketType';

interface TicketListProps {
  tickets: Ticket[];
}

const TicketList: React.FC<TicketListProps> = ({ tickets }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const router = useRouter();
  const totalPages = 25;

  const handleViewDetails = (ticket: Ticket) => {
    router.push(`/re-sell-tickets/${ticket.id}`);
  };

  const renderPagination = () => {
    const pages = [1, 2, 3, 4, 5, 6, 7, 8];

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          className="px-4 py-2 text-gray-400 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        >
          <ChevronLeft className="w-4 h-4 inline mr-1" />
          Previous
        </button>

        {pages.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-10 h-10 rounded ${currentPage === page
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            {page}
          </button>
        ))}

        <button className="w-10 h-10 rounded bg-white text-gray-700 hover:bg-gray-100">
          ...
        </button>

        <button
          onClick={() => setCurrentPage(25)}
          className="w-10 h-10 rounded bg-white text-gray-700 hover:bg-gray-100"
        >
          25
        </button>

        <button
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        >
          Next
          <ChevronRight className="w-4 h-4 inline ml-1" />
        </button>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Re - Sell Ticket list</h1>
          </div>

          <div className="flex gap-3">
            {/* ShadCN Calendar Replacement */}
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-48 justify-start text-left h-[42px] font-normal ${!date ? "text-muted-foreground" : ""}`}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <ShadCnCalendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-green-500" />
              <input
                type="text"
                placeholder="Search Questions.."
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">#SL</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">User Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Account ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Re_Sold User ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Re_Sold Ticket User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{ticket.sl}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{ticket.userName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{ticket.accountId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{ticket.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{ticket.reSoldUserId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{ticket.reSoldTicketUser}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(ticket)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-green-500 cursor-pointer hover:bg-green-50"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {renderPagination()}
      </div>
    </div>
  );
};

export default TicketList;