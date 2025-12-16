import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import Root from './Layout/Root.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router';
import AuthProvider from './Contexts/AuthProvider.jsx';
import Login from './Components/LoginRegister/Login.jsx';
import Home from './Components/HomePage/Home.jsx';
import PrivateRoute from './Components/LoginRegister/PrivateRoute.jsx';
import AddClubs from './Components/AddClubs.jsx';
import AvailableClubs from './Components/AvailableClubs.jsx';
import Events from './Components/Events.jsx';
import Profile from './Components/Profile.jsx';
import NotFound from './Components/Common/NotFound.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ClubDetailsPublic from './Components/ClubDetails/ClubDetails.jsx';
import Contact from './Components/Contact.jsx';
import About from './Components/About.jsx';

// Dashboard components
import DashboardLayout from './Components/Dashboard/DashboardLayout.jsx';
import ProtectedRoute from './Components/Dashboard/ProtectedRoute.jsx';
import AdminDashboard from './Components/Dashboard/Admin/AdminDashboard.jsx';
import ManageUsers from './Components/Dashboard/Admin/ManageUsers.jsx';
import ManageClubs from './Components/Dashboard/Admin/ManageClubs.jsx';
import ViewPayments from './Components/Dashboard/Admin/ViewPayments.jsx';
import ClubManagerDashboard from './Components/Dashboard/ClubManager/ClubManagerDashboard.jsx';
import MyClubs from './Components/Dashboard/ClubManager/MyClubs.jsx';
import ClubMembers from './Components/Dashboard/ClubManager/ClubMembers.jsx';
import EventsManagement from './Components/Dashboard/ClubManager/EventsManagement.jsx';
import EventRegistrations from './Components/Dashboard/ClubManager/EventRegistrations.jsx';
import ClubDetailsClubManager from './Components/Dashboard/ClubManager/ClubDetails.jsx';
import MemberDashboard from './Components/Dashboard/Member/MemberDashboard.jsx';
import MemberMyClubs from './Components/Dashboard/Member/MyClubs.jsx';
import MyEvents from './Components/Dashboard/Member/MyEvents.jsx';
import PaymentHistory from './Components/Dashboard/Member/PaymentHistory.jsx';

// Import ToastContainer
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a client
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "about",
        Component: About
      },
      {
        path: "contact",
        Component: Contact
      },
      {
        path: "availableclubs",
        Component: AvailableClubs
      },
      {
        path: "events",
        Component: Events
      },
      {
        path: "clubs/:clubId",
        Component: ClubDetailsPublic
      },
      {
        path: "profile",
        element: <PrivateRoute><Profile /></PrivateRoute>
      },
      {
        path: "addclubs",
        element: <PrivateRoute><AddClubs /></PrivateRoute>
      },
      {
        path: "login",
        Component: Login
      },
      {
        path: "dashboard",
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
          // Admin routes
          {
            path: "admin",
            element: <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
          },
          {
            path: "admin/users",
            element: <ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>
          },
          {
            path: "admin/clubs",
            element: <ProtectedRoute allowedRoles={['admin']}><ManageClubs /></ProtectedRoute>
          },
          {
            path: "admin/payments",
            element: <ProtectedRoute allowedRoles={['admin']}><ViewPayments /></ProtectedRoute>
          },
          // Club Manager routes
          {
            path: "clubManager",
            element: <ProtectedRoute allowedRoles={['clubManager']}><ClubManagerDashboard /></ProtectedRoute>
          },
          {
            path: "manager/clubs",
            element: <ProtectedRoute allowedRoles={['clubManager']}><MyClubs /></ProtectedRoute>
          },
          {
            path: "manager/clubs/:clubId",
            element: <ProtectedRoute allowedRoles={['clubManager']}><ClubDetailsClubManager /></ProtectedRoute>
          },
          {
            path: "manager/members",
            element: <ProtectedRoute allowedRoles={['clubManager']}><ClubMembers /></ProtectedRoute>
          },
          {
            path: "manager/events",
            element: <ProtectedRoute allowedRoles={['clubManager']}><EventsManagement /></ProtectedRoute>
          },
          {
            path: "manager/registrations",
            element: <ProtectedRoute allowedRoles={['clubManager']}><EventRegistrations /></ProtectedRoute>
          },
          // Member routes
          {
            path: "member",
            element: <ProtectedRoute allowedRoles={['member']}><MemberDashboard /></ProtectedRoute>
          },
          {
            path: "member/clubs",
            element: <ProtectedRoute allowedRoles={['member']}><MemberMyClubs /></ProtectedRoute>
          },
          {
            path: "member/events",
            element: <ProtectedRoute allowedRoles={['member']}><MyEvents /></ProtectedRoute>
          },
          {
            path: "member/payments",
            element: <ProtectedRoute allowedRoles={['member']}><PaymentHistory /></ProtectedRoute>
          },
        ]
      },
      {
        path: "*",
        element: <NotFound />
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
