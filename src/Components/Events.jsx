import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventApi, eventRegistrationApi } from '../api/clubifyApi';
import { clubApi } from '../api/clubifyApi';
import { AuthContext } from '../Contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaUsers, FaFilter, FaCheck, FaUserCheck } from 'react-icons/fa';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch all clubs for filtering
  const { data: allClubs, isLoading: clubsLoading } = useQuery({
    queryKey: ['allClubs'],
    queryFn: () => clubApi.getAllClubs(false), // Get all approved clubs
  });

  // Fetch all events
  const { data: allEventsResponse, isLoading: eventsLoading } = useQuery({
    queryKey: ['allEvents'],
    queryFn: () => eventApi.getAllEvents(),
  });

  // Fetch user's existing registrations
  const { data: userRegistrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ['userRegistrations', user?.email],
    queryFn: () => eventRegistrationApi.getRegistrationsByUser(user?.email),
    enabled: !!user?.email,
  });

  // Mutation for registering for an event
  const registerForEventMutation = useMutation({
    mutationFn: (registrationData) => {
      return eventRegistrationApi.registerForEvent(registrationData, 'fake-token'); // In real app, use actual token
    },
    onSuccess: () => {
      toast.success('Successfully registered for the event!');
      queryClient.invalidateQueries({ queryKey: ['userRegistrations', user?.email] });
      queryClient.invalidateQueries({ queryKey: ['allEvents'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to register for event');
    }
  });

  // Extract events from response
  const allEvents = allEventsResponse?.events || [];

  // Check if user is already registered for an event
  const isUserRegistered = (eventId) => {
    if (!userRegistrations || !Array.isArray(userRegistrations)) return false;
    return userRegistrations.some(reg => reg.eventId === eventId);
  };

  // Filter and sort upcoming events
  let upcomingEvents = [];
  if (Array.isArray(allEvents) && allClubs) {
    // Filter for events that are in the future
    const now = new Date();
    console.log("Current time:", now); // Debug log
    console.log("All events from API:", allEvents); // Debug log

    upcomingEvents = allEvents.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      console.log("Event date:", eventDate, "Event:", event.title, "Is future?", eventDate > now); // Debug log
      return eventDate > now;
    });
    console.log("Upcoming events after date filter:", upcomingEvents.length); // Debug log

    // Apply search filter
    if (searchTerm) {
      upcomingEvents = upcomingEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply club filter
    if (selectedClub) {
      upcomingEvents = upcomingEvents.filter(event => event.clubId === selectedClub);
    }

    // Apply category filter via clubs
    if (selectedCategory) {
      // Get club IDs that match the category
      const matchingClubIds = allClubs
        .filter(club => club.category?.toLowerCase() === selectedCategory.toLowerCase())
        .map(club => club._id);

      upcomingEvents = upcomingEvents.filter(event => matchingClubIds.includes(event.clubId));
    }

    // Sort by date (earliest first)
    upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Get unique categories for filter
  const uniqueCategories = allClubs && Array.isArray(allClubs)
    ? [...new Set(allClubs.map(club => club.category).filter(cat => cat))]
    : [];

  console.log("All clubs from API:", allClubs); // Debug log
  console.log("Unique categories:", uniqueCategories); // Debug log

  if (eventsLoading || clubsLoading || registrationsLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#FAF8F0] to-white py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
      </div>
    );
  }

  console.log("Final upcoming events to display:", upcomingEvents); // Debug log

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FAF8F0] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Upcoming Events
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exciting events happening soon across all clubs
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            >
              <option value="">All Clubs</option>
              {allClubs?.map((club) => (
                <option key={club._id} value={club._id}>{club.clubName}</option>
              ))}
            </select>

            {(searchTerm || selectedCategory || selectedClub) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedClub('');
                }}
                className="px-4 py-2 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#9F62F2] transition-colors flex items-center justify-center"
              >
                <FaFilter className="mr-2" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Events List */}
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => {
              // Find the club associated with this event
              const associatedClub = allClubs?.find(club => club._id === event.clubId);
              const isRegistered = isUserRegistered(event._id);

              return (
                <div key={event._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] relative">
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{event.title}</h3>
                      <p className="text-sm opacity-90">{associatedClub?.clubName || 'Unknown Club'}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="mr-2 text-[#6A0DAD]" />
                        <span>{new Date(event.date).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <FaMapMarkerAlt className="mr-2 text-[#6A0DAD]" />
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <FaDollarSign className="mr-2 text-[#6A0DAD]" />
                        <span>{event.isPaid ? `$${event.eventFee || 0}` : 'Free'}</span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <FaUsers className="mr-2 text-[#6A0DAD]" />
                        <span>{event.maxAttendees ? `${event.maxAttendees} max` : 'Unlimited'}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${associatedClub?.category ? 'bg-[#6A0DAD]/10 text-[#6A0DAD]' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {associatedClub?.category || 'Uncategorized'}
                      </span>

                      {isRegistered ? (
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                          disabled
                        >
                          <FaCheck className="mr-1" /> Registered
                        </button>
                      ) : (
                        <button
                          onClick={() => registerForEventMutation.mutate({
                            eventId: event._id,
                            userEmail: user?.email
                          })}
                          disabled={registerForEventMutation.isPending || !user}
                          className={`${user
                              ? 'bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] hover:opacity-90'
                              : 'bg-gray-400 cursor-not-allowed'
                            } text-white px-4 py-2 rounded-lg transition-opacity text-sm flex items-center`}
                        >
                          {registerForEventMutation.isPending ? (
                            <span>Registering...</span>
                          ) : (
                            <>
                              <FaUserCheck className="mr-1" /> Register
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">No upcoming events found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory || selectedClub
                ? 'No events match your current filters. Try adjusting your search.'
                : 'There are currently no upcoming events. Check back later for new events!'}
            </p>
            {(searchTerm || selectedCategory || selectedClub) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedClub('');
                }}
                className="text-[#6A0DAD] hover:text-[#9F62F2] font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;