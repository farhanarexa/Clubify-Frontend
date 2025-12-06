import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaClock, FaCheck, FaTimes } from 'react-icons/fa';

// Mock data for member's events
const mockMemberEvents = [
  { id: 1, name: 'Tech Talk: AI Trends', clubName: 'Tech Innovators', date: '2024-01-15', location: 'San Francisco, CA', status: 'confirmed', attendees: 45, maxAttendees: 50, fee: 25 },
  { id: 2, name: 'Monthly Fitness Meetup', clubName: 'Fitness Enthusiasts', date: '2024-01-20', location: 'Golden Gate Park, SF', status: 'confirmed', attendees: 75, maxAttendees: 100, fee: 0 },
  { id: 3, name: 'Gaming Tournament', clubName: 'Gaming Community', date: '2024-01-25', location: 'Online', status: 'confirmed', attendees: 28, maxAttendees: 32, fee: 15 },
  { id: 4, name: 'Webinar: Cloud Computing', clubName: 'Tech Innovators', date: '2024-02-05', location: 'Online', status: 'registered', attendees: 150, maxAttendees: 200, fee: 30 },
  { id: 5, name: 'Yoga in the Park', clubName: 'Fitness Enthusiasts', date: '2024-02-10', location: 'Central Park, NYC', status: 'registered', attendees: 55, maxAttendees: 75, fee: 0 },
  { id: 6, name: 'Book Discussion: Modern Fiction', clubName: 'Book Club Society', date: '2024-02-15', location: 'Seattle Library', status: 'pending', attendees: 12, maxAttendees: 25, fee: 0 },
];

// Mock function to fetch member's events
const fetchMemberEvents = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockMemberEvents;
};

const MyEvents = () => {
  const { data: events, isLoading, isError, error } = useQuery({
    queryKey: ['memberEvents'],
    queryFn: fetchMemberEvents,
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
        <p className="text-red-500">Error loading events: {error.message}</p>
      </div>
    );
  }

  // Filter events by status
  const confirmedEvents = events?.filter(event => event.status === 'confirmed') || [];
  const registeredEvents = events?.filter(event => event.status === 'registered') || [];
  const pendingEvents = events?.filter(event => event.status === 'pending') || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Events</h1>
        <p className="text-gray-600">Events you've registered for.</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
          </div>
          <button className="bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Browse Events
          </button>
        </div>
      </div>

      {/* Event Status Tabs */}
      <div className="bg-white rounded-xl shadow-md p-1 mb-6 flex overflow-x-auto">
        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-[#6A0DAD] text-white whitespace-nowrap">
          All Events ({events?.length || 0})
        </button>
        <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 whitespace-nowrap">
          Confirmed ({confirmedEvents.length})
        </button>
        <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 whitespace-nowrap">
          Registered ({registeredEvents.length})
        </button>
        <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 whitespace-nowrap">
          Pending ({pendingEvents.length})
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{event.name}</h3>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  event.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : event.status === 'registered'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.status}
                </span>
              </div>
              
              <p className="text-gray-600 mb-3 text-sm">{event.clubName}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm">
                  <FaUser className="mr-2 text-gray-400" />
                  <span>{event.attendees} of {event.maxAttendees} attendees</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-[#6A0DAD]">
                  {event.fee > 0 ? `$${event.fee}` : 'Free'}
                </div>
                
                <button className="text-[#6A0DAD] hover:text-[#9F62F2] font-medium flex items-center">
                  {event.status === 'confirmed' ? (
                    <>
                      <FaCheck className="mr-1" /> Attending
                    </>
                  ) : event.status === 'registered' ? (
                    <>
                      <FaClock className="mr-1" /> Pending
                    </>
                  ) : (
                    'View Details'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mr-4">
              <FaCheck />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Confirmed Events</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{confirmedEvents.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <FaClock />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Registered Events</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{registeredEvents.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 mr-4">
              <FaClock />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pending Events</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{pendingEvents.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Events</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{events?.length || 0}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;