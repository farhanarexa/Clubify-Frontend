import React, { useState, useEffect } from 'react';
// import { membershipApi, eventRegistrationApi } from '../../api/clubifyApi';
import { membershipApi, eventRegistrationApi } from '../../../api/clubifyApi';
import { toast } from 'react-toastify';

const MemberDashboard = () => {
    const [memberships, setMemberships] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // In a real app, you'd get the user's email from the auth context
            const userEmail = 'member@example.com'; // Replace with actual email from auth context
            
            const [membershipsData, registrationsData] = await Promise.all([
                membershipApi.getMembershipsByUser(userEmail), // Replace with actual email
                eventRegistrationApi.getRegistrationsByUser(userEmail) // Replace with actual email
            ]);
            
            setMemberships(membershipsData);
            setRegistrations(registrationsData);
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
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Member Dashboard</h1>
                <p className="text-gray-600">Your clubs and events</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* My Clubs */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">My Clubs</h2>
                    <div className="space-y-4">
                        {memberships.slice(0, 3).map((membership) => (
                            <div key={membership._id} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800">{membership.clubName}</h3>
                                <p className="text-gray-600 text-sm">{membership.description}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                        ${membership.status === 'active' ? 'bg-green-100 text-green-800' : 
                                          'bg-yellow-100 text-yellow-800'}`}>
                                        {membership.status}
                                    </span>
                                    <span className="text-xs text-gray-500">{membership.joinedAt?.substring(0, 10)}</span>
                                </div>
                            </div>
                        ))}
                        {memberships.length === 0 && (
                            <p className="text-gray-500 text-center py-4">You haven't joined any clubs yet</p>
                        )}
                    </div>
                </div>

                {/* My Events */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">My Events</h2>
                    <div className="space-y-4">
                        {registrations.slice(0, 3).map((registration) => (
                            <div key={registration._id} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800">{registration.eventName}</h3>
                                <p className="text-gray-600 text-sm">Club: {registration.clubName}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                        ${registration.status === 'registered' ? 'bg-green-100 text-green-800' : 
                                          'bg-red-100 text-red-800'}`}>
                                        {registration.status}
                                    </span>
                                    <span className="text-xs text-gray-500">{registration.registeredAt?.substring(0, 10)}</span>
                                </div>
                            </div>
                        ))}
                        {registrations.length === 0 && (
                            <p className="text-gray-500 text-center py-4">You haven't registered for any events yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;