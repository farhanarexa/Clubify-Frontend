import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { clubApi } from '../api/clubifyApi';
import { AuthContext } from '../Contexts/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const AddClubs = () => {
    const { user } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // In a real app, you'd pass an auth token here
            await clubApi.createClub({
                ...data,
                email: user.email // Pass user's email as the manager email
            }, 'fake-token'); // Replace with actual token

            toast.success('Club created successfully!');
            setTimeout(() => {
                navigate('/'); // Redirect to home after successful creation
            }, 2000);
        } catch (error) {
            console.error('Error creating club:', error);
            toast.error(error.response?.data?.error || 'Failed to create club');
        } finally {
            setLoading(false);
        }
    };

    // Categories for clubs
    const categories = [
        'Technology', 'Arts', 'Health & Fitness', 'Food & Drink',
        'Outdoors', 'Photography', 'Business', 'Music', 'Education',
        'Sports', 'Gaming', 'Travel', 'Volunteering', 'Other'
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-[#FAF8F0] to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Create a New Club
                    </h1>
                    <p className="text-lg text-gray-600">
                        Fill in the details to create your own club
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Club Name */}
                        <div>
                            <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 mb-2">
                                Club Name *
                            </label>
                            <input
                                id="clubName"
                                type="text"
                                {...register('clubName', { required: 'Club name is required' })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] transition-all ${errors.clubName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter club name"
                            />
                            {errors.clubName && (
                                <p className="mt-2 text-sm text-red-600">{errors.clubName.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                {...register('description', { required: 'Description is required' })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] transition-all ${errors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Describe your club"
                            ></textarea>
                            {errors.description && (
                                <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                id="category"
                                {...register('category', { required: 'Category is required' })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] transition-all ${errors.category ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                id="location"
                                type="text"
                                {...register('location', { required: 'Location is required' })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] transition-all ${errors.location ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="City, Country"
                            />
                            {errors.location && (
                                <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>
                            )}
                        </div>

                        {/* Banner Image */}
                        <div>
                            <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 mb-2">
                                Banner Image URL
                            </label>
                            <input
                                id="bannerImage"
                                type="text"
                                {...register('bannerImage')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] transition-all"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* Membership Fee */}
                        <div>
                            <label htmlFor="membershipFee" className="block text-sm font-medium text-gray-700 mb-2">
                                Membership Fee ($)
                            </label>
                            <input
                                id="membershipFee"
                                type="number"
                                min="0"
                                step="0.01"
                                {...register('membershipFee', {
                                    valueAsNumber: true,
                                    validate: value => value >= 0 || 'Fee cannot be negative'
                                })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] transition-all ${errors.membershipFee ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="0.00"
                            />
                            {errors.membershipFee && (
                                <p className="mt-2 text-sm text-red-600">{errors.membershipFee.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white py-3 px-6 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Club...
                                    </div>
                                ) : (
                                    'Create Club'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddClubs;