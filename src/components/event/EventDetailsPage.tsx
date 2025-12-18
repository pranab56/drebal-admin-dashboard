// components/event/EventDetailsPage.tsx
"use client";

import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { baseURL } from '../../../utils/BaseURL';
import {
  useEventDetailsQuery,
  useEventStatusMutation,
} from '../../features/events/eventApi';
import ConfirmationModal from './ConfirmationModal';
import InfoCard from './InfoCard';

interface EventDetailsPageProps {
  eventId: string;
  onBack: () => void;
}

interface Category {
  _id: string;
  categoryId: {
    _id: string;
    title: string;
  };
  subCategory?: {
    _id: string;
    title: string;
  }[];
}

interface Ticket {
  _id: string;
  type: string;
  price: number;
  availableUnits: number;
  outstandingUnits: number;
  earnedAmount: number;
}

interface EventData {
  _id: string;
  eventName: string;
  eventCode: string;
  description: string;
  image: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  ticketSaleStart: string;
  preSaleStart: string;
  totalEarned: number;
  isFreeEvent: boolean;
  createdAt: string;
  updatedAt: string;
  EventStatus: 'UnderReview' | 'Live' | 'Rejected';
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  category?: Category[];
  tickets?: Ticket[];
}

interface EventDetailsResponse {
  data: EventData;
  // Add other response fields if needed
}

export default function EventDetailsPage({
  eventId,
  onBack,
}: EventDetailsPageProps) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: eventDetails, isLoading, error, refetch } = useEventDetailsQuery(eventId);
  const [approveEvent] = useEventStatusMutation();


  const handleApprove = async () => {
    try { 
      setIsProcessing(true);
      const response = await approveEvent(eventId).unwrap();
      console.log(response);
      await refetch();
      setShowApproveModal(false);
    } catch (error) {
      console.error('Failed to approve event:', error);
      alert('Failed to approve event. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsProcessing(true);
      const response = await approveEvent(eventId).unwrap();
      console.log(response);
      await refetch();
      setShowRejectModal(false);
    } catch (error) {
      console.error('Failed to reject event:', error);
      alert('Failed to reject event. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UnderReview': return 'bg-yellow-100 text-yellow-700';
      case 'Live': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={onBack} className="hover:bg-gray-100 p-1 rounded">
            <ChevronLeft className="w-5 h-5 cursor-pointer" />
          </button>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  if (error || !eventDetails?.data) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={onBack} className="hover:bg-gray-100 p-1 rounded">
            <ChevronLeft className="w-5 h-5 cursor-pointer" />
          </button>
          <h1 className="text-xl font-semibold">Event Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading event details. Please try again.</p>
          <button
            onClick={onBack}
            className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const event = (eventDetails as EventDetailsResponse).data;
  const categories = event.category?.map(cat => cat?.categoryId?.title).join(', ') || 'N/A';
  const subCategories = event.category?.flatMap(cat =>
    cat.subCategory?.map(sub => sub.title)
  ).join(', ') || 'N/A';

  return (
    <div className="p-6">
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
        title="Approve Event"
        message="Are you sure you want to approve this event? This will make it live for ticket sales."
        confirmText="Approve"
        isProcessing={isProcessing}
      />

      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        title="Reject Event"
        message="Are you sure you want to reject this event? This action cannot be undone."
        confirmText="Reject"
        isProcessing={isProcessing}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="hover:bg-gray-100 p-1 rounded">
            <ChevronLeft className="w-5 h-5 cursor-pointer" />
          </button>
          <h1 className="text-xl font-semibold">Event Details</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.EventStatus)}`}>
            {event.EventStatus}
          </span>
          <span className="text-sm text-gray-500">#{event.eventCode}</span>
        </div>

        <div className="flex gap-3">
          {/* {event.EventStatus === 'UnderReview' && (
            <>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
              >
                Reject
              </button>
              <button
                onClick={() => setShowApproveModal(true)}
                className="px-6 py-2 bg-green-600 cursor-pointer hover:bg-green-700 text-white rounded-lg font-medium"
              >
                Approve
              </button>
            </>
          )} */}
          {eventDetails?.data?.EventStatus === 'UnderReview' && (
            <button
              onClick={() => setShowApproveModal(true)}
              className="px-6 py-2 bg-green-600 cursor-pointer hover:bg-green-700 text-white rounded-lg font-medium"
            >
              Approve
            </button>
          )}
          {eventDetails?.data?.EventStatus === 'Live' && (
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded-lg font-medium"
            >
              Reject
            </button>
          )}
        </div>
      </div>

      {/* Event Image */}
      <div className='pb-5'>
        {event.image ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={baseURL + event.image}
              alt={event.eventName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="Event Name" value={event.eventName} />
            <InfoCard label="Event Categories" value={categories} />
            <InfoCard label="Sub Categories" value={subCategories} />
            <InfoCard label="Event Code" value={event.eventCode} />
            <InfoCard label="Location" value={`${event.streetAddress}, ${event.city}, ${event.state}, ${event.country}`} />
            <InfoCard label="Event Date" value={formatDate(event.eventDate)} />
            <InfoCard label="Start Time" value={event.startTime} />
            <InfoCard label="End Time" value={event.endTime} />
            <InfoCard label="Ticket Sale Start" value={formatDateTime(event.ticketSaleStart)} />
            <InfoCard label="Pre-Sale Start" value={formatDateTime(event.preSaleStart)} />
            <InfoCard label="Total Earned" value={`$${event.totalEarned}`} />
            <InfoCard label="Free Event" value={event.isFreeEvent ? 'Yes' : 'No'} />
            <InfoCard label="Created At" value={formatDateTime(event.createdAt)} />
            <InfoCard label="Last Updated" value={formatDateTime(event.updatedAt)} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {event.description || 'No description provided.'}
            </p>
          </div>

          {/* Tickets Information */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Ticket Types</h3>
            <div className="grid grid-cols-2 gap-4">
              {event.tickets?.map((ticket) => (
                <div key={ticket._id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{ticket.type}</h4>
                    <span className="font-semibold">${ticket.price}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>Available: {ticket.availableUnits}</div>
                    <div>Total: {ticket.outstandingUnits}</div>
                    <div>Sold: {ticket.outstandingUnits - ticket.availableUnits}</div>
                    <div>Earned: ${ticket.earnedAmount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Organizer */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full mb-3 flex items-center justify-center">
              <span className="text-gray-600 font-semibold">
                {event.organizerName?.charAt(0) || 'O'}
              </span>
            </div>
            <h3 className="font-semibold">{event.organizerName || 'N/A'}</h3>
            <p className="text-sm text-gray-500 mb-1">Organizer</p>
            <p className="text-sm text-gray-600 mb-3">{event.organizerEmail || 'N/A'}</p>
            <p className="text-sm text-gray-600 mb-3">{event.organizerPhone || 'N/A'}</p>
            <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(event.EventStatus)}`}>
              {event.EventStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Note: The purchased and resold tickets tables would need actual API data */}
      {/* You would need to add new API endpoints for these or use the existing data */}
    </div>
  );
}