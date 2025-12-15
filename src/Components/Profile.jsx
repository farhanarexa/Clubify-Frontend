import React, { useContext, useState } from 'react';
import { AuthContext } from '../Contexts/AuthContext';
import { userApi } from '../api/clubifyApi';
import { FaUser, FaEnvelope, FaUserTag, FaCalendarAlt, FaCamera, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Profile = () => {
  const authContext = useContext(AuthContext);
  const { user, loading, refreshUserData } = authContext;
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [newPhotoURL, setNewPhotoURL] = useState(user?.photoURL || '');
  const [previewImage, setPreviewImage] = useState(user?.photoURL || '');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#FAF8F0] to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setNewPhotoURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!newName.trim() && !newPhotoURL) {
      toast.error('Please provide at least a name or image');
      return;
    }

    setIsUpdating(true);
    try {
      const profileData = {};
      if (newName.trim() !== user?.name) {
        profileData.name = newName.trim();
      }
      if (newPhotoURL !== user?.photoURL) {
        profileData.photoURL = newPhotoURL;
      }

      if (Object.keys(profileData).length === 0) {
        toast.info('No changes to save');
        setIsEditing(false);
        return;
      }

      await userApi.updateUserProfile(user.email, profileData);
      toast.success('Profile updated successfully!');

      // Refresh user data to update the context with the new values
      if (refreshUserData) {
        await refreshUserData();
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewName(user.name || '');
    setNewPhotoURL(user.photoURL || '');
    setPreviewImage(user.photoURL || '');
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FAF8F0] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            {isEditing ? (
              // Edit Mode
              <div className="space-y-6">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] flex items-center justify-center text-white text-3xl mb-4">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile Preview"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl">
                          {newName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-[#6A0DAD] text-white p-2 rounded-full cursor-pointer hover:bg-[#5a0b9d] transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <FaCamera />
                    </label>
                  </div>

                  <div className="w-full max-w-xs mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div className="flex justify-center space-x-4 pt-4">
                  <button
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="px-6 py-2 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-6">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] flex items-center justify-center text-white text-3xl mb-4">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">
                        {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{user.name || 'User'}</h2>
                  <p className="text-gray-600 mt-1">{user.email}</p>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 flex items-center px-4 py-2 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    <FaEdit className="mr-2" /> Edit Profile
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaUser className="text-[#6A0DAD] text-xl mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{user.name || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-[#6A0DAD] text-xl mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaUserTag className="text-[#6A0DAD] text-xl mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium capitalize">{user.role || 'member'}</p>
                    </div>
                  </div>

                  {user.createdAt && (
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <FaCalendarAlt className="text-[#6A0DAD] text-xl mr-4" />
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
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

export default Profile;