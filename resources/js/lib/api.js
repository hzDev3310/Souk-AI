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

// Auth Status Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 419) {
            // Only redirect if not on login/register/root pages
            const publicPaths = ['/login', '/register', '/'];
            const isPublicPage = publicPaths.includes(window.location.pathname);
            
            if (!isPublicPage) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
