import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
    show,
    onClose,
    title,
    children,
    size = 'md',
    showClose = true,
    preventCloseOnOverlay = false
}) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27 && show) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [show, onClose]);

    if (!show) return null;

    const sizes = {
        sm: "max-w-md",
        md: "max-w-xl",
        lg: "max-w-3xl",
        xl: "max-w-5xl",
        full: "max-w-[95vw]"
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity duration-300"
                onClick={() => !preventCloseOnOverlay && onClose()}
            ></div>

            {/* Modal Content */}
            <div className={`
                relative bg-white dark:bg-gray-900 w-full ${sizes[size]} 
                rounded-3xl shadow-2xl border border-white/10 dark:border-gray-800
                overflow-hidden animate-in fade-in zoom-in duration-300
            `}>
                {/* Header */}
                {(title || showClose) && (
                    <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        {title && <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>}
                        {showClose && (
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
