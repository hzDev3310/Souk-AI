import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LogoutButton = ({ className = '' }) => {
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setLoading(false);
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 disabled:opacity-50 ${className}`}
        >
            {loading ? 'Logging out...' : 'Logout'}
        </button>
    );
};

export default LogoutButton;
