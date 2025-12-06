import React, { useState, useEffect } from 'react';
import { paymentApi } from '../../../api/clubifyApi';
import { toast } from 'react-toastify';

const ViewPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            // In a real app, you'd pass an auth token here
            const response = await paymentApi.getAllPayments('fake-token'); // Replace with actual token
            setPayments(response);
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (paymentId, newStatus) => {
        try {
            // In a real app, you'd pass an auth token here
            await paymentApi.updatePaymentStatus(paymentId, newStatus, 'fake-token'); // Replace with actual token
            toast.success(`Payment status updated to ${newStatus}`);
            
            // Update the UI
            setPayments(prevPayments => 
                prevPayments.map(payment => 
                    payment._id === paymentId ? { ...payment, status: newStatus } : payment
                )
            );
        } catch (error) {
            console.error('Error updating payment status:', error);
            toast.error('Failed to update payment status');
        }
    };

    // Filter payments based on search term and selected status
    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             payment.clubName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             payment.eventName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !selectedStatus || payment.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">View Payments</h1>
                <p className="text-gray-600">View and manage all platform payments</p>
            </div>

            {/* Controls */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search payments by user, club or event..."
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
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                </select>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club/Event</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPayments.map((payment) => (
                                <tr key={payment._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{payment.userName || payment.userEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{payment.clubName || payment.eventName || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${payment.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {payment.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                              payment.status === 'failed' ? 'bg-red-100 text-red-800' : 
                                              'bg-blue-100 text-blue-800'}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(payment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select
                                            className="border border-gray-300 rounded px-2 py-1"
                                            value={payment.status}
                                            onChange={(e) => handleStatusChange(payment._id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="failed">Failed</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
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
    );
};

export default ViewPayments;