// components/event/AllEventsPage.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Search } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { baseURL } from '../../../utils/BaseURL';
import { useGetAllEventsQuery } from '../../features/events/eventApi';
import { EventListItem } from './eventType';

interface AllEventsPageProps {
  onEventClick: (eventId: string) => void;
}

export default function AllEventsPage({ onEventClick }: AllEventsPageProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, error } = useGetAllEventsQuery(statusFilter);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'UnderReview':
        return 'bg-yellow-100 text-yellow-700';
      case 'Live':
        return 'bg-green-100 text-green-700';
      case 'Expired':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading events. Please try again.</p>
        </div>
      </div>
    );
  }

  const events = data?.data || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">All Events</h1>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
            {data?.meta?.total || 0} events
          </span>
        </div>

        <div className="flex gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] py-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="UnderReview">Under Review</SelectItem>
              <SelectItem value="Live">Live</SelectItem>
              <SelectItem value="Expired">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No events found</p>
          </div>
        ) : (
          events.map((event: EventListItem) => (
            <div
              key={event._id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex gap-4">
                <div className="w-40 h-36 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  {event.image ? (
                    <Image
                      src={baseURL + event.image}
                      alt={event.eventName}
                      width={1000}
                      height={1000}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{event.eventName}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.streetAddress}</span>
                        {event.streetAddress2 && <span>, {event.streetAddress2}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-center text-sm font-medium ${getStatusColor(event.EventStatus)}`}>
                        {event.EventStatus}
                      </span>
                      <span className="text-sm text-gray-500">#{event.eventCode}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">Event Date</div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Start Time</div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{event.startTime}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Ticket Sales Start</div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{formatDate(event.ticketSaleStart)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5 justify-center">
                  <button
                    onClick={() => onEventClick(event._id)}
                    className="bg-green-700 hover:bg-green-800 cursor-pointer text-white px-8 py-2 rounded-lg font-medium transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {data?.meta && data.meta.totalPage > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, data.meta.totalPage) }, (_, i) => {
            let pageNum: number;
            if (data.meta.totalPage <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= data.meta.totalPage - 2) {
              pageNum = data.meta.totalPage - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-2 rounded-lg transition-colors ${currentPage === pageNum
                  ? 'bg-green-700 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          {data.meta.totalPage > 5 && currentPage < data.meta.totalPage - 2 && (
            <>
              <span className="px-2">...</span>
              <button
                onClick={() => setCurrentPage(data.meta.totalPage)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {data.meta.totalPage}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage(prev => Math.min(data.meta.totalPage, prev + 1))}
            disabled={currentPage === data.meta.totalPage}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}