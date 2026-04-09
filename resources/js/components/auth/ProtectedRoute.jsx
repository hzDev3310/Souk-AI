import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        window.location.href = '/login';
        return null;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                    <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
