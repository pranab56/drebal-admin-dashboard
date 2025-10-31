import TicketList from '../../../components/ticket/TicketList';
import { Ticket } from '../../../components/ticket/ticketType';

// Mock data
const mockTickets: Ticket[] = Array(8).fill(null).map((_, i) => ({
  id: i + 1,
  sl: '01',
  userName: 'James Don',
  accountId: '#ARE654565',
  amount: '$50',
  reSoldUserId: i % 2 === 0 ? '#FRER54565' : '#ARE654565',
  reSoldTicketUser: '52654565656'
}));

export default function ReSellTicketsPage() {
  return <TicketList tickets={mockTickets} />;
}