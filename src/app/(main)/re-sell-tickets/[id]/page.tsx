import TicketDetails from '../../../../components/ticket/TicketDetails';
import { EventDetails, Ticket } from '../../../../components/ticket/ticketType';


// Mock data - in real app, you'd fetch this based on the ID
const mockEventDetails: EventDetails = {
  eventName: 'Piono',
  eventCreator: 'Michael Lone',
  location: 'Dhaka Bangladesh',
  publishedDate: '1-5-2025 - 7:00 PM',
  finalDeadline: '1-5-2025',
  eventCategories: 'Primary Round',
  registrationStatus: 'Ended',
  totalReviews: '12 reviews',
  earned: '100',
  myRevenue: '100',
  description: 'Lorem ipsum dolor sit amet, consectetur. Ultrices id feugiat venenatis habitant malesuada viverra elementum purus, volutpat. Lacus eu molestie pulvinar rhoncus integer dolor elementum neque. Scelerisque massa suspendisse urna ut purus suscipit. Tristique nisi non morbi sed commodo elementum morbi massa ac netus ipsum turpis gravida ut elit. Purus justo felis euismod sed ridiculus ut ultricies ipsum elit bibendum consectetur sapien tempus dictus. Pelle ipsum ornare et in, lorem cursus ut sagittate sed nunc nisl honcilla lorper quis cursus. Non arcu in orbi elit, accumsan nisi condimentum. Ut pellentesque nisl ac molestie adipiscing lectus in.',
  previousUser: {
    userName: 'Bashar Islam',
    eventName: 'Piono',
    eventCategories: 'Music',
    userAccountId: '254202',
    ticketNumber: '#445464565588',
    time: '8:30AM'
  },
  updatedUser: {
    userName: 'Faysal ali',
    eventName: 'Piono',
    eventCategories: 'Music',
    userAccountId: '3516484',
    ticketNumber: '#5545545',
    time: '11:30AM'
  }
};

// Generate mock ticket based on ID
const getMockTicket = (id: string): Ticket => ({
  id: parseInt(id),
  sl: '01',
  userName: 'James Don',
  accountId: '#ARE654565',
  amount: '$50',
  reSoldUserId: parseInt(id) % 2 === 0 ? '#FRER54565' : '#ARE654565',
  reSoldTicketUser: '52654565656'
});

interface PageProps {
  params: {
    id: string;
  };
}

export default function TicketDetailPage({ params }: PageProps) {
  const ticket = getMockTicket(params.id);

  return <TicketDetails ticket={ticket} eventDetails={mockEventDetails} />;
}