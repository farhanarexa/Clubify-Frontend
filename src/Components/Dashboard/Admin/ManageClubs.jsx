import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubApi } from '../../../api/clubifyApi';
import { toast } from 'react-toastify';

const ManageClubs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const queryClient = useQueryClient();

  // Fetch all clubs
  const { data: clubs, isLoading, error } = useQuery({
    queryKey: ['allClubs'],
    queryFn: () => clubApi.getClubsByStatus('all'),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Update club status mutation
  const updateClubStatusMutation = useMutation({
    mutationFn: ({ clubId, status }) => clubApi.updateClubStatus(clubId, status),
    onSuccess: () => {
      toast.success('Club status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['allClubs'] });
    },
    onError: (error) => {
      console.error('Error updating club status:', error);
      toast.error('Failed to update club status');
    },
  });

  const handleStatusChange = async (clubId, newStatus) => {
    updateClubStatusMutation.mutate({ clubId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading clubs: {error.message}</p>
      </div>
    );
  }

  // Filter clubs based on search term and selected status
  const filteredClubs = clubs?.filter(club => {
    const matchesSearch = club.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.managerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || club.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="min-h-screen bg-[#FAF8F0] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Manage Clubs
          </h1>
          <p className="text-lg text-gray-600">View and manage all clubs in the system</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search clubs by name or manager email..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Clubs Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClubs.map((club) => (
                  <tr key={club._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{club.clubName}</div>
                      <div className="text-sm text-gray-500">{club.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{club.managerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${club.status === 'approved' ? 'bg-green-100 text-green-800' :
                          club.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {club.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {club.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${club.membershipFee || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(club.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        className="border border-gray-300 rounded px-2 py-1"
                        value={club.status}
                        onChange={(e) => handleStatusChange(club._id, e.target.value)}
                        disabled={updateClubStatusMutation.isPending}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No clubs found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClubs;