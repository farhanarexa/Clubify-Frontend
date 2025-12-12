import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { clubApi, membershipApi, eventApi, paymentApi } from '../../../api/clubifyApi';
import { AuthContext } from '../../../Contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaUsers, FaCalendarAlt, FaMoneyBillWave, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const ClubDetails = () => {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [club, setClub] = useState(null);
    const [members, setMembers] = useState([]);
    const [events, setEvents] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showEditForm, setShowEditForm] = useState(false);
    const [editFormData, setEditFormData] = useState({
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
        if (clubId && user) {
            fetchClubDetails();
        }
    }, [clubId, user]);

    const fetchClubDetails = async () => {
        try {
            setLoading(true);

            // Fetch club details, members, events, and payments
            const [clubData, membersData, eventsData, paymentsData] = await Promise.all([
                clubApi.getClubsByManager(user.email).then(clubs => clubs.find(c => c._id === clubId)),
                membershipApi.getMembershipsByClub(clubId),
                eventApi.getEventsByClub(clubId),
                paymentApi.getPaymentsByClub(clubId)
            ]);

            if (!clubData) {
                toast.error('Club not found or you do not have permission to access it.');
                navigate('/dashboard/manager/clubs');
                return;
            }

            setClub(clubData);
            setMembers(membersData.filter(member => member.status === 'active'));
            setEvents(eventsData);
            setPayments(paymentsData);
            setEditFormData({
                clubName: clubData.clubName || '',
                description: clubData.description || '',
                category: clubData.category || '',
                location: clubData.location || '',
                bannerImage: clubData.bannerImage || '',
                membershipFee: clubData.membershipFee || 0
            });
        } catch (error) {
            console.error('Error fetching club details:', error);
            toast.error('Failed to fetch club details');
            navigate('/dashboard/manager/clubs');
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await clubApi.updateClub(clubId, editFormData);
            toast.success('Club updated successfully!');
            setShowEditForm(false);
            fetchClubDetails(); // Refresh data
        } catch (error) {
            console.error('Error updating club:', error);
            toast.error('Failed to update club');
        }
    };

    const handleInputChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
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
        <div className="min-h-screen bg-[#FAF8F0] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard/manager/clubs')}
                    className="mb-6 flex items-center text-[#6A0DAD] hover:text-[#9F62F2] transition-colors"
                >
                    ← Back to My Clubs
                </button>

                {/* Club Header */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{club.clubName}</h1>
                            <p className="text-gray-600 mt-2">{club.description}</p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <span className="px-3 py-1 bg-[#6A0DAD]/10 text-[#6A0DAD] rounded-full text-sm">
                                    {club.status}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    {club.category}
                                </span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {club.location}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowEditForm(!showEditForm)}
                            className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center"
                        >
                            <FaEdit className="mr-2" /> {showEditForm ? 'Cancel' : 'Edit Club'}
                        </button>
                    </div>
                </div>

                {/* Edit Form */}
                {showEditForm && (
                    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Club Details</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Club Name *</label>
                                    <input
                                        type="text"
                                        name="clubName"
                                        value={editFormData.clubName}
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
                                        value={editFormData.category}
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
                                    value={editFormData.description}
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
                                        value={editFormData.location}
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
                                        value={editFormData.membershipFee}
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
                                    value={editFormData.bannerImage}
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
                                    Update Club
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditForm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-md mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: 'Overview', icon: <FaUsers /> },
                                { id: 'members', label: 'Members', icon: <FaUsers /> },
                                { id: 'events', label: 'Events', icon: <FaCalendarAlt /> },
                                { id: 'payments', label: 'Payments', icon: <FaMoneyBillWave /> }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 flex items-center text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                            ? 'border-[#6A0DAD] text-[#6A0DAD]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Members</h3>
                                        <p className="text-3xl font-bold text-[#6A0DAD]">{members.length}</p>
                                        <p className="text-sm text-gray-600">Active members</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Events</h3>
                                        <p className="text-3xl font-bold text-[#9F62F2]">{events.length}</p>
                                        <p className="text-sm text-gray-600">Total events</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Revenue</h3>
                                        <p className="text-3xl font-bold text-[#4CAF50]">
                                            ${payments
                                                .filter(p => p.status === 'completed')
                                                .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
                                                .toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-600">Total payments</p>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Members</h3>
                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        {members.slice(0, 5).map((member, index) => (
                                            <div
                                                key={member._id}
                                                className={`flex items-center p-4 ${index !== members.slice(0, 5).length - 1 ? 'border-b border-gray-200' : ''}`}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] flex items-center justify-center text-white font-bold mr-4">
                                                    {member.userEmail?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800">{member.userEmail}</p>
                                                    <p className="text-sm text-gray-600">Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
                                                </div>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                    {member.status}
                                                </span>
                                            </div>
                                        ))}
                                        {members.length === 0 && (
                                            <div className="p-4 text-center text-gray-500">
                                                No members yet
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Events</h3>
                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        {events.slice(0, 3).map((event, index) => (
                                            <div
                                                key={event._id}
                                                className={`p-4 ${index !== events.slice(0, 3).length - 1 ? 'border-b border-gray-200' : ''}`}
                                            >
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">{event.title}</h4>
                                                        <p className="text-sm text-gray-600">{new Date(event.eventDate).toLocaleString()}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${event.isPaid ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {event.isPaid ? `$${event.eventFee}` : 'Free'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {events.length === 0 && (
                                            <div className="p-4 text-center text-gray-500">
                                                No events yet
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'members' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">Members ({members.length})</h3>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    {members.map((member, index) => (
                                        <div
                                            key={member._id}
                                            className={`flex items-center p-4 ${index !== members.length - 1 ? 'border-b border-gray-200' : ''}`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] flex items-center justify-center text-white font-bold mr-4">
                                                {member.userEmail?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{member.userEmail}</p>
                                                <p className="text-sm text-gray-600">Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                {member.status}
                                            </span>
                                        </div>
                                    ))}
                                    {members.length === 0 && (
                                        <div className="p-4 text-center text-gray-500">
                                            No members yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'events' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">Events ({events.length})</h3>
                                    <button
                                        onClick={() => navigate('/dashboard/manager/events')}
                                        className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center"
                                    >
                                        <FaPlus className="mr-2" /> Create Event
                                    </button>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    {events.map((event, index) => (
                                        <div
                                            key={event._id}
                                            className={`p-4 ${index !== events.length - 1 ? 'border-b border-gray-200' : ''}`}
                                        >
                                            <div className="flex justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                                        <span className="flex items-center">
                                                            <FaCalendarAlt className="mr-1" />
                                                            {new Date(event.eventDate).toLocaleString()}
                                                        </span>
                                                        <span>{event.location}</span>
                                                        <span className={event.isPaid ? 'text-red-600' : 'text-green-600'}>
                                                            {event.isPaid ? `$${event.eventFee}` : 'Free'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                        {event.maxAttendees || 'Unlimited'} max
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {events.length === 0 && (
                                        <div className="p-4 text-center text-gray-500">
                                            No events yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'payments' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">Payments</h3>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    {payments.map((payment, index) => (
                                        <div
                                            key={payment._id}
                                            className={`p-4 ${index !== payments.length - 1 ? 'border-b border-gray-200' : ''}`}
                                        >
                                            <div className="flex justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center">
                                                        <p className="font-medium text-gray-800">{payment.userEmail}</p>
                                                        <span className={`ml-4 px-2 py-1 rounded-full text-xs font-semibold
                                                            ${payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                                        'bg-blue-100 text-blue-800'}`}>
                                                            {payment.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {payment.type} - {payment.clubName || payment.eventName}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-800">${payment.amount}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(payment.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {payments.length === 0 && (
                                        <div className="p-4 text-center text-gray-500">
                                            No payments yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubDetails;