import './bootstrap';
import './i18n';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Welcome from './components/Welcome';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import LogoutButton from './components/auth/LogoutButton';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Simple router based on current path
const App = () => {
    const path = window.location.pathname;
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Public routes
    if (path === '/login') {
        if (isAuthenticated) {
            window.location.href = '/';
            return null;
        }
        return <Login />;
    }

    if (path === '/register') {
        if (isAuthenticated) {
            window.location.href = '/';
            return null;
        }
        return <Register />;
    }

    // Default - Welcome page with auth state
    return (
        <div>
            {isAuthenticated && (
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                    <div>
                        Welcome, {user?.name} ({user?.role})
                    </div>
                    <LogoutButton />
                </div>
            )}
            <Welcome />
        </div>
    );
};

const rootElement = document.getElementById('react-root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <ThemeProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ThemeProvider>
    );
}
