import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import { ThemeProvider } from './Contexts/ThemeProvider';
import { LanguageProvider } from './Contexts/LanguageProvider';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Souk.AI';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ThemeProvider>
                <LanguageProvider>
                    <App {...props} />
                </LanguageProvider>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#198754',
    },
});
