/**
 * Protected Route - Login required
 * FMS - Vipin Chaturvedi
 */

import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const authToken = localStorage.getItem('token');

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
