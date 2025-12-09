import React, { useState, useEffect } from 'react';
import { clubApi, membershipApi } from '../api/clubifyApi';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';
import { Link } from 'react-router';

const AvailableClubs = () => {
    const { user } = useContext(AuthContext);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [userMemberships, setUserMemberships] = useState([]);

    // Categories for filtering
    const categories = [
        'All', 'Technology', 'Arts', 'Health & Fitness', 'Food & Drink',
        'Outdoors', 'Photography', 'Business', 'Music', 'Education',
        'Sports', 'Gaming', 'Travel', 'Volunteering', 'Other'
    ];

    useEffect(() => {
        fetchClubs();
        if (user) {
            fetchUserMemberships();
        }
    }, [sortBy, sortOrder]);

    const fetchClubs = async () => {
        try {
            const response = await clubApi.getAllClubs(); // Get approved clubs only
            setClubs(response);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            toast.error('Failed to fetch clubs');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserMemberships = async () => {
        if (user) {
            try {
                const response = await membershipApi.getMembershipsByUser(user.email);
                setUserMemberships(response);
            } catch (error) {
                console.error('Error fetching user memberships:', error);
                // We can continue without memberships, just can't show join status
            }
        }
    };

    const handleJoinClub = async (clubId, membershipFee) => {
        if (!user) {
            toast.error('Please log in to join a club');
            return;
        }

        try {
            if (membershipFee > 0) {
                // In a real app, you would redirect to a payment page here
                toast.info(`Please proceed to payment for $${membershipFee}`);
                // For now, just show a message - in real app you'd redirect to payment
            } else {
                // Free membership - create directly
                await membershipApi.createMembership({
                    userEmail: user.email,
                    clubId: clubId
                }, 'fake-token'); // In real app, pass actual auth token

                toast.success('Successfully joined the club!');
                fetchUserMemberships(); // Refresh user's memberships
            }
        } catch (error) {
            console.error('Error joining club:', error);
            toast.error(error.response?.data?.error || 'Failed to join club');
        }
    };

    // Filter and sort clubs
    let filteredClubs = clubs.filter(club => {
        const matchesSearch = club.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             club.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || club.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort clubs
    filteredClubs.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-[#FAF8F0] to-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FAF8F0] to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Discover Clubs
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Find and join clubs that match your interests and hobbies
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Search */}
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                Search Clubs
                            </label>
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, description, or location..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                id="category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category === 'All' ? '' : category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                                Sort By
                            </label>
                            <div className="flex space-x-2">
                                <select
                                    id="sort"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                                >
                                    <option value="clubName">Name</option>
                                    <option value="membershipFee">Membership Fee</option>
                                    <option value="createdAt">Newest</option>
                                    <option value="location">Location</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-4 py-3 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#9F62F2] transition-colors"
                                >
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clubs Grid */}
                {filteredClubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredClubs.map((club) => {
                            const isMember = userMemberships.some(m => m.clubId && m.clubId.toString() === club._id.toString());

                            return (
                                <div key={club._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    <div className="h-48 overflow-hidden">
                                        {club.bannerImage ? (
                                            <img
                                                src={club.bannerImage}
                                                alt={club.clubName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center">
                                                <span className="text-gray-500">Club Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <Link
                                                to={`/clubs/${club._id}`}
                                                className="text-xl font-bold text-gray-800 hover:text-[#6A0DAD] transition-colors"
                                            >
                                                {club.clubName}
                                            </Link>
                                            <span className="bg-[#6A0DAD]/10 text-[#6A0DAD] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                {club.category}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{club.description}</p>
                                        <div className="flex items-center text-gray-500 mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{club.location}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-gray-700">
                                                Fee: ${club.membershipFee || 0}
                                                {club.membershipFee > 0 && <span className="text-xs text-red-500 ml-1">(Paid)</span>}
                                            </div>
                                            <button
                                                onClick={() => handleJoinClub(club._id, club.membershipFee)}
                                                disabled={isMember}
                                                className={`px-4 py-2 rounded-lg font-medium ${
                                                    isMember
                                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white hover:opacity-90 transition-opacity'
                                                }`}
                                            >
                                                {isMember ? 'Joined' : club.membershipFee > 0 ? 'Join ($)' : 'Join Free'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-700">No clubs found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {clubs.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-700">No clubs available yet</h3>
                        <p className="text-gray-500 mt-2">Check back later for new clubs</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvailableClubs;