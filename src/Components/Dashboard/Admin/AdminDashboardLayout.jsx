import React from 'react';
import { Link, Outlet } from 'react-router';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="hidden lg:block w-64 bg-linear-to-b from-[#6A0DAD] to-[#9F62F2] text-white p-4">
                <div className="mb-8">
                    <h1 className="text-xl font-bold">Clubify Dashboard</h1>
                </div>

                <nav className="space-y-2">
                    <Link
                        to="/dashboard/admin"
                        className="block px-4 py-2 rounded-lg bg-white/10"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/dashboard/admin/users"
                        className="block px-4 py-2 rounded-lg hover:bg-white/10"
                    >
                        Manage Users
                    </Link>
                    <Link
                        to="/dashboard/admin/clubs"
                        className="block px-4 py-2 rounded-lg hover:bg-white/10"
                    >
                        Manage Clubs
                    </Link>
                    <Link
                        to="/dashboard/admin/payments"
                        className="block px-4 py-2 rounded-lg hover:bg-white/10"
                    >
                        View Payments
                    </Link>
                </nav>
            </div>

            {/* Mobile sidebar */}
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50"></div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <div className="lg:hidden">
                            <button className="text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>

                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] flex items-center justify-center text-white text-sm font-semibold">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;