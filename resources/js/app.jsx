import './bootstrap';
import './i18n';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Welcome from './components/Welcome';
import { ThemeProvider } from './context/ThemeContext';

const rootElement = document.getElementById('react-root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <ThemeProvider>
            <Welcome />
        </ThemeProvider>
    );
}
