import React, { useState, useEffect } from 'react';
import { clubApi } from '../../../api/clubifyApi';
import { membershipApi } from '../../../api/clubifyApi';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../../../Contexts/AuthContext';

const MyClubs = () => {
    const { user } = useContext(AuthContext);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingClub, setEditingClub] = useState(null);
    const [formData, setFormData] = useState({
        clubName: '',
        description: '',
        category: '',
        location: '',
        bannerImage: '',
        membershipFee: 0
    });

    const categories = [
        'Technology', 'Arts', 'Health & Fitness', 'Food & Drink',
        'Outdoors', 'Photography', 'Business', 'Music', 'Education',
        'Sports', 'Gaming', 'Travel', 'Volunteering', 'Other'
    ];

    useEffect(() => {
        if (user) {
            fetchClubs();
        }
    }, [user]);

    const fetchClubs = async () => {
        try {
            const response = await clubApi.getClubsByManager(user.email);
            // Add member counts to each club
            const clubsWithMemberCounts = await Promise.all(
                response.map(async (club) => {
                    try {
                        const members = await membershipApi.getMembershipsByClub(club._id);
                        const activeMembers = members.filter(m => m.status === 'active').length;
                        return { ...club, memberCount: activeMembers };
                    } catch (error) {
                        console.error(`Error fetching members for club ${club._id}:`, error);
                        return { ...club, memberCount: 0 };
                    }
                })
            );
            setClubs(clubsWithMemberCounts);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            toast.error('Failed to fetch clubs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingClub) {
                // Update existing club
                await clubApi.updateClub(editingClub._id, formData);
                toast.success('Club updated successfully!');
                setEditingClub(null);
            } else {
                // Create new club
                await clubApi.createClub({
                    ...formData,
                    email: user.email
                });
                toast.success('Club created successfully!');
                setShowForm(false);
            }

            setFormData({
                clubName: '',
                description: '',
                category: '',
                location: '',
                bannerImage: '',
                membershipFee: 0
            });
            fetchClubs(); // Refresh the list
        } catch (error) {
            console.error('Error submitting club:', error);
            toast.error(error.response?.data?.error || 'Failed to submit club');
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEditClub = (club) => {
        setEditingClub(club);
        setFormData({
            clubName: club.clubName || '',
            description: club.description || '',
            category: club.category || '',
            location: club.location || '',
            bannerImage: club.bannerImage || '',
            membershipFee: club.membershipFee || 0
        });
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingClub(null);
        setFormData({
            clubName: '',
            description: '',
            category: '',
            location: '',
            bannerImage: '',
            membershipFee: 0
        });
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
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Clubs</h1>
                        <p className="text-gray-600">Manage your clubs</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingClub(null);
                            setShowForm(!showForm);
                        }}
                        className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        {showForm ? 'Cancel' : '+ Add New Club'}
                    </button>
                </div>
            </div>

            {/* Add/Edit Club Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {editingClub ? `Edit Club: ${editingClub.clubName}` : 'Create New Club'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Club Name *</label>
                                <input
                                    type="text"
                                    name="clubName"
                                    value={formData.clubName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                                    placeholder="Club name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                                placeholder="Describe your club"
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                                    placeholder="City, Country"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Membership Fee ($)</label>
                                <input
                                    type="number"
                                    name="membershipFee"
                                    value={formData.membershipFee}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image URL</label>
                            <input
                                type="text"
                                name="bannerImage"
                                value={formData.bannerImage}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
                            >
                                {editingClub ? 'Update Club' : 'Create Club'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelForm}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Clubs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs.map((club) => (
                    <div key={club._id} className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{club.clubName}</h3>
                        <p className="text-gray-600 mb-2 line-clamp-2">{club.description}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                ${club.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    club.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'}`}>
                                {club.status}
                            </span>
                            <div className="text-sm text-gray-600">
                                ${club.membershipFee} {club.membershipFee > 0 ? 'fee' : 'free'}
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Members:</span>
                                <span className="font-medium">{club.memberCount}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => handleEditClub(club)}
                                className="flex-1 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Edit
                            </button>
                            <a
                                href={`/dashboard/manager/clubs/${club._id}`}
                                className="flex-1 border border-[#6A0DAD] text-[#6A0DAD] px-4 py-2 rounded-lg hover:bg-[#6A0DAD]/10 transition-colors text-center flex items-center justify-center"
                            >
                                Manage
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {clubs.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">You don't manage any clubs yet</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-4 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Create Your First Club
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyClubs;