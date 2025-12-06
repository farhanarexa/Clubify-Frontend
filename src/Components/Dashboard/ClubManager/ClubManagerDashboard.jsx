import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FaBuilding, FaUsers, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

// Mock data for club manager dashboard
const mockManagerData = {
  myClubs: 3,
  totalMembers: 420,
  totalEvents: 25,
  totalPayments: 12500,
};

// Mock function to fetch manager dashboard summary
const fetchManagerSummary = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockManagerData;
};

const ClubManagerDashboard = () => {
  const { data: summary, isLoading, isError, error } = useQuery({
    queryKey: ['managerSummary'],
    queryFn: fetchManagerSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Summary cards data
  const summaryCards = [
    {
      title: 'My Clubs',
      value: summary?.myClubs || 0,
      icon: <FaBuilding className="text-2xl" />,
      color: 'from-purple-500 to-purple-600',
      change: '+2 from last month'
    },
    {
      title: 'Total Members',
      value: summary?.totalMembers || 0,
      icon: <FaUsers className="text-2xl" />,
      color: 'from-blue-500 to-blue-600',
      change: '+18% from last month'
    },
    {
      title: 'Total Events',
      value: summary?.totalEvents || 0,
      icon: <FaCalendarAlt className="text-2xl" />,
      color: 'from-green-500 to-green-600',
      change: '+15% from last month'
    },
    {
      title: 'Total Payments',
      value: `$${(summary?.totalPayments || 0).toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-2xl" />,
      color: 'from-yellow-500 to-yellow-600',
      change: '+22% from last month'
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Club Manager Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your clubs.</p>
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
                <p className="text-gray-500 text-xs mt-2">{card.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center text-white`}>
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Club Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* My Clubs */}
        <motion.div 
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">My Clubs</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Tech Innovators</span>
              <span className="font-semibold">120 members</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Fitness Enthusiasts</span>
              <span className="font-semibold">210 members</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gaming Community</span>
              <span className="font-semibold">90 members</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600">
                <FaUsers />
              </div>
              <div>
                <p className="font-medium text-gray-800">New member joined</p>
                <p className="text-gray-600 text-sm">Sarah Johnson joined Tech Innovators 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">
                <FaCalendarAlt />
              </div>
              <div>
                <p className="font-medium text-gray-800">New event created</p>
                <p className="text-gray-600 text-sm">Monthly Meetup for Fitness Enthusiasts scheduled for Dec 15</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 text-purple-600">
                <FaMoneyBillWave />
              </div>
              <div>
                <p className="font-medium text-gray-800">Payment received</p>
                <p className="text-gray-600 text-sm">Membership fee of $50 received from Alex Chen</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        className="bg-white rounded-xl shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Create Event
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Add Club
          </button>
          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity">
            View Reports
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ClubManagerDashboard;