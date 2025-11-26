"use client";

import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import InfoCard from './InfoCard';
import Pagination from './Pagination';
import TicketModal from './TicketModal';
import { EventDetailsPageProps, ResoldTicket } from './eventType';

export default function EventDetailsPage({
  event,
  onBack,
  onApprove,
  onReject
}: EventDetailsPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ResoldTicket | null>(null);
  const [purchasedPage, setPurchasedPage] = useState(1);
  const [resoldPage, setResoldPage] = useState(1);

  const handleTicketClick = (ticket: ResoldTicket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="hover:bg-gray-100 p-1 rounded">
              <ChevronLeft className="w-5 h-5 cursor-pointer" />
            </button>
            <h1 className="text-xl font-semibold">Event Details</h1>
          </div>

          <div className="flex gap-3">
            {event.status === 'pending' && (
              <>
                <button
                  onClick={onReject}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
                >
                  Reject
                </button>
                <button
                  onClick={onApprove}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  Approve
                </button>
              </>
            )}
            {event.status === 'rejected' && (
              <button
                onClick={onReject}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
              >
                Reject
              </button>
            )}
            {event.status === 'approved' && (
              <button
                onClick={onApprove}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
              >
                Approve
              </button>
            )}
          </div>
        </div>

        {/* Event Image */}
        <div className='pb-5 '>
          <Image src={"/images/event/image.jpg"} height={1000} width={1000} className='w-full h-48 object-cover rounded-lg' alt='' />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoCard label="Event Name" value={event.name} />
              <InfoCard label="Event Categories" value="Primary Round" />
              <InfoCard label="Event Creator" value={event.creator} />
              <InfoCard label="Registration Status" value={event.registrationStatus} />
              <InfoCard label="Location" value={event.location} />
              <InfoCard label="Total Reviews" value={event.totalReviews} />
              <InfoCard label="Published Date" value={event.publishedDate} />
              <InfoCard label="Earned" value={event.earned} />
              <InfoCard label="Final Deadline" value={event.deadline} />
              <InfoCard label="My Revenue" value={event.revenue} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>

          {/* Right Column - Organizer */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mb-3"></div>
              <h3 className="font-semibold">{event.organizer.name}</h3>
              <p className="text-sm text-gray-500 mb-1">Organizer</p>
              <p className="text-sm text-gray-600 mb-3">{event.organizer.email}</p>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full mb-4">
                {event.organizer.status}
              </span>
              <div>
                <h4 className="text-sm font-semibold mb-2">Ticket Types</h4>
                <div className="space-y-1">
                  {event.ticketTypes.map((type, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Tickets Table */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold p-4 border-b">Purchased Tickets</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">#SL</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Account ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Display Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Applied Date Time</th>
                </tr>
              </thead>
              <tbody>
                {event.purchasedTickets.map((ticket, idx) => (
                  <tr key={ticket.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm">{ticket.accountId}</td>
                    <td className="px-4 py-3 text-sm">{ticket.displayName}</td>
                    <td className="px-4 py-3 text-sm">{ticket.email}</td>
                    <td className="px-4 py-3 text-sm">{ticket.phone}</td>
                    <td className="px-4 py-3 text-sm">{ticket.appliedTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={purchasedPage} onPageChange={setPurchasedPage} />
        </div>

        {/* Re-Sold Tickets Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold p-4 border-b">Re - Sold Tickets</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">#SL</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Account ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Display Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Update Date Time</th>
                  {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {event.resoldTickets.map((ticket, idx) => (
                  <tr key={ticket.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm">{ticket.accountId}</td>
                    <td className="px-4 py-3 text-sm">{ticket.displayName}</td>
                    <td className="px-4 py-3 text-sm">{ticket.updateTime}</td>
                    {/* <td className="px-4 py-3">
                      <button
                        onClick={() => handleTicketClick(ticket)}
                        className="text-green-600 hover:text-green-700 cursor-pointer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={resoldPage} onPageChange={setResoldPage} />
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedTicket && (
        <TicketModal ticket={selectedTicket} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}