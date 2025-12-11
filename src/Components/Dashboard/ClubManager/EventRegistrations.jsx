import React, { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventRegistrationApi, clubApi, eventApi } from '../../../api/clubifyApi';
import { AuthContext } from '../../../Contexts/AuthContext';
import { FaSearch, FaUser, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';

const EventRegistrations = () => {
  const { user } = useContext(AuthContext);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch manager's clubs
  const { data: managedClubs, isLoading: clubsLoading } = useQuery({
    queryKey: ['managedClubs', user?.email],
    queryFn: () => clubApi.getClubsByManager(user?.email),
    enabled: !!user?.email,
  });

  // Fetch all events for managed clubs
  const { data: allEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['managerEvents', user?.email],
    queryFn: async () => {
      if (!managedClubs) return [];
      const allEventsData = [];
      for (const club of managedClubs) {
        try {
          const clubEvents = await eventApi.getEventsByClub(club._id);
          allEventsData.push(...clubEvents);
        } catch (error) {
          // Continue even if one club fails to load events
          continue;
        }
      }
      return allEventsData;
    },
    enabled: !!user?.email && !!managedClubs,
  });

  // Fetch all registrations for events in managed clubs
  const { data: allRegistrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ['managerRegistrations', user?.email],
    queryFn: async () => {
      if (!managedClubs) return [];
      const allRegistrationsData = [];
      for (const club of managedClubs) {
        try {
          const clubRegistrations = await eventRegistrationApi.getRegistrationsByClub(club._id);
          // Add club information to each registration
          const enrichedRegistrations = clubRegistrations.map(reg => ({
            ...reg,
            clubId: club._id,
            clubName: club.clubName // Add the club name directly to each registration
          }));
          allRegistrationsData.push(...enrichedRegistrations);
        } catch (error) {
          // Continue even if one club fails to load registrations
          continue;
        }
      }
      return allRegistrationsData;
    },
    enabled: !!user?.email && !!managedClubs,
  });

  // Fetch event details for each registration to get event date
  const { data: eventDetailsMap, isLoading: eventDetailsLoading } = useQuery({
    queryKey: ['eventDetails', allRegistrations],
    queryFn: async () => {
      if (!allRegistrations) return {};

      const eventDetails = {};
      const uniqueEventIds = [...new Set(allRegistrations.map(reg => reg.eventId))].filter(Boolean);

      for (const eventId of uniqueEventIds) {
        try {
          const eventDetailsData = await eventApi.getEventById(eventId);
          eventDetails[eventId] = eventDetailsData;
        } catch (error) {
          // If event details fail to load, continue with other events
          continue;
        }
      }
      return eventDetails;
    },
    enabled: !!allRegistrations?.length,
    refetchOnWindowFocus: false, // Avoid unnecessary refetches
  });

  // Create club details map from the already fetched managed clubs
  const clubDetailsMap = React.useMemo(() => {
    const map = {};
    if (managedClubs) {
      managedClubs.forEach(club => {
        map[club._id] = club;
      });
    }
    return map;
  }, [managedClubs]);

  // Combine registration data with event and club details
  const enrichedRegistrations = React.useMemo(() => {
    if (!allRegistrations) return [];

    return allRegistrations.map(registration => {
      const eventDetails = eventDetailsMap?.[registration.eventId];
      // The registration object should have clubId from getRegistrationsByClub API
      const clubDetails = clubDetailsMap?.[registration.clubId];

      // If club name is not in the registration object, use the club details map
      let clubName = registration.clubName;
      if (!clubName) {
        clubName = clubDetails?.clubName;
      }

      return {
        ...registration,
        eventDate: eventDetails?.eventDate || eventDetails?.date,
        clubName: clubName || 'N/A'
      };
    });
  }, [allRegistrations, eventDetailsMap, clubDetailsMap]);

  // Filter registrations based on selected event and search term
  let filteredRegistrations = enrichedRegistrations || [];

  // Apply event filter
  if (selectedEvent && selectedEvent !== 'all') {
    filteredRegistrations = filteredRegistrations.filter(reg => reg.eventId === selectedEvent);
  }

  // Apply search filter
  if (searchTerm) {
    filteredRegistrations = filteredRegistrations.filter(
      reg =>
        reg.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.clubName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (clubsLoading || eventsLoading || registrationsLoading || eventDetailsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
      </div>
    );
  }

  // Calculate stats
  const totalRegistrations = filteredRegistrations.length;
  const activeRegistrations = filteredRegistrations.filter(r => r.status === 'registered').length;
  const cancelledRegistrations = filteredRegistrations.filter(r => r.status === 'cancelled').length;
  const totalEvents = allEvents?.length || 0;

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
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            >
              <option value="all">All Events</option>
              {allEvents?.map(event => (
                <option key={event._id} value={event._id}>{event.title} - {new Date(event.date).toLocaleDateString()}</option>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations?.length > 0 ? (
                filteredRegistrations.map((registration) => (
                  <tr key={registration._id} className="hover:bg-gray-50">
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
                      {registration.clubName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {registration.eventDate ? new Date(registration.eventDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {registration.registeredAt ? new Date(registration.registeredAt).toLocaleDateString() : 'N/A'}
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {allRegistrations?.length === 0 ? 'No registrations found' : 'No registrations match your filters'}
                  </td>
                </tr>
              )}
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
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalRegistrations}</h3>
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
                {activeRegistrations}
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
                {cancelledRegistrations}
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
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalEvents}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrations;