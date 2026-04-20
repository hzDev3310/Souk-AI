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
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
// Admin pages
import AdminStores from './pages/admin/Stores';
import AdminInfluencers from './pages/admin/Influencers';
import AdminClients from './pages/admin/Clients';
import AdminShippingCompanies from './pages/admin/ShippingCompanies';
import AdminShippingEmployees from './pages/admin/ShippingEmployees';
import AdminCategories from './pages/admin/Categories';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
// Store pages
import StoreProducts from './pages/store/Products';
import StoreOrders from './pages/store/Orders';
import StoreProfile from './pages/store/Profile';

// Role-based route wrapper
const RoleBasedProducts = () => {
    const { user } = useAuth();
    if (user?.role === 'ADMIN') return <AdminProducts />;
    if (user?.role === 'STORE') return <StoreProducts />;
    return <Navigate to="/dashboard" replace />;
};

const RoleBasedOrders = () => {
    const { user } = useAuth();
    if (user?.role === 'ADMIN') return <AdminOrders />;
    if (user?.role === 'STORE') return <StoreOrders />;
    return <Navigate to="/dashboard" replace />;
};

const RoleBasedProfile = () => {
    const { user } = useAuth();
    if (user?.role === 'STORE') return <StoreProfile />;
    return <Navigate to="/dashboard" replace />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Auth Routes */}
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
                    {/* Admin-only routes */}
                    <Route path="stores" element={<AdminStores />} />
                    <Route path="influencers" element={<AdminInfluencers />} />
                    <Route path="clients" element={<AdminClients />} />
                    <Route path="shipping-companies" element={<AdminShippingCompanies />} />
                    <Route path="shipping-employees" element={<AdminShippingEmployees />} />
                    <Route path="categories" element={<AdminCategories />} />
                    {/* Role-based routes (products & orders) */}
                    <Route path="products" element={<RoleBasedProducts />} />
                    <Route path="orders" element={<RoleBasedOrders />} />
                    {/* Common routes */}
                    <Route path="analytics" element={<div className="p-6 text-link">Analytics Page (Work in Progress)</div>} />
                    <Route path="settings" element={<div className="p-6 text-link">Settings Page (Work in Progress)</div>} />
                    <Route path="profile" element={<RoleBasedProfile />} />
                </Route>

                {/* Default Route: Redirect to dashboard if logged in, or handled by Blade / login */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
