import React, { useState, useEffect, useContext } from 'react';
import { membershipApi, eventRegistrationApi, eventApi } from '../../../api/clubifyApi';
import { AuthContext } from '../../../Contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaUsers, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserCheck } from 'react-icons/fa';

const MemberDashboard = () => {
    const [memberships, setMemberships] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalClubs: 0, totalEvents: 0 });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        if (!user) return;

        try {
            const [membershipsData, registrationsData] = await Promise.all([
                membershipApi.getMembershipsByUser(user.email),
                eventRegistrationApi.getRegistrationsByUser(user.email)
            ]);

            setMemberships(membershipsData);
            setRegistrations(registrationsData);

            // Set stats
            setStats({
                totalClubs: membershipsData.length,
                totalEvents: registrationsData.length
            });

            // Get club IDs from memberships to fetch all events from those clubs
            const clubIds = [...new Set(membershipsData.map(m => m.clubId))];

            // Fetch all events from the clubs the user is part of
            const clubEventsPromises = clubIds.map(clubId => eventApi.getEventsByClub(clubId));
            const allClubEventsArrays = await Promise.all(clubEventsPromises);
            let allClubEvents = allClubEventsArrays.flat();

            // Add clubName to each event from the memberships data
            allClubEvents = allClubEvents.map(event => {
                const club = membershipsData.find(m => m.clubId.toString() === event.clubId.toString());
                return {
                    ...event,
                    clubName: club ? club.clubName : 'Unknown Club'
                };
            });

            // Filter for upcoming events (events with date in the future)
            const now = new Date();
            const filteredUpcomingEvents = allClubEvents.filter(event => {
                const eventDate = new Date(event.eventDate || event.date);
                return eventDate > now;
            });

            // Sort by event date (earliest first)
            const sortedEvents = filteredUpcomingEvents.sort((a, b) =>
                new Date(a.eventDate || a.date) - new Date(b.eventDate || b.date)
            );

            setUpcomingEvents(sortedEvents.slice(0, 5)); // Show only first 5 upcoming events
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FAF8F0] to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        Welcome, {user?.name || user?.email?.split('@')[0]}! 👋
                    </h1>
                    <p className="text-lg text-gray-600">
                        Here's what's happening with your clubs and events
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#6A0DAD]">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Clubs Joined</h3>
                        <p className="text-3xl font-bold text-[#6A0DAD]">{stats.totalClubs}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FaUsers className="mr-1" />
                            <span>Active in {stats.totalClubs} club{stats.totalClubs !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#9F62F2]">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Events Registered</h3>
                        <p className="text-3xl font-bold text-[#9F62F2]">{stats.totalEvents}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="mr-1" />
                            <span>Participating in {stats.totalEvents} event{stats.totalEvents !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#4CAF50]">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Events</h3>
                        <p className="text-3xl font-bold text-[#4CAF50]">{upcomingEvents.length}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FaClock className="mr-1" />
                            <span>{upcomingEvents.length} event{upcomingEvents.length !== 1 ? 's' : ''} coming up</span>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events from Clubs */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <FaCalendarAlt className="mr-2 text-[#6A0DAD]" />
                        Upcoming Events from Your Clubs
                    </h2>

                    {upcomingEvents.length > 0 ? (
                        <div className="space-y-6">
                            {upcomingEvents.map((event) => {
                                const eventDate = new Date(event.eventDate || event.date);
                                const formattedDate = eventDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });
                                const formattedTime = eventDate.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });

                                // Check if user is registered for this event
                                const isRegistered = registrations.some(reg =>
                                    reg.eventId && event._id &&
                                    reg.eventId.toString() === event._id.toString()
                                );

                                return (
                                    <div key={event._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            <div className="flex-1 mb-4 md:mb-0">
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                                                <div className="flex items-center text-gray-600 mb-2">
                                                    <FaMapMarkerAlt className="mr-2 text-[#6A0DAD]" />
                                                    <span>{event.location}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600 mb-2">
                                                    <FaCalendarAlt className="mr-2 text-[#6A0DAD]" />
                                                    <span>{formattedDate}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <FaClock className="mr-2 text-[#6A0DAD]" />
                                                    <span>{formattedTime}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start md:items-end">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    event.isPaid ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {event.isPaid ? `Paid - $${event.eventFee || 0}` : 'Free'}
                                                </span>
                                                <span className="text-gray-500 mt-2 text-sm">
                                                    {event.maxAttendees ? `${event.maxAttendees} max attendees` : 'No limit'}
                                                </span>
                                                {isRegistered && (
                                                    <span className="mt-2 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center">
                                                        <FaUserCheck className="mr-1" /> Registered
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-400 mb-4">
                                <FaCalendarAlt className="mx-auto h-12 w-12" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Upcoming Events</h3>
                            <p className="text-gray-500">
                                There are no upcoming events from the clubs you're part of.
                                Check back later or discover new events!
                            </p>
                        </div>
                    )}
                </div>

                {/* My Clubs and My Events Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* My Clubs */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">My Clubs</h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {memberships.length > 0 ? (
                                memberships.slice(0, 5).map((membership) => (
                                    <div key={membership._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <h3 className="font-semibold text-gray-800">{membership.clubName}</h3>
                                        <p className="text-gray-600 text-sm truncate">{membership.description}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                ${membership.status === 'active' ? 'bg-green-100 text-green-800' :
                                                  'bg-yellow-100 text-yellow-800'}`}>
                                                {membership.status}
                                            </span>
                                            <span className="text-xs text-gray-500">{new Date(membership.joinedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">You haven't joined any clubs yet</p>
                            )}
                        </div>
                    </div>

                    {/* My Events */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">My Events</h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {registrations.length > 0 ? (
                                registrations.slice(0, 5).map((registration) => {
                                    const registeredDate = new Date(registration.registeredAt || new Date());

                                    return (
                                        <div key={registration._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <h3 className="font-semibold text-gray-800">{registration.eventName}</h3>
                                            <p className="text-gray-600 text-sm">Club: {registration.clubName}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                    ${registration.status === 'registered' ? 'bg-green-100 text-green-800' :
                                                      'bg-red-100 text-red-800'}`}>
                                                    {registration.status}
                                                </span>
                                                <span className="text-xs text-gray-500">{registeredDate.toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 text-center py-4">You haven't registered for any events yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;