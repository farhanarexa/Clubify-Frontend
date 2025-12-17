import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi, clubApi, membershipApi, eventApi, paymentApi } from '../../../api/clubifyApi';
import { toast } from 'react-toastify';
import { FaUser, FaBuilding, FaUsers, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import SimpleBarChart from './SimpleBarChart';

const AdminDashboard = () => {
  // Summary data queries
  const { data: usersSummary, isLoading: loadingUsers } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => userApi.getAllUsers(),
  });

  const { data: clubsSummary, isLoading: loadingClubs } = useQuery({
    queryKey: ['allClubs'],
    queryFn: () => clubApi.getAllClubs({ isAdmin: true }),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: membershipsSummary, isLoading: loadingMemberships } = useQuery({
    queryKey: ['allMemberships'],
    queryFn: async () => {
      try {
        // Since there's no direct API to get all memberships, let's fetch them by iterating clubs
        const clubs = await clubApi.getAllClubs({ isAdmin: true });
        const allMemberships = [];
        for (const club of clubs) {
          try {
            const clubMemberships = await membershipApi.getMembershipsByClub(club._id);
            allMemberships.push(...clubMemberships);
          } catch (error) {
            // Continue to next club even if one fails
            console.error('Error fetching memberships for club:', club._id, error);
          }
        }
        return allMemberships;
      } catch (error) {
        console.error('Error fetching all memberships:', error);
        return [];
      }
    },
  });

  const { data: eventsSummary, isLoading: loadingEvents } = useQuery({
    queryKey: ['allEvents'],
    queryFn: () => eventApi.getAllEvents({ page: 1, limit: 1000 }),
  });

  const { data: paymentsSummary, isLoading: loadingPayments } = useQuery({
    queryKey: ['allPayments'],
    queryFn: () => paymentApi.getAllPayments(),
  });

  // Calculate summary values
  const totalUsers = usersSummary?.length || 0;
  const totalClubs = clubsSummary?.length || 0;
  const totalMemberships = membershipsSummary?.length || 0;
  const totalEvents = eventsSummary?.events?.length || 0;
  const totalPayments = paymentsSummary?.reduce((sum, payment) => {
    if (payment.status === 'completed') {
      return sum + parseFloat(payment.amount || 0);
    }
    return sum;
  }, 0) || 0;

  // Calculate club status counts
  const pendingClubs = clubsSummary?.filter(club => club.status === 'pending')?.length || 0;
  const approvedClubs = clubsSummary?.filter(club => club.status === 'approved')?.length || 0;
  const rejectedClubs = clubsSummary?.filter(club => club.status === 'rejected')?.length || 0;

  // Loading state
  const isLoading = loadingUsers || loadingClubs || loadingMemberships || loadingEvents || loadingPayments;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl text-center md:text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-center text-gray-600 pb-5">Monitor and manage the Clubify platform</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#6A0DAD]">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#6A0DAD]/10 mr-4">
                <FaUser className="text-[#6A0DAD] text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Users</h3>
                <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#9F62F2]">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#9F62F2]/10 mr-4">
                <FaBuilding className="text-[#9F62F2] text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Clubs</h3>
                <p className="text-2xl font-bold text-gray-800">{totalClubs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#4CAF50]">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#4CAF50]/10 mr-4">
                <FaUsers className="text-[#4CAF50] text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Memberships</h3>
                <p className="text-2xl font-bold text-gray-800">{totalMemberships}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#2196F3]">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#2196F3]/10 mr-4">
                <FaCalendarAlt className="text-[#2196F3] text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Events</h3>
                <p className="text-2xl font-bold text-gray-800">{totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#FF9800]">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#FF9800]/10 mr-4">
                <FaDollarSign className="text-[#FF9800] text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Payments</h3>
                <p className="text-2xl font-bold text-gray-800">${totalPayments.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - Breakdown of Clubs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Clubs by Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Pending</span>
                  <span className="text-sm font-medium text-gray-700">{pendingClubs}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${totalClubs ? (pendingClubs / totalClubs) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Approved</span>
                  <span className="text-sm font-medium text-gray-700">{approvedClubs}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${totalClubs ? (approvedClubs / totalClubs) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Rejected</span>
                  <span className="text-sm font-medium text-gray-700">{rejectedClubs}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${totalClubs ? (rejectedClubs / totalClubs) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">User Roles Distribution</h3>
            {usersSummary ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Admins</span>
                  <span className="font-medium">{usersSummary.filter(u => u.role === 'admin').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Club Managers</span>
                  <span className="font-medium">{usersSummary.filter(u => u.role === 'clubManager').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Members</span>
                  <span className="font-medium">{usersSummary.filter(u => u.role === 'member').length}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Loading...</div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Status</h3>
            {paymentsSummary ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium">{paymentsSummary.filter(p => p.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-medium">{paymentsSummary.filter(p => p.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Failed</span>
                  <span className="font-medium">{paymentsSummary.filter(p => p.status === 'failed').length}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Loading...</div>
            )}
          </div>
        </div>

        {/* Analytics Section with Charts */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Analytics Overview</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Memberships per Club Chart */}
            <div className="border border-gray-200 rounded-lg">
              <h4 className="text-lg font-medium text-gray-700 mb-2 text-center">Memberships per Club</h4>
              {clubsSummary && membershipsSummary ? (
                (() => {
                  // Count memberships per club
                  const membershipCounts = {};
                  membershipsSummary.forEach(membership => {
                    const clubId = membership.clubId;
                    if (membership.status === 'active') {
                      membershipCounts[clubId] = (membershipCounts[clubId] || 0) + 1;
                    }
                  });

                  // Get club names for each club ID
                  const clubMembershipData = clubsSummary.map(club => ({
                    label: club.clubName || 'Unknown Club',
                    value: membershipCounts[club._id] || 0
                  })).filter(item => item.value > 0).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5 clubs

                  return <SimpleBarChart
                    data={clubMembershipData}
                    title="Active Memberships per Club (Top 5)"
                    color="#4CAF50"
                  />;
                })()
              ) : (
                <div className="p-8 text-center text-gray-500">Loading data...</div>
              )}
            </div>

            {/* Payments Over Time Chart */}
            <div className="border border-gray-200 rounded-lg">
              <h4 className="text-lg font-medium text-gray-700 mb-2 text-center">Payments by Status</h4>
              {paymentsSummary ? (
                (() => {
                  // Count payments by status
                  const statusCounts = {};
                  const statusColors = {
                    'completed': '#4CAF50',
                    'pending': '#FFC107',
                    'failed': '#F44336',
                    'refunded': '#9E9E9E'
                  };

                  paymentsSummary.forEach(payment => {
                    const status = payment.status;
                    statusCounts[status] = (statusCounts[status] || 0) + 1;
                  });

                  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
                    label: status,
                    value: count
                  }));

                  return <SimpleBarChart
                    data={statusData}
                    title="Payments by Status"
                    color="#2196F3"
                  />;
                })()
              ) : (
                <div className="p-8 text-center text-gray-500">Loading data...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;