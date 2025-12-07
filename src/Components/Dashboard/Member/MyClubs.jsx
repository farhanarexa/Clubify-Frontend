import React, { useState, useEffect } from 'react';
import { membershipApi } from '../../../api/clubifyApi';
import { useContext } from 'react';
import { AuthContext } from '../../../Contexts/AuthContext';
import { toast } from 'react-toastify';

const MemberMyClubs = () => {
    const { user } = useContext(AuthContext);
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchMemberships();
        }
    }, [user]);

    const fetchMemberships = async () => {
        try {
            const response = await membershipApi.getMembershipsByUser(user.email);
            setMemberships(response);
        } catch (error) {
            console.error('Error fetching memberships:', error);
            toast.error('Failed to fetch memberships');
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Clubs</h1>
                <p className="text-gray-600">Clubs you've joined</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memberships.map((membership) => (
                    <div key={membership._id} className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{membership.clubName}</h3>
                        <p className="text-gray-600 mb-2 line-clamp-2">{membership.description}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                ${membership.status === 'active' ? 'bg-green-100 text-green-800' : 
                                  'bg-yellow-100 text-yellow-800'}`}>
                                {membership.status}
                            </span>
                            <div className="text-sm text-gray-600">
                                Fee: ${membership.membershipFee || 0}
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Joined:</span>
                                <span className="font-medium">{new Date(membership.joinedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                            View Details
                        </button>
                    </div>
                ))}
            </div>

            {memberships.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">You haven't joined any clubs yet</p>
                    <a 
                        href="/availableclubs" 
                        className="mt-4 inline-block bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Browse Clubs
                    </a>
                </div>
            )}
        </div>
    );
};

export default MemberMyClubs;