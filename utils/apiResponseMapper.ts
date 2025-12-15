// utils/apiResponseMapper.ts

import { User } from '../src/components/users/userType';

export interface ApiUser {
  _id: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'ORGANIZER' | 'Attendee' | 'Organizer';
  email: string;
  personalInfo?: {
    phone?: string;
    dateOfBirth?: string;
    firstName?: string;
    lastName?: string;
  };
  address?: {
    city?: string;
    street?: string;
    country?: string;
    postalCode?: string;
  };
  image: string;
  createdAt: string;
  // For organizer response
  totalEvents?: number;
  activeEvents?: number;
  totalSold?: number;
  totalRevenue?: number;
  // For user response
  totalTicketSold?: number;
  purchaseQuantity?: number;
}

export interface ApiUserResponse {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: ApiUser[] | ApiUser;
}

export const mapApiUserToFrontend = (apiUser: ApiUser): User => {
  // Extract personal info
  const phone = apiUser.personalInfo?.phone || 'N/A';
  const dateOfBirth = apiUser.personalInfo?.dateOfBirth
    ? new Date(apiUser.personalInfo.dateOfBirth).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    : 'N/A';


  // Extract location
  const location = apiUser.address?.city || apiUser.address?.country || 'N/A';

  // Format join date
  const joinDate = apiUser.createdAt
    ? new Date(apiUser.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ', ' + new Date(apiUser.createdAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
    : 'N/A';

  // Determine role display
  const roleDisplay = apiUser.role === 'ORGANIZER' ? 'Organizer' :
    apiUser.role === 'USER' ? 'Attendee' :
      apiUser.role;

  // Generate account number from _id or use fallback
  const accountNumber = apiUser._id ? apiUser._id.slice(-6).toUpperCase() : 'N/A';

  return {
    _id: apiUser._id || '',
    accountNumber: accountNumber,
    name: apiUser.name || 'N/A',
    role: roleDisplay as 'USER' | 'ADMIN' | 'ORGANIZER' | 'Attendee' | 'Organizer',
    email: apiUser.email || 'N/A',
    dob: dateOfBirth,
    phone: phone,
    location: location,
    joinDate: joinDate,
    avatar: apiUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(apiUser.name || 'User')}&background=random`,
    status: 'Active', // Default status, you might want to get this from API
    verified: true, // Default verified status
    personalInfo: apiUser.personalInfo,
    address: apiUser.address,
    // Add organizer specific fields if they exist
    totalEvents: apiUser.totalEvents || 0,
    activeEvents: apiUser.activeEvents || 0,
    totalTicketsSoldOrg: apiUser.totalSold || 0,
    totalRevenue: apiUser.totalRevenue ? `$${apiUser.totalRevenue}` : '$0',
    totalSold: apiUser.totalSold || 0,
    // Add user specific fields if they exist
    totalTicketsPurchased: apiUser.totalTicketSold || 0,
    totalSpend: apiUser.purchaseQuantity ? `$${apiUser.purchaseQuantity}` : '$0',
  };
};