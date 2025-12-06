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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
        path: "availableclubs",
        Component: AvailableClubs
      },
      {
        path: "addclubs",
        element: <PrivateRoute><AddClubs /></PrivateRoute>
      },
      {
        path: "login",
        Component: Login
      },

    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
