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
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Stores from './pages/admin/Stores';
import Influencers from './pages/admin/Influencers';
import Clients from './pages/admin/Clients';
import ShippingCompanies from './pages/admin/ShippingCompanies';
import ShippingEmployees from './pages/admin/ShippingEmployees';

const MainContent = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-darkgray text-white">
            {isAuthenticated && (
                <div className="bg-primary text-white p-4 shadow-lg flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-xl">Souk AI</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                            {user?.role}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>Welcome, {user?.name}</span>
                        <LogoutButton />
                    </div>
                </div>
            )}
            <Welcome />
        </div>
    );
};

const App = () => {
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
                    {/* Placeholder routes for missing pages to avoid broken navigation */}
                    <Route path="products" element={<div className="p-6 text-link">Products Page (Work in Progress)</div>} />
                    <Route path="orders" element={<div className="p-6 text-link">Orders Page (Work in Progress)</div>} />
                    <Route path="analytics" element={<div className="p-6 text-link">Analytics Page (Work in Progress)</div>} />
                    <Route path="settings" element={<div className="p-6 text-link">Settings Page (Work in Progress)</div>} />
                    <Route path="profile" element={<div className="p-6 text-link">Profile Page (Work in Progress)</div>} />
                </Route>

                {/* Default Route */}
                <Route path="/" element={<MainContent />} />
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
            <NotificationProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </NotificationProvider>
        </ThemeProvider>
    );
}
