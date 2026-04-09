import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Cookie-based axios instance with CSRF support
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, // Send cookies with requests
});

// Fetch CSRF token before state-changing requests
let csrfToken = null;

const fetchCsrfToken = async () => {
    if (!csrfToken) {
        await axios.get('/api/sanctum/csrf-cookie', { withCredentials: true });
        csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || 'fetched';
    }
    return csrfToken;
};

// Add CSRF token to mutation requests
api.interceptors.request.use(async (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(
            document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''
        );
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
        if ((error.response?.status === 401 || error.response?.status === 419) && !isAuthPage) {
            // Session expired or CSRF mismatch - redirect to login (unless already there)
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

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
            const response = await api.get('/check');
            if (response.data.authenticated) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            }
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
            const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
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
