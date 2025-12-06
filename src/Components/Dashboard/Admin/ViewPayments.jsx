import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSearch, FaFileInvoiceDollar } from 'react-icons/fa';

// Mock data for payments
const mockPayments = [
  { id: 1, userEmail: 'john@example.com', amount: 50, type: 'membership', clubName: 'Tech Innovators', date: '2023-11-15', status: 'completed' },
  { id: 2, userEmail: 'jane@example.com', amount: 30, type: 'membership', clubName: 'Fitness Enthusiasts', date: '2023-11-14', status: 'completed' },
  { id: 3, userEmail: 'bob@example.com', amount: 45, type: 'event', clubName: 'Gaming Community', date: '2023-11-13', status: 'completed' },
  { id: 4, userEmail: 'alice@example.com', amount: 25, type: 'membership', clubName: 'Book Club Society', date: '2023-11-12', status: 'pending' },
  { id: 5, userEmail: 'charlie@example.com', amount: 40, type: 'event', clubName: 'Photography Masters', date: '2023-11-11', status: 'completed' },
  { id: 6, userEmail: 'diana@example.com', amount: 35, type: 'membership', clubName: 'Food Lovers', date: '2023-11-10', status: 'completed' },
  { id: 7, userEmail: 'ethan@example.com', amount: 50, type: 'membership', clubName: 'Music Makers', date: '2023-11-09', status: 'completed' },
  { id: 8, userEmail: 'fiona@example.com', amount: 30, type: 'membership', clubName: 'Art Lovers', date: '2023-11-08', status: 'completed' },
];

// Mock function to fetch payments
const fetchPayments = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockPayments;
};

const ViewPayments = () => {
  const { data: payments, isLoading, isError, error } = useQuery({
    queryKey: ['payments'],
    queryFn: fetchPayments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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
        <p className="text-red-500">Error loading payments: {error.message}</p>
      </div>
    );
  }

  // Calculate total amounts
  const totalPayments = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const completedPayments = payments?.filter(p => p.status === 'completed') || [];
  const completedTotal = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">View Payments</h1>
        <p className="text-gray-600">Manage and view all payment transactions in the system.</p>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white mr-4">
              <FaFileInvoiceDollar className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Payments</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">${totalPayments.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white mr-4">
              <FaFileInvoiceDollar className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">${completedTotal.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white mr-4">
              <FaFileInvoiceDollar className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Transactions</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{payments?.length || 0}</h3>
            </div>
          </div>
        </div>
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
              placeholder="Search payments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments?.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.userEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${payment.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.type === 'membership' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {payment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.clubName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewPayments;