import React, { useState, useEffect } from 'react';
import { clubApi, membershipApi } from '../../../api/clubifyApi';
import { toast } from 'react-toastify';

const ClubManagerDashboard = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        // In a real app, you'd get the user's email from the auth context
        // For now, using a placeholder
        setUserEmail('manager@example.com'); // Replace with actual email from auth context
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            const response = await clubApi.getClubsByManager('manager@example.com'); // Replace with actual email
            setClubs(response);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            toast.error('Failed to fetch clubs');
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Club Manager Dashboard</h1>
                <p className="text-gray-600">Manage your clubs and members</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs.map((club) => (
                    <div key={club._id} className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{club.clubName}</h3>
                        <p className="text-gray-600 mb-2">{club.description}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                ${club.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                  club.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'}`}>
                                {club.status}
                            </span>
                            <button className="bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                                Manage
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {clubs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    You don't manage any clubs yet
                </div>
            )}
        </div>
    );
};

export default ClubManagerDashboard;