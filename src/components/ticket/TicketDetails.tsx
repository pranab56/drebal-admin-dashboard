"use client";

import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EventDetails, Ticket } from './ticketType';

interface TicketDetailsProps {
  ticket: Ticket;
  eventDetails: EventDetails;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({ ticket, eventDetails }) => {
  console.log(ticket)
  const router = useRouter();

  const handleBack = () => {
    router.push('/re-sell-tickets');
  };

  return (
    <div className="p-6">
      <div className="">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5 cursor-pointer " />
          <span className="text-lg">Re - Sell Ticket list</span>
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Image
            height={1000}
            width={1000}
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=300&fit=crop"
            alt="Event"
            className="w-full h-64 object-cover"
          />

          <div className="p-8">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="flex items-start gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Event Name</div>
                    <div className="text-base text-gray-900">{eventDetails.eventName}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Event Creator</div>
                    <div className="text-base text-gray-900">{eventDetails.eventCreator}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Location</div>
                    <div className="text-base text-gray-900">{eventDetails.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Published Date</div>
                    <div className="text-base text-gray-900">{eventDetails.publishedDate}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Final Deadline</div>
                    <div className="text-base text-gray-900">{eventDetails.finalDeadline}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Event Categories</div>
                    <div className="text-base text-gray-900">{eventDetails.eventCategories}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Registration Status</div>
                    <div className="text-base text-gray-900">{eventDetails.registrationStatus}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Total Reviews</div>
                    <div className="text-base text-gray-900">{eventDetails.totalReviews}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Earned</div>
                    <div className="text-base text-gray-900">{eventDetails.earned}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">My Revenue</div>
                    <div className="text-base text-gray-900">{eventDetails.myRevenue}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {eventDetails.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-base font-medium mb-6 text-center">Previous User details</h3>

                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">User Name</span>
                    <span className="text-sm text-gray-900">{eventDetails.previousUser.userName}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Event Name</span>
                    <span className="text-sm text-gray-900">{eventDetails.previousUser.eventName}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Event Categories</span>
                    <span className="text-sm text-gray-900">{eventDetails.previousUser.eventCategories}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">User Account Id</span>
                    <span className="text-sm text-gray-900">{eventDetails.previousUser.userAccountId}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Ticket Number</span>
                    <span className="text-sm text-gray-900">{eventDetails.previousUser.ticketNumber}</span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Time</span>
                    <span className="text-sm text-gray-900">{eventDetails.previousUser.time}</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-base font-medium mb-6 text-center">Updated User details</h3>

                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">User Name</span>
                    <span className="text-sm text-gray-900">{eventDetails.updatedUser.userName}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Event Name</span>
                    <span className="text-sm text-gray-900">{eventDetails.updatedUser.eventName}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Event Categories</span>
                    <span className="text-sm text-gray-900">{eventDetails.updatedUser.eventCategories}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">User Account Id</span>
                    <span className="text-sm text-gray-900">{eventDetails.updatedUser.userAccountId}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Ticket Number</span>
                    <span className="text-sm text-gray-900">{eventDetails.updatedUser.ticketNumber}</span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Time</span>
                    <span className="text-sm text-gray-900">{eventDetails.updatedUser.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;