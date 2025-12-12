import React, { useState, useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { AuthContext } from '../../Contexts/AuthContext';
import { FaBars, FaTimes, FaUser, FaTachometerAlt, FaUsers, FaBuilding, FaMoneyBillWave, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';

const DashboardLayout = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine user role
  const userRole = user?.role || 'member'; // default to member if no role

  // Navigation items based on role
  const getNavigationItems = (role) => {
    const baseNavItems = [
      {
        name: 'Dashboard',
        path: `/dashboard/${role}`,
        icon: <FaTachometerAlt />,
      },
    ];

    switch (role) {
      case 'admin':
        return [
          ...baseNavItems,
          {
            name: 'Manage Users',
            path: '/dashboard/admin/users',
            icon: <FaUsers />,
          },
          {
            name: 'Manage Clubs',
            path: '/dashboard/admin/clubs',
            icon: <FaBuilding />,
          },
          {
            name: 'Payments',
            path: '/dashboard/admin/payments',
            icon: <FaMoneyBillWave />,
          },
        ];
      case 'clubManager':
        return [
          ...baseNavItems,
          {
            name: 'My Clubs',
            path: '/dashboard/manager/clubs',
            icon: <FaBuilding />,
          },
          {
            name: 'Club Members',
            path: '/dashboard/manager/members',
            icon: <FaUsers />,
          },
          {
            name: 'Events',
            path: '/dashboard/manager/events',
            icon: <FaCalendarAlt />,
          },
          {
            name: 'Registrations',
            path: '/dashboard/manager/registrations',
            icon: <FaUsers />,
          },
        ];
      case 'member':
        return [
          ...baseNavItems,
          {
            name: 'My Clubs',
            path: '/dashboard/member/clubs',
            icon: <FaBuilding />,
          },
          {
            name: 'My Events',
            path: '/dashboard/member/events',
            icon: <FaCalendarAlt />,
          },
          {
            name: 'Payment History',
            path: '/dashboard/member/payments',
            icon: <FaMoneyBillWave />,
          },
        ];
      default:
        return baseNavItems;
    }
  };

  const navigationItems = getNavigationItems(userRole);

  const handleLogout = async () => {
    try {
      await signOutUser();
      window.location.href = '/login'; // Redirect to login after logout
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for large screens */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-linear-to-b from-[#6A0DAD] to-[#9F62F2] text-white transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h1 className="text-xl font-bold">Clubify Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex flex-col h-full pt-4 pb-20 overflow-y-auto">
          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/10">
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#A45CFF] to-[#7ED8FF] flex items-center justify-center">
                <FaUser className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm truncate">{user?.displayName || 'User'}</p>
                <p className="text-xs text-gray-300 capitalize">{userRole}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-2 space-y-1">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="px-4 pt-4 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <FaSignOutAlt className="mr-3" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 lg:hidden mr-4"
              >
                <FaBars size={20} />
              </button>
              <h2 className="text-lg font-semibold text-gray-800 capitalize">
                {userRole} Dashboard
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] flex items-center justify-center text-white text-sm font-semibold">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.displayName || user?.email}
                </span>
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