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
                // Souk.AI Core Branding
                'brand-primary': '#198754', // Fresh Green
                'brand-secondary': '#2C4854', // Deep Blue
                
                // M3-like extended palette from Stitch
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

    plugins: [forms],
};
