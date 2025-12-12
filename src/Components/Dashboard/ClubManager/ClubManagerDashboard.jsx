import React, { useState, useEffect, useContext } from 'react';
import { clubApi, membershipApi, eventApi, paymentApi } from '../../../api/clubifyApi';
import { AuthContext } from '../../../Contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaUsers, FaCalendarAlt, FaBuilding, FaMoneyBillWave } from 'react-icons/fa';

const ClubManagerDashboard = () => {
    const [clubs, setClubs] = useState([]);
    const [stats, setStats] = useState({
        totalClubs: 0,
        totalMembers: 0,
        totalEvents: 0,
        totalPayments: 0
    });
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            // Fetch clubs managed by the user
            const clubsData = await clubApi.getClubsByManager(user.email);

            // Calculate club IDs to fetch related data
            const clubIds = clubsData.map(club => club._id);

            // Set initial stats
            setStats({
                totalClubs: clubsData.length,
                totalMembers: 0,
                totalEvents: 0,
                totalPayments: 0
            });

            // Fetch additional data in parallel
            if (clubIds.length > 0) {
                const membershipPromises = clubIds.map(clubId =>
                    membershipApi.getMembershipsByClub(clubId)
                );

                const eventPromises = clubIds.map(clubId =>
                    eventApi.getEventsByClub(clubId)
                );

                const paymentPromises = clubIds.map(clubId =>
                    paymentApi.getPaymentsByClub(clubId)
                );

                const [membershipsArrays, eventsArrays, paymentsArrays] = await Promise.all([
                    Promise.all(membershipPromises),
                    Promise.all(eventPromises),
                    Promise.all(paymentPromises)
                ]);

                // Calculate member counts for each club and update club data
                const clubsWithMemberCounts = clubsData.map((club, index) => {
                    const clubMembers = membershipsArrays[index] || [];
                    const activeMembers = clubMembers.filter(m => m.status === 'active').length;
                    return {
                        ...club,
                        memberCount: activeMembers
                    };
                });

                setClubs(clubsWithMemberCounts);

                // Calculate totals
                const totalMembers = membershipsArrays.flat().filter(m => m.status === 'active').length;
                const totalEvents = eventsArrays.flat().length;
                const totalPayments = paymentsArrays.flat().reduce((sum, payment) =>
                    payment.status === 'completed' ? sum + parseFloat(payment.amount) : sum, 0
                );

                setStats({
                    totalClubs: clubsData.length,
                    totalMembers: totalMembers,
                    totalEvents: totalEvents,
                    totalPayments: totalPayments
                });
            } else {
                setClubs(clubsData);
            }
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
        <div className="min-h-screen bg-[#FAF8F0] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        Welcome, {user?.name || user?.email?.split('@')[0]}! 👋
                    </h1>
                    <p className="text-lg text-gray-600">Manage your clubs and track performance</p>
                </div>

                {/* Stats Section - Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#6A0DAD]">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Clubs Managed</h3>
                        <p className="text-3xl font-bold text-[#6A0DAD]">{stats.totalClubs}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FaBuilding className="mr-1" />
                            <span>Number of clubs you manage</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#9F62F2]">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Members</h3>
                        <p className="text-3xl font-bold text-[#9F62F2]">{stats.totalMembers}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FaUsers className="mr-1" />
                            <span>Active members across all clubs</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#4CAF50]">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Events</h3>
                        <p className="text-3xl font-bold text-[#4CAF50]">{stats.totalEvents}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="mr-1" />
                            <span>Events organized by your clubs</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#2196F3]">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Payments</h3>
                        <p className="text-3xl font-bold text-[#2196F3]">${stats.totalPayments.toFixed(2)}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FaMoneyBillWave className="mr-1" />
                            <span>Revenue from your clubs</span>
                        </div>
                    </div>
                </div>

                {/* Managed Clubs Section */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Your Clubs</h2>
                        <span className="text-gray-600">{clubs.length} club{clubs.length !== 1 ? 's' : ''}</span>
                    </div>

                    {clubs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clubs.map((club) => (
                                <div key={club._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{club.clubName}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{club.description}</p>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Status:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                ${club.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    club.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {club.status}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Created:</span>
                                            <span>{new Date(club.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center">
                                        <a
                                            href={`/dashboard/manager/clubs/${club._id}`}
                                            className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm text-center"
                                        >
                                            Manage Club
                                        </a>
                                        <span className="text-xs text-gray-500">
                                            {club.memberCount || 0} members
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            You don't manage any clubs yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClubManagerDashboard;