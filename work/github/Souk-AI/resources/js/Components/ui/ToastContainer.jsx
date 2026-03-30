import React from 'react';
import { Icon } from '@/Components/ui/Icon';

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            rounded-lg p-4 shadow-xl border flex items-start justify-between gap-4
            max-w-sm w-full animate-in slide-in-from-bottom-5
            ${
              toast.variant === 'success'
                ? 'bg-brand-primary text-white border-brand-primary'
                : toast.variant === 'destructive'
                ? 'bg-error text-white border-error'
                : 'bg-white dark:bg-[#1e1e1e] text-on-surface dark:text-[#e0e0e0] border-outline-variant dark:border-[#3a3a3a]'
            }
          `}
        >
          <div className="flex-1">
            {toast.title && (
              <h3 className="font-bold text-sm mb-1">{toast.title}</h3>
            )}
            {toast.description && (
              <p className="text-xs opacity-90">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
}
