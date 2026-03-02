import './bootstrap';
import './i18n';

import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ExampleReact from './components/ExampleReact';

import { ToastProvider } from './context/ToastContext';

const rootElement = document.getElementById('react-root');
if (rootElement) {
    const root = createRoot(rootElement);

    root.render(
        <ToastProvider>
            {window.location.pathname.includes('/admin') ? <AdminDashboard /> : <ExampleReact />}
        </ToastProvider>
    );
}
