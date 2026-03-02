import React from 'react';

const Card = ({
    children,
    className = '',
    title,
    description,
    footer,
    noPadding = false
}) => {
    return (
        <div className={`bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col ${className}`}>
            {(title || description) && (
                <div className="p-6 border-b border-gray-50 dark:border-gray-800">
                    {title && <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>}
                    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </div>
            )}

            <div className={`flex-1 ${noPadding ? '' : 'p-6'}`}>
                {children}
            </div>

            {footer && (
                <div className="p-6 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
