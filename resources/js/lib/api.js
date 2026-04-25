import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

// CSRF Interceptor
api.interceptors.request.use(async (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
        const xsrfToken = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
        if (xsrfToken) {
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
        }
    }
    return config;
});

// Do not redirect on 401/419 here: a full-page jump to /dashboard/login breaks client-side
// navigation (e.g. /dashboard/stores) and drops the intended URL. Let callers handle errors;
// ProtectedRoute + AuthContext already gate unauthenticated access.
api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default api;
