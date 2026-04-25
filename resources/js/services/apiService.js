/**
 * Standardized API Service for React Admin/Store Pages
 * Provides consistent patterns for CRUD operations and file uploads
 */

import api from '@/lib/api';

/**
 * Standard API response handler
 */
const handleResponse = (response) => {
    return response.data;
};

/**
 * Standard API error handler
 */
const handleError = (error) => {
    if (error.response?.status === 422) {
        const errors = error.response.data?.errors || {};
        const messages = Object.values(errors).flat().join('\n');
        throw new Error(messages || error.response.data?.message || 'Validation failed');
    }
    throw new Error(error.response?.data?.message || error.message || 'An error occurred');
};

/**
 * Prepare FormData with proper Content-Type handling
 * Usage: Call this before api.post/put with files
 */
export const prepareFormDataRequest = () => {
    // Remove Content-Type to let browser set multipart boundary
    const originalContentType = api.defaults.headers['Content-Type'];
    delete api.defaults.headers['Content-Type'];
    
    return {
        restore: () => {
            api.defaults.headers['Content-Type'] = originalContentType || 'application/json';
        }
    };
};

/**
 * Standard CRUD operations
 */
export const crudService = {
    /**
     * Fetch all items
     */
    fetchAll: async (endpoint) => {
        try {
            const response = await api.get(endpoint);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    /**
     * Fetch single item
     */
    fetchOne: async (endpoint, id) => {
        try {
            const response = await api.get(`${endpoint}/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    /**
     * Create item (JSON)
     */
    create: async (endpoint, data) => {
        try {
            const response = await api.post(endpoint, data);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    /**
     * Create item with files (FormData)
     */
    createWithFiles: async (endpoint, formData) => {
        const cleanup = prepareFormDataRequest();
        try {
            const response = await api.post(endpoint, formData);
            cleanup.restore();
            return handleResponse(response);
        } catch (error) {
            cleanup.restore();
            return handleError(error);
        }
    },

    /**
     * Update item (JSON)
     */
    update: async (endpoint, id, data) => {
        try {
            const response = await api.put(`${endpoint}/${id}`, data);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    /**
     * Update item with files (FormData)
     */
    updateWithFiles: async (endpoint, id, formData) => {
        const cleanup = prepareFormDataRequest();
        try {
            const response = await api.put(`${endpoint}/${id}`, formData);
            cleanup.restore();
            return handleResponse(response);
        } catch (error) {
            cleanup.restore();
            return handleError(error);
        }
    },

    /**
     * Delete item
     */
    delete: async (endpoint, id) => {
        try {
            const response = await api.delete(`${endpoint}/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }
};

/**
 * Image URL helper - ensures proper /storage/ prefix
 */
export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/storage/')) return path;
    return `/storage/${path}`;
};

/**
 * Create FormData from object with file support
 */
export const createFormData = (data, fileFields = {}) => {
    const formData = new FormData();
    
    // Append regular fields
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });
    
    // Append files
    Object.keys(fileFields).forEach(key => {
        const files = fileFields[key];
        if (files) {
            if (Array.isArray(files)) {
                files.forEach((file, index) => {
                    formData.append(`${key}[${index}]`, file);
                });
            } else {
                formData.append(key, files);
            }
        }
    });
    
    return formData;
};

export default crudService;
