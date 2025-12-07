import React, { useState, useEffect } from 'react';
import { clubApi } from '../../../api/clubifyApi';
import { toast } from 'react-toastify';

const ManageClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            // In a real app, you'd pass an auth token here
            const response = await clubApi.getAllClubs(true); // Get all clubs including pending
            setClubs(response);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            toast.error('Failed to fetch clubs');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (clubId, newStatus) => {
        try {
            // In a real app, you'd pass an auth token here
            await clubApi.updateClubStatus(clubId, newStatus, 'fake-token'); // Replace with actual token
            toast.success(`Club status updated to ${newStatus}`);
            
            // Update the UI
            setClubs(prevClubs => 
                prevClubs.map(club => 
                    club._id === clubId ? { ...club, status: newStatus } : club
                )
            );
        } catch (error) {
            console.error('Error updating club status:', error);
            toast.error('Failed to update club status');
        }
    };

    // Filter clubs based on search term and selected status
    const filteredClubs = clubs.filter(club => {
        const matchesSearch = club.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             club.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !selectedStatus || club.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Clubs</h1>
                <p className="text-gray-600">View and manage all platform clubs</p>
            </div>

            {/* Controls */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search clubs by name or location..."
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
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredClubs.map((club) => (
                                <tr key={club._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{club.clubName}</div>
                                        <div className="text-sm text-gray-500">{club.location}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {club.managerEmail}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {club.category}
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
                                        <select
                                            className="border border-gray-300 rounded px-2 py-1"
                                            value={club.status}
                                            onChange={(e) => handleStatusChange(club._id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
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
    );
};

export default ManageClubs;