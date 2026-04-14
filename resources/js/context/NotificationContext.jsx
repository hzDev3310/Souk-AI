import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [modal, setModal] = useState(null);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => {
      const next = [...prev, { id, message: message?.replace(/^\./, ''), type, exiting: false }];
      return next.length > 5 ? next.slice(1) : next;
    });

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const showAlert = useCallback((options) => {
    return new Promise((resolve) => {
      setModal({
        ...options,
        resolve: (value) => {
          setModal(null);
          resolve(value);
        }
      });
    });
  }, []);

  const removeToast = useCallback((id) => {
    setNotifications((prev) => 
      prev.map(n => n.id === id ? { ...n, exiting: true } : n)
    );
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 300); // Wait for fade out
  }, []);

  return (
    <NotificationContext.Provider value={{ showToast, showAlert }}>
      {children}
      
      {/* Toasts Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {notifications.map((n) => (
          <Toast key={n.id} {...n} onClose={() => removeToast(n.id)} />
        ))}
      </div>

      {/* Modal Alert */}
      {modal && <AlertModal {...modal} />}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

const Toast = ({ message, type, onClose, exiting }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-success" />,
    error: <XCircle className="w-5 h-5 text-error" />,
    warning: <AlertCircle className="w-5 h-5 text-warning" />,
    info: <Info className="w-5 h-5 text-info" />,
  };

  const bgColors = {
    success: 'bg-card border-success/30',
    error: 'bg-card border-error/30',
    warning: 'bg-card border-warning/30',
    info: 'bg-card border-info/30',
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg min-w-[300px] max-w-sm transition-all duration-300",
        bgColors[type] || bgColors.info,
        exiting ? "opacity-0 translate-x-10 scale-95" : "opacity-100 translate-x-0 scale-100"
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type] || icons.info}</div>
      <div className="flex-grow">
        <p className="text-sm font-semibold text-foreground leading-tight text-start">{message}</p>
      </div>
      <button onClick={onClose} className="flex-shrink-0 hover:opacity-70 transition-opacity ml-1">
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
};

const AlertModal = ({ title, message, type = 'info', confirmText = 'Confirm', cancelText = 'Cancel', resolve }) => {
  const icons = {
    success: <CheckCircle2 className="w-12 h-12 text-success" />,
    error: <XCircle className="w-12 h-12 text-error" />,
    warning: <AlertCircle className="w-12 h-12 text-warning" />,
    info: <Info className="w-12 h-12 text-info" />,
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => resolve(false)}
      />
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">{icons[type] || icons.info}</div>
          <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
          <p className="text-muted-foreground">{message}</p>
        </div>
        <div className="flex border-t border-border">
          <button
            onClick={() => resolve(false)}
            className="flex-1 px-6 py-4 text-sm font-semibold hover:bg-muted transition-colors text-muted-foreground"
          >
            {cancelText}
          </button>
          <button
            onClick={() => resolve(true)}
            className={cn(
              "flex-1 px-6 py-4 text-sm font-semibold text-white transition-colors",
              type === 'error' ? 'bg-error hover:bg-erroremphasis' : 'bg-primary hover:bg-primaryemphasis'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
