import React from 'react';

const Events = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F0] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Events
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover upcoming events from clubs you've joined
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">No events available</h3>
            <p className="text-gray-500 mb-6">Check back later for upcoming events</p>
            <p className="text-gray-500">Or join clubs to see their events</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;