import React, { useState, useEffect } from 'react';
import { paymentApi } from '../../../api/clubifyApi';
import { useContext } from 'react';
import { AuthContext } from '../../../Contexts/AuthContext';
import { toast } from 'react-toastify';

const PaymentHistory = () => {
    const { user } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchPayments();
        }
    }, [user]);

    const fetchPayments = async () => {
        try {
            const response = await paymentApi.getPaymentsByUser(user.email);
            setPayments(response);
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Failed to fetch payment history');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
            </div>
        );
    }

    // Sort payments by date (newest first)
    const sortedPayments = [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payment History</h1>
                <p className="text-gray-600">Your payment records</p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club/Event</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedPayments.map((payment) => (
                                <tr key={payment._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(payment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{payment.clubName || payment.eventName || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {payment.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        ${payment.amount}
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {sortedPayments.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No payment history found</p>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;