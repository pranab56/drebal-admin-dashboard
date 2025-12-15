import { UIEvent } from './eventType';


export const eventsData: UIEvent[] = [
  {
    id: '1',
    name: 'Piano Star Event',
    location: 'Dhaka Bangladesh',
    category: 'Onsite Event',
    earned: '$100',
    deadline: '1-6-2025',
    status: 'pending',
    image: '/api/placeholder/160/140',
    creator: 'blockszone',
    publishedDate: '1-6-2025, 7:00 PM',
    registrationStatus: 'open (Initial)',
    totalReviews: '17 reviews',
    revenue: '$90',
    organizer: {
      name: 'Alex tom',
      email: 'alex@gmail.com',
      status: 'active'
    },
    ticketTypes: ['Premium', 'VIP', 'Other', 'Standard'],
    description: 'Lorem ipsum dolor sit amet consectetur. Ultrices in feugiat venenatis habitant rutrum cursus elementum in quis aliquet. Lacus eu malesuada pellentesque massa integer amet vehenatis. Neque ut fringilla mattis fringilla celerent consequat leo aliquet cursus amet at purus elementum et pellentesque posucere bibendum cursus blandit risus pretius et arcu mattis in dui quis lorem aliquet nam rutrum.',
    purchasedTickets: [
      { id: 1, accountId: 2091, displayName: 'Bashiur islam', email: 'info@gmail.com', phone: '01014589466', appliedTime: '8 Oct 24, 9:00PM' },
      { id: 2, accountId: 2145, displayName: 'Bashiur islam', email: 'info@gmail.com', phone: '01014589466', appliedTime: '8 Oct 24, 9:00PM' },
      { id: 3, accountId: 2145, displayName: 'Bashiur islam', email: 'info@gmail.com', phone: '01014589466', appliedTime: '8 Oct 24, 9:00PM' },
      { id: 4, accountId: 2145, displayName: 'Bashiur islam', email: 'info@gmail.com', phone: '01014589466', appliedTime: '8 Oct 24, 9:00PM' }
    ],
    resoldTickets: [
      { id: 1, accountId: 2091, displayName: 'Bashiur islam', updateTime: 'Jan 24, 11:57PM' },
      { id: 2, accountId: 2091, displayName: 'Bashiur islam', updateTime: 'Jan 24, 11:57PM' },
      { id: 3, accountId: 2091, displayName: 'Bashiur islam', updateTime: 'Jan 24, 11:57PM' },
      { id: 4, accountId: 2091, displayName: 'Bashiur islam', updateTime: 'Jan 24, 11:57PM' }
    ]
  },
  {
    id: '2',
    name: 'Piano Star Event',
    location: 'Dhaka Bangladesh',
    category: 'Onsite Event',
    earned: '$100',
    deadline: '1-6-2025',
    status: 'approved',
    image: '/api/placeholder/160/140',
    creator: 'blockszone',
    publishedDate: '1-6-2025, 7:00 PM',
    registrationStatus: 'open (Initial)',
    totalReviews: '17 reviews',
    revenue: '$90',
    organizer: {
      name: 'Alex tom',
      email: 'alex@gmail.com',
      status: 'active'
    },
    ticketTypes: ['Premium', 'VIP', 'Other', 'Standard'],
    description: 'Lorem ipsum dolor sit amet consectetur. Ultrices in feugiat venenatis habitant rutrum cursus elementum in quis aliquet.',
    purchasedTickets: [
      { id: 1, accountId: 2091, displayName: 'Bashiur islam', email: 'info@gmail.com', phone: '01014589466', appliedTime: '8 Oct 24, 9:00PM' }
    ],
    resoldTickets: [
      { id: 1, accountId: 2091, displayName: 'Bashiur islam', updateTime: 'Jan 24, 11:57PM' }
    ]
  },
  {
    id: '3',
    name: 'Piano Star Event',
    location: 'Dhaka Bangladesh',
    category: 'Onsite Event',
    earned: '$100',
    deadline: '1-6-2025',
    status: 'rejected',
    image: '/api/placeholder/160/140',
    creator: 'blockszone',
    publishedDate: '1-6-2025, 7:00 PM',
    registrationStatus: 'open (Initial)',
    totalReviews: '17 reviews',
    revenue: '$90',
    organizer: {
      name: 'Alex tom',
      email: 'alex@gmail.com',
      status: 'active'
    },
    ticketTypes: ['Premium', 'VIP', 'Other', 'Standard'],
    description: 'Lorem ipsum dolor sit amet consectetur.',
    purchasedTickets: [],
    resoldTickets: []
  },
  {
    id: '4',
    name: 'Piano Star Event',
    location: 'Dhaka Bangladesh',
    category: 'Onsite Event',
    earned: '$100',
    deadline: '1-6-2025',
    status: 'pending',
    image: '/api/placeholder/160/140',
    creator: 'blockszone',
    publishedDate: '1-6-2025, 7:00 PM',
    registrationStatus: 'open (Initial)',
    totalReviews: '17 reviews',
    revenue: '$90',
    organizer: {
      name: 'Alex tom',
      email: 'alex@gmail.com',
      status: 'active'
    },
    ticketTypes: ['Premium', 'VIP', 'Other', 'Standard'],
    description: 'Lorem ipsum dolor sit amet consectetur.',
    purchasedTickets: [],
    resoldTickets: []
  }
];