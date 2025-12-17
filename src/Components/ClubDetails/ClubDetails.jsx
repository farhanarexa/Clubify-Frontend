import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { clubApi, eventApi, membershipApi } from '../../api/clubifyApi';
import { AuthContext } from '../../Contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaClock, FaArrowLeft, FaStar, FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

const ClubDetails = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (clubId) fetchClubDetails();
  }, [clubId]);

  useEffect(() => {
    if (user && clubId) checkMembership();
  }, [user, clubId]);

  const fetchClubDetails = async () => {
    try {
      const allClubs = await clubApi.getAllClubs(false);
      const foundClub = allClubs.find(c => c._id === clubId);

      if (!foundClub) {
        toast.error('Club not found');
        navigate('/availableclubs');
        return;
      }

      setClub(foundClub);

      const clubEvents = await eventApi.getEventsByClub(clubId);
      setEvents(clubEvents || []);
    } catch (error) {
      console.error('Error fetching club details:', error);
      toast.error('Failed to load club');
      navigate('/availableclubs');
    } finally {
      setLoading(false);
    }
  };

  const checkMembership = async () => {
    if (!user) {
      setIsMember(false);
      return;
    }
    try {
      const memberships = await membershipApi.getMembershipsByUser(user.email);
      const exists = memberships.some(m => m.clubId?.toString() === clubId);
      setIsMember(exists);
    } catch (error) {
      console.error('Membership check failed:', error);
    }
  };

  const handleJoinClub = async () => {
    if (!user) {
      toast.error('Login kor age');
      navigate('/login');
      return;
    }

    if (isJoining) return;

    setIsJoining(true);

    try {
      let paymentId = null;

      if (club.membershipFee > 0) {
        paymentId = `pay_${Date.now()}_${clubId}`;
        toast.info(`Processing $${club.membershipFee} payment...`, { autoClose: 2500 });
        await new Promise(r => setTimeout(r, 1500)); // Fake delay for realism
      }

      await axios.post('https://clubify-backend.onrender.com/memberships', {
        userEmail: user.email,
        clubId: clubId,
        paymentId: paymentId,
      });

      toast.success('Successfully joined the club!');
      setIsMember(true); // Instant update

    } catch (error) {
      console.error('Join failed:', error);
      toast.error(error.response?.data?.message || 'Join korar somoy error hoise');
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#FAF8F0] to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#6A0DAD]"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Club not found</h2>
          <Link to="/availableclubs" className="text-[#6A0DAD] text-xl mt-4 inline-block hover:underline">
            Back to Clubs
          </Link>
        </div>
      </div>
    );
  }

  const upcomingEvents = events
    .filter(e => new Date(e.eventDate || e.date) > new Date())
    .sort((a, b) => new Date(a.eventDate || a.date) - new Date(b.eventDate || b.date));

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-linear-to-b from-[#FAF8F0] to-white py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/availableclubs')}
            className="flex items-center text-[#6A0DAD] hover:text-[#9F62F2] font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Back to Clubs
          </button>
        </div>

        {/* Club Header */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          <div className="h-64 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] relative">
            {club.bannerImage ? (
              <img
                src={club.bannerImage}
                alt={club.clubName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center">
                <span className="text-gray-500 text-xl">Club Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
              <div className="container mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  {club.clubName}
                </h1>
                <p className="text-xl text-white mt-2 drop-shadow-md">
                  {club.category}
                </p>
                <div className="flex items-center mt-4 text-white">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{club.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                    <FaDollarSign className="text-[#6A0DAD] mr-2" />
                    <span className="font-medium">
                      {club.membershipFee > 0 ? `$${club.membershipFee}` : 'Free'}
                    </span>
                  </div>
                  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                    <FaUsers className="text-[#6A0DAD] mr-2" />
                    <span className="font-medium">
                      {events.length} {events.length === 1 ? 'Event' : 'Events'}
                    </span>
                  </div>
                  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                    <FaStar className="text-[#6A0DAD] mr-2" />
                    <span className="font-medium">Active</span>
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {club.description}
                </p>
              </div>

              <div className="lg:ml-8">
                <div className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] rounded-2xl p-6 text-white text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    {isMember ? 'Member' : 'Join Club'}
                  </h3>
                  <div className="mb-4">
                    <div className="text-3xl font-bold">
                      {club.membershipFee > 0 ? `$${club.membershipFee}` : 'Free'}
                    </div>
                    <div className="text-sm opacity-80">Membership Fee</div>
                  </div>
                  <button
                    onClick={handleJoinClub}
                    disabled={isMember || isJoining}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${isMember
                      ? 'bg-green-600 cursor-not-allowed'
                      : 'bg-white text-[#6A0DAD] hover:bg-opacity-90 hover:text-white hover:bg-[#6A0DAD]'
                      }`}
                  >
                    {isJoining ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : isMember ? (
                      'Joined ✓'
                    ) : (
                      <div className="flex items-center justify-center">
                        <FaUserPlus className="mr-2" />
                        Join Club
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Club Events */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaCalendarAlt className="mr-2 text-[#6A0DAD]" />
                  Upcoming Events
                </h2>
                <span className="bg-[#6A0DAD]/10 text-[#6A0DAD] px-3 py-1 rounded-full text-sm font-medium">
                  {upcomingEvents.length} {upcomingEvents.length === 1 ? 'Event' : 'Events'}
                </span>
              </div>

              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => {
                    const eventDate = new Date(event.eventDate || event.date);
                    const formattedDate = formatDate(event.eventDate || event.date);
                    const formattedTime = eventDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <div key={event._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center">
                          <div className="flex-1 mb-4 md:mb-0">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>

                            {/* Event image display if available */}
                            {event.imageUrl && (
                              <div className="mb-3">
                                <img
                                  src={event.imageUrl}
                                  alt={event.title}
                                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                />
                              </div>
                            )}

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
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${event.isPaid ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                              {event.isPaid ? `Paid - $${event.eventFee || 0}` : 'Free'}
                            </span>
                            <span className="text-gray-500 mt-2 text-sm">
                              {event.maxAttendees ? `${event.maxAttendees} max attendees` : 'No limit'}
                            </span>
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
                  <p className="text-gray-500">This club doesn't have any upcoming events at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Club Information */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Club Information</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#6A0DAD]/10 p-2 rounded-lg mr-4">
                    <FaMapMarkerAlt className="text-[#6A0DAD] text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Location</h3>
                    <p className="text-gray-600">{club.location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#6A0DAD]/10 p-2 rounded-lg mr-4">
                    <FaDollarSign className="text-[#6A0DAD] text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Membership Fee</h3>
                    <p className="text-gray-600">
                      {club.membershipFee > 0 ? `$${club.membershipFee}` : 'Free'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#6A0DAD]/10 p-2 rounded-lg mr-4">
                    <FaUsers className="text-[#6A0DAD] text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Category</h3>
                    <p className="text-gray-600">{club.category}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#6A0DAD]/10 p-2 rounded-lg mr-4">
                    <FaClock className="text-[#6A0DAD] text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Status</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${club.status === 'approved' ? 'bg-green-100 text-green-800' :
                      club.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {club.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Manager Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Manager Information</h2>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {club.managerEmail?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Club Manager</h3>
                  <p className="text-gray-600">{club.managerEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClubDetails;