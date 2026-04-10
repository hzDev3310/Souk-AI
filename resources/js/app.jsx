import './bootstrap';
import './i18n';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import Welcome from './components/Welcome';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import LogoutButton from './components/auth/LogoutButton';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Stores from './pages/admin/Stores';
import Influencers from './pages/admin/Influencers';
import Clients from './pages/admin/Clients';
import ShippingCompanies from './pages/admin/ShippingCompanies';
import ShippingEmployees from './pages/admin/ShippingEmployees';

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

// Router-based App
const RouterApp = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Dashboard Routes */}
                <Route
                    path="/dashboard/*"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="stores" element={<Stores />} />
                    <Route path="influencers" element={<Influencers />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="shipping-companies" element={<ShippingCompanies />} />
                    <Route path="shipping-employees" element={<ShippingEmployees />} />
                </Route>

                {/* Default Route */}
                <Route path="/" element={<App />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

const rootElement = document.getElementById('react-root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <ThemeProvider>
            <AuthProvider>
                <RouterApp />
            </AuthProvider>
        </ThemeProvider>
    );
}
