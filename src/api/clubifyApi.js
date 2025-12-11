// api/clubifyApi.js
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:3000'; // Update this to match your backend URL

// Create an axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data, error.response.status, error.response.headers);

      // Show user-friendly error messages
      let errorMessage = 'An error occurred';
      if (error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.status === 401) {
        errorMessage = 'Unauthorized access. Please log in.';
      } else if (error.response.status === 403) {
        errorMessage = 'Access forbidden. You do not have permission to perform this action.';
      } else if (error.response.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      toast.error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
      toast.error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

// User-related API calls
export const userApi = {
  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Get user by email
  getUserByEmail: async (email) => {
    try {
      // Encode the email for URL to handle special characters like spaces
      const encodedEmail = encodeURIComponent(email);
      const response = await api.get(`/users/${encodedEmail}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },

  // Update user role (admin only)
  updateUserRole: async (userId, newRole) => {
    try {
      const response = await api.patch(`/users/${userId}/role`,
        { newRole }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },

  // Get users by role
  getUsersByRole: async (role) => {
    try {
      const response = await api.get(`/users/role/${role}`);
      return response.data;
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw error;
    }
  }
};

// Club-related API calls
export const clubApi = {
  // Create a new club
  createClub: async (clubData) => {
    try {
      const response = await api.post('/clubs', clubData);
      return response.data;
    } catch (error) {
      console.error('Error creating club:', error);
      throw error;
    }
  },

  // Get all clubs
  getAllClubs: async (isAdmin = false) => {
    try {
      const response = await api.get(`/clubs${isAdmin ? '?admin=true' : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error getting clubs:', error);
      throw error;
    }
  },

  // Get clubs by status
  getClubsByStatus: async (status) => {
    try {
      // If status is 'all', get all clubs (admin view)
      if (status === 'all') {
        const response = await api.get('/clubs?admin=true');
        return response.data;
      } else {
        const response = await api.get(`/clubs/status/${status}`);
        return response.data;
      }
    } catch (error) {
      console.error('Error getting clubs by status:', error);
      throw error;
    }
  },

  // Get clubs by manager
  getClubsByManager: async (email) => {
    try {
      const response = await api.get(`/clubs/manager/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error getting clubs by manager:', error);
      throw error;
    }
  },

  // Update club status (admin only)
  updateClubStatus: async (clubId, status) => {
    try {
      const response = await api.patch(`/clubs/${clubId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating club status:', error);
      throw error;
    }
  },

  // Update club details
  updateClub: async (clubId, updateData) => {
    try {
      const response = await api.patch(`/clubs/${clubId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating club:', error);
      throw error;
    }
  },

  // Delete a club
  deleteClub: async (clubId) => {
    try {
      const response = await api.delete(`/clubs/${clubId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting club:', error);
      throw error;
    }
  }
};

// Event-related API calls
export const eventApi = {
  // Create a new event
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Get all events
  getAllEvents: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/events${queryParams ? `?${queryParams}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error getting events:', error);
      throw error;
    }
  },

  // Get events by club
  getEventsByClub: async (clubId) => {
    try {
      const response = await api.get(`/events/club/${clubId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting events by club:', error);
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting event by ID:', error);
      throw error;
    }
  },

  // Update an event
  updateEvent: async (eventId, updateData) => {
    try {
      const response = await api.patch(`/events/${eventId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete an event
  deleteEvent: async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};

// Membership-related API calls
export const membershipApi = {
  // Create a new membership
  createMembership: async (membershipData) => {
    try {
      const response = await api.post('/memberships', membershipData);
      return response.data;
    } catch (error) {
      console.error('Error creating membership:', error);
      throw error;
    }
  },

  // Get memberships by user
  getMembershipsByUser: async (email) => {
    try {
      const response = await api.get(`/memberships/user/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error getting memberships by user:', error);
      throw error;
    }
  },

  // Get memberships by club
  getMembershipsByClub: async (clubId) => {
    try {
      const response = await api.get(`/memberships/club/${clubId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting memberships by club:', error);
      throw error;
    }
  },

  // Update membership status
  updateMembershipStatus: async (membershipId, status) => {
    try {
      const response = await api.patch(`/memberships/${membershipId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating membership status:', error);
      throw error;
    }
  },

  // Delete a membership
  deleteMembership: async (membershipId) => {
    try {
      const response = await api.delete(`/memberships/${membershipId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting membership:', error);
      throw error;
    }
  }
};

// Event registration-related API calls
export const eventRegistrationApi = {
  // Register for an event
  registerForEvent: async (registrationData) => {
    try {
      const response = await api.post('/event-registrations', registrationData);
      return response.data;
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  },

  // Get registrations by user
  getRegistrationsByUser: async (email) => {
    try {
      const response = await api.get(`/event-registrations/user/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error getting registrations by user:', error);
      throw error;
    }
  },

  // Get registrations by event
  getRegistrationsByEvent: async (eventId) => {
    try {
      const response = await api.get(`/event-registrations/event/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting registrations by event:', error);
      throw error;
    }
  },

  // Get registrations by club
  getRegistrationsByClub: async (clubId) => {
    try {
      const response = await api.get(`/event-registrations/club/${clubId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting registrations by club:', error);
      throw error;
    }
  },

  // Update registration status
  updateRegistrationStatus: async (registrationId, status) => {
    try {
      const response = await api.patch(`/event-registrations/${registrationId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating registration status:', error);
      throw error;
    }
  },

  // Delete a registration
  deleteRegistration: async (registrationId) => {
    try {
      const response = await api.delete(`/event-registrations/${registrationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting registration:', error);
      throw error;
    }
  }
};

// Payment-related API calls
export const paymentApi = {
  // Create a new payment
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Get payments by user
  getPaymentsByUser: async (email) => {
    try {
      const response = await api.get(`/payments/user/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payments by user:', error);
      throw error;
    }
  },

  // Get all payments (admin only)
  getAllPayments: async () => {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      console.error('Error getting all payments:', error);
      throw error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (paymentId, status) => {
    try {
      const response = await api.patch(`/payments/${paymentId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Get payments by club
  getPaymentsByClub: async (clubId) => {
    try {
      const response = await api.get(`/payments/club/${clubId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payments by club:', error);
      throw error;
    }
  }
};

export default api;