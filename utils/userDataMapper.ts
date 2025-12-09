import { User } from '../src/components/users/userType';

// utils/userDataMapper.ts
export const mapApiUserToFrontend = (apiUser: any): User => {
  // Parse personalInfo if it's a string
  let personalInfo = apiUser.personalInfo;
  if (typeof personalInfo === 'string') {
    try {
      // Remove curly braces and fix the format
      const cleaned = personalInfo
        .replace(/{/g, '{"')
        .replace(/}/g, '"}')
        .replace(/: /g, '":"')
        .replace(/, /g, '","');
      personalInfo = JSON.parse(cleaned);
    } catch (error) {
      console.error('Error parsing personalInfo:', error);
      personalInfo = {};
    }
  }

  // Parse address if it's a string
  let address = apiUser.address;
  if (typeof address === 'string') {
    try {
      const cleaned = address
        .replace(/{/g, '{"')
        .replace(/}/g, '"}')
        .replace(/: /g, '":"')
        .replace(/, /g, '","');
      address = JSON.parse(cleaned);
    } catch (error) {
      console.error('Error parsing address:', error);
      address = {};
    }
  }

  // Parse notification if it's a string
  let notification = apiUser.notification;
  if (typeof notification === 'string') {
    try {
      const cleaned = notification
        .replace(/{/g, '{"')
        .replace(/}/g, '"}')
        .replace(/: /g, '":"')
        .replace(/, /g, '","');
      notification = JSON.parse(cleaned);
    } catch (error) {
      console.error('Error parsing notification:', error);
      notification = {};
    }
  }

  // Format role for frontend
  const role = apiUser.role === 'USER' ? 'Attendee' :
    apiUser.role === 'ORGANIZER' ? 'Organizer' :
      apiUser.role;

  // Format phone number
  const phone = personalInfo?.phone || 'N/A';

  // Format date of birth
  const dob = personalInfo?.dateOfBirth ?
    new Date(personalInfo.dateOfBirth).toLocaleDateString() : 'N/A';

  // Format location
  const location = address?.city || address?.country || 'N/A';

  // Format join date
  const joinDate = apiUser.joinedDate ?
    new Date(apiUser.joinedDate).toLocaleDateString() : 'N/A';

  return {
    _id: apiUser._id,
    id: apiUser._id,
    accountNumber: apiUser._id?.slice(-6) || 'N/A',
    name: apiUser.name || 'N/A',
    role: role,
    email: apiUser.email || 'N/A',
    dob: dob,
    phone: phone,
    location: location,
    joinDate: joinDate,
    avatar: apiUser.image || 'https://i.ibb.co/z5YHLV9/profile.png',
    status: apiUser.status || 'N/A',
    verified: apiUser.verified || false,
    personalInfo: personalInfo,
    address: address,
    sellAmount: apiUser.sellAmount || 0,
    withDrawAmount: apiUser.withDrawAmount || 0,
    totalTicketsSold: 45,
    totalTicketsPurchased: 112,
    totalEvents: 45,
    activeEvents: '4',
    totalTicketsSoldOrg: 4511,
    totalRevenue: '$11112'
  };
};