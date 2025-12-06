import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSearch, FaUser, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';

// Mock data for event registrations
const mockRegistrations = [
  { id: 1, userEmail: 'john@example.com', eventName: 'Tech Talk: AI Trends', eventDate: '2024-01-15', status: 'registered', registeredAt: '2024-01-01' },
  { id: 2, userEmail: 'jane@example.com', eventName: 'Tech Talk: AI Trends', eventDate: '2024-01-15', status: 'registered', registeredAt: '2024-01-02' },
  { id: 3, userEmail: 'bob@example.com', eventName: 'Tech Talk: AI Trends', eventDate: '2024-01-15', status: 'cancelled', registeredAt: '2024-01-03' },
  { id: 4, userEmail: 'alice@example.com', eventName: 'Monthly Fitness Meetup', eventDate: '2024-01-20', status: 'registered', registeredAt: '2024-01-05' },
  { id: 5, userEmail: 'charlie@example.com', eventName: 'Monthly Fitness Meetup', eventDate: '2024-01-20', status: 'registered', registeredAt: '2024-01-06' },
  { id: 6, userEmail: 'diana@example.com', eventName: 'Gaming Tournament', eventDate: '2024-01-25', status: 'registered', registeredAt: '2024-01-07' },
  { id: 7, userEmail: 'ethan@example.com', eventName: 'Webinar: Cloud Computing', eventDate: '2024-02-05', status: 'registered', registeredAt: '2024-01-08' },
  { id: 8, userEmail: 'fiona@example.com', eventName: 'Webinar: Cloud Computing', eventDate: '2024-02-05', status: 'registered', registeredAt: '2024-01-09' },
];

// Mock data for events
const mockEvents = [
  { id: 1, name: 'Tech Talk: AI Trends', date: '2024-01-15', location: 'San Francisco, CA' },
  { id: 2, name: 'Monthly Fitness Meetup', date: '2024-01-20', location: 'Golden Gate Park, SF' },
  { id: 3, name: 'Gaming Tournament', date: '2024-01-25', location: 'Online' },
  { id: 4, name: 'Webinar: Cloud Computing', date: '2024-02-05', location: 'Online' },
];

// Mock function to fetch event registrations
const fetchEventRegistrations = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockRegistrations;
};

const EventRegistrations = () => {
  const { data: registrations, isLoading, isError, error } = useQuery({
    queryKey: ['eventRegistrations'],
    queryFn: fetchEventRegistrations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-red-500">Error loading registrations: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Event Registrations</h1>
        <p className="text-gray-600">View and manage registrations for your events.</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Event</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            >
              <option>All Events</option>
              {mockEvents.map(event => (
                <option key={event.id} value={event.id}>{event.name} - {event.date}</option>
              ))}
            </select>
          </div>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search registrations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registrations?.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] rounded-full flex items-center justify-center text-white font-semibold">
                        {registration.userEmail.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{registration.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{registration.eventName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(registration.eventDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(registration.registeredAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      registration.status === 'registered' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {registration.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <FaUser />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Registrations</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{registrations?.length || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mr-4">
              <FaCheck />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Registrations</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {registrations?.filter(r => r.status === 'registered').length || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 mr-4">
              <FaTimes />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Cancelled</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {registrations?.filter(r => r.status === 'cancelled').length || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Events</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{mockEvents.length}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrations;