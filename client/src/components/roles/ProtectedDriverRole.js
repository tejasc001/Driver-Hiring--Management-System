import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedUserRole({ role }) {
  console.log(role);
  return role?.type === 'driver' ? <Outlet /> : <Navigate to="/drivers" />;
}

export default ProtectedUserRole;
