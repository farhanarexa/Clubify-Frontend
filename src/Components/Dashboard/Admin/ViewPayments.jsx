import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '../../../api/clubifyApi';

const ViewPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Fetch all payments
  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['allPayments'],
    queryFn: () => paymentApi.getAllPayments(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading payments: {error.message}</p>
      </div>
    );
  }

  // Filter payments based on search term and selected filters
  const filteredPayments = payments?.filter(payment => {
    const matchesSearch = payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.clubName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.eventName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || payment.status === selectedStatus;
    const matchesType = !selectedType || payment.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  // Calculate total payments by status
  const totalPayments = filteredPayments.reduce((sum, payment) => {
    if (payment.status === 'completed') {
      return sum + parseFloat(payment.amount || 0);
    }
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F0] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            View Payments
          </h1>
          <p className="text-lg text-gray-600">View and manage all payment records</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#4CAF50]">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Payments</h3>
            <p className="text-2xl font-bold text-gray-800">{filteredPayments.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#2196F3]">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Completed</h3>
            <p className="text-2xl font-bold text-gray-800">{filteredPayments.filter(p => p.status === 'completed').length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#FFC107]">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Pending</h3>
            <p className="text-2xl font-bold text-gray-800">{filteredPayments.filter(p => p.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#FF9800]">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Amount</h3>
            <p className="text-2xl font-bold text-gray-800">${totalPayments.toFixed(2)}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by user, club, or event..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="membership">Membership</option>
            <option value="event">Event</option>
          </select>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club/Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.userName || payment.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${payment.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{payment.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.clubName || payment.eventName || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No payments found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPayments;