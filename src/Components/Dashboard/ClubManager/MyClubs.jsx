import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FaSearch, FaPencilAlt, FaTrash, FaPlus, FaImage } from 'react-icons/fa';

// Mock data for clubs
const mockClubs = [
  { id: 1, name: 'Tech Innovators', description: 'Exploring the latest trends in technology and innovation', location: 'San Francisco, CA', membershipFee: 50, category: 'Technology', bannerImage: 'https://via.placeholder.com/300x150', managerEmail: 'john@example.com' },
  { id: 2, name: 'Fitness Enthusiasts', description: 'Stay active and healthy with like-minded individuals', location: 'Los Angeles, CA', membershipFee: 30, category: 'Health & Fitness', bannerImage: 'https://via.placeholder.com/300x150', managerEmail: 'john@example.com' },
  { id: 3, name: 'Gaming Community', description: 'Connecting gamers around the world', location: 'New York, NY', membershipFee: 45, category: 'Entertainment', bannerImage: 'https://via.placeholder.com/300x150', managerEmail: 'john@example.com' },
];

// Mock functions
const fetchMyClubs = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockClubs;
};

const createClub = async (clubData) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return { id: Date.now(), ...clubData, managerEmail: 'current-user@example.com' };
};

const updateClub = async (clubData) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return clubData;
};

const deleteClub = async (id) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return id;
};

const MyClubs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  
  const queryClient = useQueryClient();
  
  const { data: clubs, isLoading, isError, error } = useQuery({
    queryKey: ['myClubs'],
    queryFn: fetchMyClubs,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Form setup
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Create club mutation
  const createMutation = useMutation({
    mutationFn: createClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myClubs'] });
      setIsModalOpen(false);
      reset();
    },
  });

  // Update club mutation
  const updateMutation = useMutation({
    mutationFn: updateClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myClubs'] });
      setIsModalOpen(false);
      setEditingClub(null);
      reset();
    },
  });

  // Delete club mutation
  const deleteMutation = useMutation({
    mutationFn: deleteClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myClubs'] });
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    if (editingClub) {
      updateMutation.mutate({ ...data, id: editingClub.id });
    } else {
      createMutation.mutate(data);
    }
  };

  // Handle edit
  const handleEdit = (club) => {
    setEditingClub(club);
    // Set form values
    Object.keys(club).forEach(key => {
      if (key !== 'id') {
        setValue(key, club[key]);
      }
    });
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this club?')) {
      deleteMutation.mutate(id);
    }
  };

  // Handle add new club
  const handleAddNew = () => {
    setEditingClub(null);
    reset();
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-red-500">Error loading clubs: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Clubs</h1>
        <p className="text-gray-600">Manage your clubs and their details.</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search clubs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <FaPlus />
            <span>Add New Club</span>
          </button>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs?.map((club) => (
          <div key={club.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 bg-gray-200">
              <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center">
                <FaImage className="text-gray-400 text-2xl" />
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{club.name}</h3>
                <span className="bg-[#6A0DAD]/10 text-[#6A0DAD] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {club.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{club.description}</p>
              <div className="flex items-center text-gray-500 mb-4">
                <span className="text-sm">{club.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-gray-700">
                  <span className="font-medium">${club.membershipFee}</span> fee
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(club)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FaPencilAlt />
                  </button>
                  <button 
                    onClick={() => handleDelete(club.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit Club */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingClub ? 'Edit Club' : 'Add New Club'}
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                    <input
                      {...register('name', { required: 'Club name is required' })}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter club name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a category</option>
                      <option value="Technology">Technology</option>
                      <option value="Health & Fitness">Health & Fitness</option>
                      <option value="Arts">Arts</option>
                      <option value="Food & Drink">Food & Drink</option>
                      <option value="Outdoors">Outdoors</option>
                      <option value="Photography">Photography</option>
                      <option value="Business">Business</option>
                      <option value="Entertainment">Entertainment</option>
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your club"
                  ></textarea>
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      {...register('location', { required: 'Location is required' })}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter location"
                    />
                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Membership Fee ($)</label>
                    <input
                      {...register('membershipFee', { 
                        required: 'Membership fee is required',
                        min: { value: 0, message: 'Fee must be at least $0' },
                        valueAsNumber: true
                      })}
                      type="number"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${
                        errors.membershipFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter membership fee"
                    />
                    {errors.membershipFee && <p className="mt-1 text-sm text-red-600">{errors.membershipFee.message}</p>}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image URL</label>
                  <input
                    {...register('bannerImage')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                    placeholder="Enter banner image URL (optional)"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingClub(null);
                      reset();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending ? 'Saving...' : (editingClub ? 'Update Club' : 'Create Club')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClubs;