import { useState, useCallback } from 'react';

let toastCount = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ title, description, variant = 'default', duration = 5000 }) => {
      const id = toastCount++;
      const newToast = { id, title, description, variant, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration !== null) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
  };
}
