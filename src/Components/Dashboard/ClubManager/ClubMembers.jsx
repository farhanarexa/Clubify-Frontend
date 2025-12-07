import React, { useState, useEffect } from 'react';
import { membershipApi } from '../../../api/clubifyApi';
import { clubApi } from '../../../api/clubifyApi';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../../../Contexts/AuthContext';

const ClubMembers = () => {
    const { user } = useContext(AuthContext);
    const [memberships, setMemberships] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClub, setSelectedClub] = useState('');

    useEffect(() => {
        if (user) {
            fetchClubs();
        }
    }, [user]);

    const fetchClubs = async () => {
        try {
            const userClubs = await clubApi.getClubsByManager(user.email);
            setClubs(userClubs);
            
            if (userClubs.length > 0) {
                // Fetch memberships for the first club by default
                await fetchMemberships(userClubs[0]._id);
                setSelectedClub(userClubs[0]._id);
            }
        } catch (error) {
            console.error('Error fetching clubs:', error);
            toast.error('Failed to fetch clubs');
        } finally {
            setLoading(false);
        }
    };

    const fetchMemberships = async (clubId) => {
        try {
            const response = await membershipApi.getMembershipsByClub(clubId);
            setMemberships(response);
        } catch (error) {
            console.error('Error fetching memberships:', error);
            toast.error('Failed to fetch memberships');
        }
    };

    const handleClubChange = (e) => {
        const clubId = e.target.value;
        setSelectedClub(clubId);
        fetchMemberships(clubId);
    };

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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Club Members</h1>
                <p className="text-gray-600">View and manage your club members</p>
            </div>

            {/* Club Selection */}
            <div className="mb-6">
                <label htmlFor="clubSelect" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Club
                </label>
                <select
                    id="clubSelect"
                    value={selectedClub}
                    onChange={handleClubChange}
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                >
                    {clubs.map((club) => (
                        <option key={club._id} value={club._id}>
                            {club.clubName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {memberships.map((membership) => (
                                <tr key={membership._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full" src={membership.userPhoto || 'https://via.placeholder.com/40'} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{membership.userName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {membership.userEmail}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(membership.joinedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${membership.status === 'active' ? 'bg-green-100 text-green-800' : 
                                              membership.status === 'expired' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-red-100 text-red-800'}`}>
                                            {membership.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select
                                            className="border border-gray-300 rounded px-2 py-1"
                                            value={membership.status}
                                            onChange={(e) => {
                                                // In a real app, you'd call an API to update membership status
                                                console.log('Update membership status to:', e.target.value);
                                            }}
                                        >
                                            <option value="active">Active</option>
                                            <option value="expired">Expired</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {memberships.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No members found for this club
                </div>
            )}
        </div>
    );
};

export default ClubMembers;