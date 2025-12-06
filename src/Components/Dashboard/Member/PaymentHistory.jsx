import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSearch, FaFileInvoiceDollar, FaCalendarAlt, FaBuilding, FaCheck, FaTimes } from 'react-icons/fa';

// Mock data for payment history
const mockPaymentHistory = [
  { id: 1, amount: 50, type: 'membership', clubName: 'Tech Innovators', date: '2023-11-15', status: 'completed', description: 'Annual membership fee' },
  { id: 2, amount: 30, type: 'membership', clubName: 'Fitness Enthusiasts', date: '2023-11-14', status: 'completed', description: 'Monthly membership' },
  { id: 3, amount: 25, type: 'event', clubName: 'Book Club Society', date: '2023-10-20', status: 'completed', description: 'Book discussion event' },
  { id: 4, amount: 15, type: 'event', clubName: 'Gaming Community', date: '2023-10-05', status: 'completed', description: 'Tournament entry fee' },
  { id: 5, amount: 40, type: 'membership', clubName: 'Photography Masters', date: '2023-09-12', status: 'completed', description: 'Quarterly membership' },
  { id: 6, amount: 0, type: 'membership', clubName: 'Art Lovers', date: '2023-08-30', status: 'completed', description: 'Free trial membership' },
  { id: 7, amount: 35, type: 'event', clubName: 'Food Lovers', date: '2023-08-15', status: 'completed', description: 'Cooking workshop' },
  { id: 8, amount: 45, type: 'membership', clubName: 'Music Makers', date: '2023-07-22', status: 'completed', description: 'Annual membership' },
];

// Mock function to fetch payment history
const fetchPaymentHistory = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockPaymentHistory;
};

const PaymentHistory = () => {
  const { data: payments, isLoading, isError, error } = useQuery({
    queryKey: ['paymentHistory'],
    queryFn: fetchPaymentHistory,
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
        <p className="text-red-500">Error loading payment history: {error.message}</p>
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payment History</h1>
        <p className="text-gray-600">View your past payments and transactions.</p>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white mr-4">
              <FaFileInvoiceDollar className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Spent</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">${totalPayments.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white mr-4">
              <FaCheck className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{completedPayments.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white mr-4">
              <FaCalendarAlt className="text-xl" />
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

      {/* Payment History Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments?.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6A0DAD] flex items-center justify-center text-white text-xs mr-3">
                        <FaCalendarAlt />
                      </div>
                      <div className="text-sm text-gray-900">{new Date(payment.date).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{payment.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9F62F2] flex items-center justify-center text-white text-xs mr-3">
                        <FaBuilding />
                      </div>
                      <div className="text-sm text-gray-900">{payment.clubName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.type === 'membership' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {payment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={payment.amount > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {payment.amount > 0 ? `$${payment.amount}` : 'Free'}
                    </span>
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

      {/* Recent Payments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Payments</h3>
          <div className="space-y-4">
            {payments?.slice(0, 3).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-gray-800">{payment.description}</p>
                  <p className="text-gray-600 text-sm">{payment.clubName} • {new Date(payment.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className={payment.amount > 0 ? 'font-medium text-gray-900' : 'font-medium text-gray-500'}>
                    {payment.amount > 0 ? `$${payment.amount}` : 'Free'}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    payment.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">This Month</span>
              <span className="font-medium">$150</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Month</span>
              <span className="font-medium">$230</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average/Month</span>
              <span className="font-medium">$125</span>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-800">Total</span>
                <span className="text-gray-800">${totalPayments.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;