import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

const Alert = ({
    type = 'info',
    title,
    children,
    className = '',
    onClose
}) => {
    const variants = {
        info: {
            bg: "bg-blue-50 dark:bg-blue-900/10",
            border: "border-blue-100 dark:border-blue-900/20",
            text: "text-blue-800 dark:text-blue-300",
            icon: Info
        },
        success: {
            bg: "bg-emerald-50 dark:bg-emerald-900/10",
            border: "border-emerald-100 dark:border-emerald-900/20",
            text: "text-emerald-800 dark:text-emerald-300",
            icon: CheckCircle2
        },
        warning: {
            bg: "bg-amber-50 dark:bg-amber-900/10",
            border: "border-amber-100 dark:border-amber-900/20",
            text: "text-amber-800 dark:text-amber-300",
            icon: AlertCircle
        },
        danger: {
            bg: "bg-red-50 dark:bg-red-900/10",
            border: "border-red-100 dark:border-red-900/20",
            text: "text-red-800 dark:text-red-300",
            icon: XCircle
        }
    };

    const variant = variants[type];
    const Icon = variant.icon;

    return (
        <div className={`
            flex gap-4 p-5 rounded-3xl border transition-all duration-300
            ${variant.bg} ${variant.border} ${variant.text} ${className}
        `}>
            <div className="mt-0.5">
                <Icon size={20} />
            </div>
            <div className="flex-1">
                {title && <h4 className="font-bold text-sm mb-1">{title}</h4>}
                <div className="text-sm opacity-90">{children}</div>
            </div>
        </div>
    );
};

export default Alert;
