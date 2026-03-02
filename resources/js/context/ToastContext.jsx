import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration !== Infinity) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

// Internal Container Component
const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl border border-white/10
                        animate-in slide-in-from-right-full duration-300
                        ${toast.type === 'success' ? 'bg-emerald-600 text-white' : ''}
                        ${toast.type === 'error' ? 'bg-red-600 text-white' : ''}
                        ${toast.type === 'info' ? 'bg-blue-600 text-white' : ''}
                        ${toast.type === 'warning' ? 'bg-amber-500 text-white' : ''}
                    `}
                >
                    <span className="flex-1 text-sm font-bold">{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="p-1 hover:bg-black/10 rounded-lg transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            ))}
        </div>
    );
};
