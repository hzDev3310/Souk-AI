const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const DEFAULT_MAX_SIZE_BYTES = 4 * 1024 * 1024;

export const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
    }
    return `${Math.round(bytes / 1024)}KB`;
};

export const getAcceptedImageTypesLabel = (allowedTypes = DEFAULT_ALLOWED_TYPES) => {
    const labels = allowedTypes.map((type) => {
        if (type === 'image/jpeg') return 'JPG';
        if (type === 'image/png') return 'PNG';
        if (type === 'image/webp') return 'WEBP';
        if (type === 'image/gif') return 'GIF';
        if (type === 'image/svg+xml') return 'SVG';
        return type;
    });

    return labels.join(', ');
};

export const validateImageFile = (file, { allowedTypes = DEFAULT_ALLOWED_TYPES, maxSizeBytes = DEFAULT_MAX_SIZE_BYTES } = {}) => {
    if (!file) {
        return { isValid: false, error: 'Please choose an image file.' };
    }

    const mime = file.type?.toLowerCase() || '';
    const extension = (file.name?.split('.').pop() || '').toLowerCase();
    const isValidType = allowedTypes.some((type) => {
        if (type === 'image/*') return mime.startsWith('image/');
        if (type === 'image/svg+xml') return extension === 'svg' || mime === type;
        return mime === type;
    });

    if (!isValidType) {
        return {
            isValid: false,
            error: `Please upload a valid image file (${getAcceptedImageTypesLabel(allowedTypes)}).`,
        };
    }

    if (file.size > maxSizeBytes) {
        return {
            isValid: false,
            error: `Please upload an image smaller than ${formatFileSize(maxSizeBytes)}.`,
        };
    }

    return { isValid: true };
};
