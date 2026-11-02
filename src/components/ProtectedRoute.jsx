import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8EE]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#C98A2B] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-[#845400]">Preparing Sanctuary...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> redirect to login with return intent
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role restriction check
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-[#E8D9C5] text-center">
          <div className="w-12 h-12 rounded-full bg-[#FFDAD8] text-[#7A2E2E] flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold">!</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#3B2A1A] mb-2">Restricted Access</h2>
          <p className="text-sm text-[#514536] mb-6">
            This section is reserved for verified {allowedRoles.join(' or ')} accounts. You are currently logged in as a <strong>{user.userType}</strong>.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
}

