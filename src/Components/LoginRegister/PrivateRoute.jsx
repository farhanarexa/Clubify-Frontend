import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../Contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    navigate('/login');
    return null;
  }
  return children;
};

export default PrivateRoute;