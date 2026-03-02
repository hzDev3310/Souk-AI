import React from 'react';

const Switch = ({
    label,
    checked,
    onChange,
    className = '',
    containerClassName = '',
    ...props
}) => {
    return (
        <label className={`flex items-center gap-3 cursor-pointer group ${containerClassName}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={onChange}
                    {...props}
                />
                <div className={`
                    w-12 h-6 rounded-full transition-all duration-300 ease-in-out
                    ${checked
                        ? 'bg-emerald-600 shadow-inner'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }
                `}></div>
                <div className={`
                    absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md 
                    transition-transform duration-300 ease-in-out
                    ${checked ? 'translate-x-6' : 'translate-x-0'}
                `}></div>
            </div>
            {label && (
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 transition-colors">
                    {label}
                </span>
            )}
        </label>
    );
};

export default Switch;
