import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Trash2, HelpCircle } from 'lucide-react';

const ConfirmDialog = ({
    show,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message,
    type = 'warning',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isProcessing = false
}) => {
    const icons = {
        warning: { color: 'text-amber-500', bg: 'bg-amber-100', icon: AlertTriangle },
        danger: { color: 'text-red-500', bg: 'bg-red-100', icon: Trash2 },
        question: { color: 'text-blue-500', bg: 'bg-blue-100', icon: HelpCircle }
    };

    const config = icons[type] || icons.warning;
    const Icon = config.icon;

    return (
        <Modal show={show} onClose={onClose} showClose={false} size="sm">
            <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 ${config.bg} rounded-full flex items-center justify-center mb-6`}>
                    <Icon className={config.color} size={36} />
                </div>

                <h3 className="text-2xl font-bold mb-3">{title}</h3>
                <p className="text-gray-500 mb-8 leading-relaxed px-4">{message}</p>

                <div className="flex gap-4 w-full">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                        disabled={isProcessing}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={type === 'danger' ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        className="flex-1"
                        isLoading={isProcessing}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;
