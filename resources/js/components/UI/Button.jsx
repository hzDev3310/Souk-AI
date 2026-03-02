import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    disabled = false,
    icon: Icon,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
        primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500/20 shadow-lg shadow-emerald-200 dark:shadow-none",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500/10 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/20 shadow-lg shadow-red-200 dark:shadow-none",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 focus:ring-gray-500/10",
        outline: "bg-transparent border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 focus:ring-emerald-500/10"
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
        icon: "p-2.5"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : Icon && <Icon size={size === 'sm' ? 16 : 18} className={children ? "mr-2" : ""} />}
            {children}
        </button>
    );
};

export default Button;
