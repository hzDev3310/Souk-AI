import './bootstrap';

import React from 'react';
import { createRoot } from 'react-dom/client';
import ExampleReact from './components/ExampleReact';

const rootElement = document.getElementById('react-root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<ExampleReact />);
}
