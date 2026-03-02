import React from 'react';

const Input = ({
    label,
    error,
    className = '',
    containerClassName = '',
    icon: Icon,
    ...props
}) => {
    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label && (
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`
                        w-full ${Icon ? 'pl-11' : 'px-4'} py-3 rounded-2xl border bg-white dark:bg-gray-800 
                        transition-all duration-200 outline-none
                        ${error
                            ? 'border-red-500 focus:ring-4 focus:ring-red-500/10'
                            : 'border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
                        }
                        placeholder:text-gray-400
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-red-500 text-xs font-medium ml-1 mt-0.5">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
