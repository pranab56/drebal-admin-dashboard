"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { eventsData } from './eventData';
import { AllEventsPageProps, Event } from './eventType';

export default function AllEventsPage({ onEventClick }: AllEventsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">All Events</h1>
          </div>

          <div className="flex gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:ring-green-500"
              />
            </div>

            {/* Category Filter - Custom Shadcn Select */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] border border-gray-300 rounded-lg focus:ring-0 ">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="onsite">Onsite Event</SelectItem>
                <SelectItem value="virtual">Virtual Event</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter - Custom Shadcn Select */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] border border-gray-300 rounded-lg focus:ring-0 ">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="space-y-4">
          {eventsData.map((event) => (
            <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex gap-4">
                <div className="w-40 h-36 bg-gray-200 rounded-lg flex-shrink-0"></div>

                <div className="w-full flex flex-col gap-3">
                  <div className="flex justify-between w-full items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{event.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-12 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">Category</div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{event.category}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Earned</div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{event.earned}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Deadline</div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{event.deadline}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col gap-5'>
                  <span className={`px-3 py-1 rounded-full text-center text-sm font-medium capitalize ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>

                  <button
                    onClick={() => onEventClick(event)}
                    className="bg-green-700 hover:bg-green-800 cursor-pointer text-white px-8 py-2 rounded-lg font-medium self-center"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-6">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-400 bg-gray-100">
            Previous
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg cursor-pointer  ${currentPage === page
                ? 'bg-green-700 text-white'
                : 'border border-gray-300 hover:bg-gray-50'
                }`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-2 border border-gray-300 rounded-lg">...</button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg">25</button>
          <button className="px-4 py-2 bg-green-700 text-white rounded-lg">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}