import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { auth } = useAuth();

  if (auth.user === null && auth.token) {
    return <div>Loading...</div>;
  }

  // ✅ If logged in and is admin → show admin page
  if (auth.token && auth.user?.role === 'admin') {
    return <Outlet />;
  }

  // ✅ If logged in but not admin → show message
  if (auth.token && auth.user?.role !== 'admin') {
    return <div>You are not authorized to access the admin panel.</div>;
  }

  // ✅ If not logged in → redirect to login
  return <Navigate to="/login" />;
};

export default AdminRoute;
