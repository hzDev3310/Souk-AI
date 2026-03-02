import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ trigger, children, align = 'right', className = '', closeOnClickOutside = true, closeOnInnerClick = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (closeOnClickOutside && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeOnClickOutside]);

    const alignClass = align === 'right' ? 'right-0' : 'left-0';

    return (
        <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>

            {isOpen && (
                <div
                    className={`absolute z-[100] mt-4 w-64 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200 ${alignClass}`}
                    onClick={() => closeOnInnerClick && setIsOpen(false)}
                >
                    <div className="p-2 space-y-1">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export const DropdownItem = ({ children, onClick, icon: Icon, className = '', rightContent }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 group ${className}`}
        >
            <div className="flex items-center gap-3 pointer-events-none">
                {Icon && <Icon size={18} className="text-gray-400 group-hover:text-[inherit] transition-colors" />}
                {children}
            </div>
            {rightContent && <div className="pointer-events-none">{rightContent}</div>}
        </button>
    );
};

export const DropdownDivider = () => <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-2"></div>;

export default Dropdown;
