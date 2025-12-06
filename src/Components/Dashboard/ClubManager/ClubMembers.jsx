import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSearch, FaUser, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';

// Mock data for club members
const mockMembers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', clubId: 1, joinDate: '2023-05-15', membershipStatus: 'active', expiryDate: '2024-05-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', clubId: 1, joinDate: '2023-06-20', membershipStatus: 'active', expiryDate: '2024-06-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', clubId: 1, joinDate: '2023-07-10', membershipStatus: 'expired', expiryDate: '2023-07-10' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', clubId: 2, joinDate: '2023-08-05', membershipStatus: 'active', expiryDate: '2024-08-05' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', clubId: 2, joinDate: '2023-09-12', membershipStatus: 'active', expiryDate: '2024-09-12' },
  { id: 6, name: 'Diana Prince', email: 'diana@example.com', clubId: 3, joinDate: '2023-10-18', membershipStatus: 'active', expiryDate: '2024-10-18' },
  { id: 7, name: 'Ethan Hunt', email: 'ethan@example.com', clubId: 3, joinDate: '2023-11-30', membershipStatus: 'active', expiryDate: '2024-11-30' },
  { id: 8, name: 'Fiona Green', email: 'fiona@example.com', clubId: 1, joinDate: '2023-12-05', membershipStatus: 'active', expiryDate: '2024-12-05' },
];

// Mock function to fetch club members
const fetchClubMembers = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockMembers;
};

const ClubMembers = () => {
  const [selectedClub, setSelectedClub] = useState(1);
  
  const { data: members, isLoading, isError, error } = useQuery({
    queryKey: ['clubMembers', selectedClub],
    queryFn: fetchClubMembers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter members based on selected club
  const filteredMembers = members?.filter(member => member.clubId === selectedClub) || [];

  // Function to set membership status as expired
  const setMembershipExpired = async (memberId) => {
    console.log(`Setting membership expired for member ${memberId}`);
    // In a real app, this would be an API call
  };

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
        <p className="text-red-500">Error loading members: {error.message}</p>
      </div>
    );
  }

  // Get unique clubs from members data
  const uniqueClubs = [...new Set(members?.map(member => member.clubId))].map(clubId => {
    const member = members?.find(m => m.clubId === clubId);
    return { id: clubId, name: `Club ${clubId}` }; // In a real app, you'd fetch club names
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Club Members</h1>
        <p className="text-gray-600">Manage members for your clubs.</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Club</label>
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            >
              {uniqueClubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.membershipStatus === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.membershipStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {member.membershipStatus === 'active' && (
                      <button 
                        onClick={() => setMembershipExpired(member.id)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <FaTimes className="mr-1" /> Set Expired
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Membership Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <FaUser />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Members</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{filteredMembers.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mr-4">
              <FaCheck />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Members</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {filteredMembers.filter(m => m.membershipStatus === 'active').length}
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
              <p className="text-gray-500 text-sm">Expired Members</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {filteredMembers.filter(m => m.membershipStatus === 'expired').length}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubMembers;