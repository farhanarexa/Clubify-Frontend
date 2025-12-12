import React, { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';
import { FaUser, FaEnvelope, FaUserTag, FaCalendarAlt } from 'react-icons/fa';

const Profile = () => {
  const { user } = useContext(AuthContext);

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

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FAF8F0] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
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
        </div>
      </div>
    </div>
  );
};

export default Profile;