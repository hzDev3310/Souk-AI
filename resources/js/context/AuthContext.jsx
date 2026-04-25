import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import api from '../lib/api';

const AuthContext = createContext();

// Fetch CSRF token before state-changing requests
let csrfTokenFetched = false;

const fetchCsrfToken = async (force = false) => {
    if (!csrfTokenFetched || force) {
        await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
        csrfTokenFetched = true;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check auth status on mount (cookie-based)
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await api.get('/me');
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            // Not authenticated
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = useCallback(async () => {
        try {
            const response = await api.get('/me');
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            // Don't redirect if already on auth pages
            const p = window.location.pathname;
            const isAuthPage =
                p === '/dashboard/login' || p === '/dashboard/register';
            if (!isAuthPage) {
                setUser(null);
                setIsAuthenticated(false);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            // Get CSRF cookie first
            await fetchCsrfToken();

            const response = await api.post('/login', { email, password });
            const { user } = response.data;

            setUser(user);
            setIsAuthenticated(true);

            return { success: true, user };
        } catch (error) {
            if (error.response?.status === 419) {
                await fetchCsrfToken(true);
                return login(email, password); // Retry once
            }
            const message = error.response?.data?.message || 'Login failed';
            const pendingApproval = error.response?.data?.pending_approval || false;
            return { success: false, message, pendingApproval };
        }
    };

    const register = async (data) => {
        try {
            // Get CSRF cookie first
            await fetchCsrfToken();

            const response = await api.post('/register', data);
            const { user } = response.data;

            setUser(user);
            setIsAuthenticated(true);

            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            const errors = error.response?.data?.errors;
            return { success: false, message, errors };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        setUser,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        hasRole,
        api,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
