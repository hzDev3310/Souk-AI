import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    darkMode: 'class',

    theme: {
        extend: {
            colors: {
                // Souk.AI Core Branding - Light Mode
                'brand-primary': '#198754',
                'brand-secondary': '#2C4854',
                
                // Material Design 3 palette - Light Mode
                'primary': '#198754',
                'secondary': '#2C4854',
                'on-primary': '#ffffff',
                'on-secondary': '#ffffff',
                'primary-container': '#198754',
                'secondary-container': '#c9e7f6',
                'surface': '#fbf9f9',
                'on-surface': '#1b1c1c',
                'surface-container-low': '#f5f3f3',
                'surface-container': '#efeded',
                'surface-container-high': '#e9e8e7',
                'surface-container-highest': '#e3e2e2',
                'outline': '#6e7a70',
                'outline-variant': '#bdcabe',
                'error': '#ba1a1a',
                'error-container': '#ffdad6',
                'on-error-container': '#93000a',
                'success': '#2e7d32',
                'on-success': '#ffffff',
                'success-container': '#c8e6c9',
                'on-success-container': '#1b5e20',
                'warning': '#f57f17',
                'on-warning': '#ffffff',
                'info': '#0288d1',
                'on-info': '#ffffff',
            },
            fontFamily: {
                headline: ['Manrope', ...defaultTheme.fontFamily.sans],
                body: ['Inter', ...defaultTheme.fontFamily.sans],
                label: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
        },
    },

    safelist: [
        'dark:bg-[#121212]',
        'dark:bg-[#1e1e1e]',
        'dark:bg-[#2f2f2f]',
        'dark:bg-[#262626]',
        'dark:bg-[#333333]',
        'dark:bg-[#3a3a3a]',
        'dark:text-[#e0e0e0]',
        'dark:text-[#b0b0b0]',
        'dark:text-[#90caf9]',
        'dark:border-[#3a3a3a]',
        'dark:border-[#4a4a4a]',
    ],

    plugins: [forms],
};
