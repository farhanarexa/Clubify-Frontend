import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSearch, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUserCheck } from 'react-icons/fa';

// Mock data for member's clubs
const mockMemberClubs = [
  { id: 1, name: 'Tech Innovators', description: 'Exploring the latest trends in technology and innovation', location: 'San Francisco, CA', members: 120, events: 8, membershipStatus: 'active', expiryDate: '2024-05-15' },
  { id: 2, name: 'Fitness Enthusiasts', description: 'Stay active and healthy with like-minded individuals', location: 'Los Angeles, CA', members: 210, events: 15, membershipStatus: 'active', expiryDate: '2024-06-20' },
  { id: 3, name: 'Gaming Community', description: 'Connecting gamers around the world', location: 'Online', members: 90, events: 12, membershipStatus: 'active', expiryDate: '2024-03-10' },
  { id: 4, name: 'Book Club Society', description: 'Reading and discussing great books with passionate readers', location: 'Seattle, WA', members: 45, events: 3, membershipStatus: 'active', expiryDate: '2024-04-05' },
  { id: 5, name: 'Photography Masters', description: 'Capture beautiful moments with fellow photographers', location: 'Portland, OR', members: 32, events: 5, membershipStatus: 'expired', expiryDate: '2023-07-10' },
];

// Mock function to fetch member's clubs
const fetchMemberClubs = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockMemberClubs;
};

const MyClubs = () => {
  const { data: clubs, isLoading, isError, error } = useQuery({
    queryKey: ['memberClubs'],
    queryFn: fetchMemberClubs,
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
        <p className="text-red-500">Error loading clubs: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Clubs</h1>
        <p className="text-gray-600">Clubs you've joined and are a member of.</p>
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
              placeholder="Search clubs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
          </div>
          <button className="bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Join New Club
          </button>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs?.map((club) => (
          <div key={club.id} className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
            club.membershipStatus === 'expired' ? 'opacity-70' : ''
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{club.name}</h3>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  club.membershipStatus === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {club.membershipStatus}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{club.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{club.location}</span>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm">
                  <FaUsers className="mr-2" />
                  <span>{club.members} members</span>
                  <span className="mx-2">•</span>
                  <FaCalendarAlt className="mr-2" />
                  <span>{club.events} events</span>
                </div>
                
                {club.membershipStatus === 'active' && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaClock className="mr-2" />
                    <span>Expires: {new Date(club.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <button className="text-[#6A0DAD] hover:text-[#9F62F2] font-medium flex items-center">
                  <FaUserCheck className="mr-1" /> View Details
                </button>
                <button className="text-gray-600 hover:text-gray-800 font-medium">
                  Leave Club
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Membership Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <FaUsers />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Clubs</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{clubs?.length || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mr-4">
              <FaUserCheck />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Memberships</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {clubs?.filter(c => c.membershipStatus === 'active').length || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 mr-4">
              <FaClock />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Expired Memberships</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {clubs?.filter(c => c.membershipStatus === 'expired').length || 0}
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
              <p className="text-gray-500 text-sm">Total Events</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {clubs?.reduce((sum, club) => sum + club.events, 0) || 0}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyClubs;