import React from 'react';
import { Link } from 'react-router';
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#FAF8F0] to-white flex items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-linear-to-r from-[#A45CFF] to-[#7ED8FF] w-24 h-24 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-white text-5xl" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-4">
            4<span className="text-[#A45CFF]">0</span>4
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            Oops! Page Not Found
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            The page you're looking for doesn't exist or may have been moved. Don't worry,
            you can find your way back to our community hub.
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">What you can do:</h3>
            <ul className="space-y-3 text-gray-600 text-left max-w-md mx-auto">
              <li className="flex items-center">
                <FaSearch className="text-[#A45CFF] mr-3" /> Check the URL for typos
              </li>
              <li className="flex items-center">
                <FaHome className="text-[#A45CFF] mr-3" /> Return to the homepage
              </li>
              <li className="flex items-center">
                <FaExclamationTriangle className="text-[#A45CFF] mr-3" /> Navigate to clubs or events
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/"
              className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white py-3 px-8 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center"
            >
              <FaHome className="mr-2" /> Back to Home
            </Link>

            <Link
              to="/availableclubs"
              className="bg-linear-to-r from-[#A45CFF] to-[#7ED8FF] text-white py-3 px-8 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center"
            >
              <FaSearch className="mr-2" /> Browse Clubs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;