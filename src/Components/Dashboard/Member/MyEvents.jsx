import React, { useState, useEffect } from 'react';
import { eventRegistrationApi } from '../../../api/clubifyApi';
import { useContext } from 'react';
import { AuthContext } from '../../../Contexts/AuthContext';
import { toast } from 'react-toastify';

const MyEvents = () => {
    const { user } = useContext(AuthContext);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchRegistrations();
        }
    }, [user]);

    const fetchRegistrations = async () => {
        try {
            const response = await eventRegistrationApi.getRegistrationsByUser(user.email);
            setRegistrations(response);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            toast.error('Failed to fetch event registrations');
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Events</h1>
                <p className="text-gray-600">Events you've registered for</p>
            </div>

            <div className="space-y-4">
                {registrations.map((registration) => (
                    <div key={registration._id} className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{registration.eventName}</h3>
                                <p className="text-gray-600 mt-1">Club: {registration.clubName}</p>
                                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                                    <span>📅 {new Date(registration.eventDate).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${registration.status === 'registered' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'}`}>
                                    {registration.status}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Registered: {new Date(registration.registeredAt).toLocaleDateString()}
                            </div>
                            <button className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {registrations.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">You haven't registered for any events yet</p>
                    <a
                        href="/availableclubs"
                        className="mt-4 inline-block bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Browse Events
                    </a>
                </div>
            )}
        </div>
    );
};

export default MyEvents;