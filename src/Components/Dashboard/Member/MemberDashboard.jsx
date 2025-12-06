import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FaBuilding, FaCalendarAlt, FaMoneyBillWave, FaUser } from 'react-icons/fa';

// Mock data for member dashboard
const mockMemberData = {
  totalClubsJoined: 5,
  totalEventsRegistered: 12,
  upcomingEvents: 3,
  totalPayments: 150,
};

// Mock upcoming events
const mockUpcomingEvents = [
  { id: 1, name: 'Tech Talk: AI Trends', clubName: 'Tech Innovators', date: '2024-01-15', location: 'San Francisco, CA' },
  { id: 2, name: 'Monthly Fitness Meetup', clubName: 'Fitness Enthusiasts', date: '2024-01-20', location: 'Golden Gate Park, SF' },
  { id: 3, name: 'Gaming Tournament', clubName: 'Gaming Community', date: '2024-01-25', location: 'Online' },
];

// Mock function to fetch member dashboard summary
const fetchMemberSummary = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockMemberData;
};

const MemberDashboard = () => {
  const { data: summary, isLoading, isError, error } = useQuery({
    queryKey: ['memberSummary'],
    queryFn: fetchMemberSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Summary cards data
  const summaryCards = [
    {
      title: 'Clubs Joined',
      value: summary?.totalClubsJoined || 0,
      icon: <FaBuilding className="text-2xl" />,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Events Registered',
      value: summary?.totalEventsRegistered || 0,
      icon: <FaCalendarAlt className="text-2xl" />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Upcoming Events',
      value: summary?.upcomingEvents || 0,
      icon: <FaCalendarAlt className="text-2xl" />,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Payments',
      value: `$${(summary?.totalPayments || 0).toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-2xl" />,
      color: 'from-yellow-500 to-yellow-600',
    }
  ];

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
        <p className="text-red-500">Error loading dashboard data: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Member Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your clubs and events.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{card.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center text-white`}>
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div 
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
            <button className="text-[#6A0DAD] hover:text-[#9F62F2] text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {mockUpcomingEvents.map((event, index) => (
              <div key={event.id} className="flex items-start pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <FaCalendarAlt />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{event.name}</p>
                  <p className="text-gray-600 text-sm truncate">{event.clubName}</p>
                  <div className="flex items-center text-gray-500 text-xs mt-1">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Join New Club
            </button>
            <button className="w-full bg-white border border-[#6A0DAD] text-[#6A0DAD] py-3 px-4 rounded-lg font-medium hover:bg-[#6A0DAD] hover:text-white transition-colors">
              Browse Events
            </button>
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Update Profile
            </button>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div 
        className="bg-white rounded-xl shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
              <FaUser />
            </div>
            <div>
              <p className="font-medium text-gray-800">Joined Tech Innovators club</p>
              <p className="text-gray-600 text-sm">2 days ago</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="font-medium text-gray-800">Registered for Tech Talk: AI Trends</p>
              <p className="text-gray-600 text-sm">5 days ago</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
              <FaMoneyBillWave />
            </div>
            <div>
              <p className="font-medium text-gray-800">Payment of $25 processed</p>
              <p className="text-gray-600 text-sm">1 week ago</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MemberDashboard;