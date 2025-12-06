import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FaUsers, FaBuilding, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

// Mock data for admin dashboard
const mockAdminData = {
  totalUsers: 1250,
  totalClubs: 89,
  pendingClubs: 12,
  approvedClubs: 72,
  rejectedClubs: 5,
  totalMemberships: 3420,
  totalEvents: 156,
  totalPayments: 45600,
};

// Mock function to fetch admin dashboard summary
const fetchAdminSummary = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockAdminData;
};

const AdminDashboard = () => {
  const { data: summary, isLoading, isError, error } = useQuery({
    queryKey: ['adminSummary'],
    queryFn: fetchAdminSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Summary cards data
  const summaryCards = [
    {
      title: 'Total Users',
      value: summary?.totalUsers || 0,
      icon: <FaUsers className="text-2xl" />,
      color: 'from-blue-500 to-blue-600',
      change: '+12% from last month'
    },
    {
      title: 'Total Clubs',
      value: summary?.totalClubs || 0,
      icon: <FaBuilding className="text-2xl" />,
      color: 'from-purple-500 to-purple-600',
      change: '+8% from last month'
    },
    {
      title: 'Total Memberships',
      value: summary?.totalMemberships || 0,
      icon: <FaUsers className="text-2xl" />,
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

  // Club status data
  const clubStatusData = [
    { status: 'Approved', count: summary?.approvedClubs || 0, color: 'bg-green-500' },
    { status: 'Pending', count: summary?.pendingClubs || 0, color: 'bg-yellow-500' },
    { status: 'Rejected', count: summary?.rejectedClubs || 0, color: 'bg-red-500' },
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with Clubify.</p>
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

      {/* Charts and Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Club Status Chart */}
        <motion.div 
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Club Status Distribution</h3>
          <div className="space-y-4">
            {clubStatusData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">{item.status}</span>
                  <span className="text-gray-700">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${item.color}`} 
                    style={{ width: `${(item.count / summary?.totalClubs * 100) || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Total Events</span>
              <span className="font-semibold">{summary?.totalEvents || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Pending Clubs</span>
              <span className="font-semibold text-yellow-600">{summary?.pendingClubs || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">New Users (Today)</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Clubs</span>
              <span className="font-semibold text-green-600">{summary?.approvedClubs || 0}</span>
            </div>
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
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <FaUsers className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">New user registered</p>
              <p className="text-gray-600 text-sm">John Doe registered 10 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <FaBuilding className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">New club pending approval</p>
              <p className="text-gray-600 text-sm">Tech Enthusiasts submitted for approval 3 hours ago</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <FaMoneyBillWave className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Payment received</p>
              <p className="text-gray-600 text-sm">Payment of $50 received from Jane Smith 5 hours ago</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;