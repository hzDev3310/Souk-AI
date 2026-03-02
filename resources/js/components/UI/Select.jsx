import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
    label,
    error,
    className = '',
    containerClassName = '',
    options = [],
    placeholder = "Select an option",
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
                <select
                    className={`
                        w-full px-4 py-3 rounded-2xl border bg-white dark:bg-gray-800 
                        transition-all duration-200 outline-none appearance-none
                        ${error
                            ? 'border-red-500 focus:ring-4 focus:ring-red-500/10'
                            : 'border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
                        }
                        cursor-pointer
                        ${className}
                    `}
                    {...props}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 pointer-events-none transition-colors">
                    <ChevronDown size={18} />
                </div>
            </div>
            {error && (
                <p className="text-red-500 text-xs font-medium ml-1 mt-0.5">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Select;
