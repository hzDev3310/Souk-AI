import React from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    subtitle, 
    children, 
    footer, 
    maxWidth = "max-w-xl",
    icon: Icon = null
}) => {
    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
                {isOpen && (
                    <DialogPrimitive.Portal forceMount>
                        {/* Overlay */}
                        <DialogPrimitive.Overlay asChild>
                            <div
                                className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm"
                            />
                        </DialogPrimitive.Overlay>

                        {/* Content */}
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                            <DialogPrimitive.Content asChild aria-describedby={undefined}>
                                <div className={cn(
                                        "relative w-full max-h-[90vh] overflow-y-auto rounded-[32px] border border-border/60 bg-card/95 p-0 shadow-2xl backdrop-blur-lg overscroll-contain",
                                        maxWidth
                                    )}
                                >
                                    {/* Header Section */}
                                    <div className="relative p-8 pb-4 bg-gradient-to-br from-muted/30 via-muted/10 to-transparent border-b border-border/30 overflow-hidden">
                                        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-primary/30" />
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                {Icon && (
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                                        <Icon size={24} strokeWidth={2.5} />
                                                    </div>
                                                )}
                                                <div className="text-start">
                                                    <DialogPrimitive.Title className="text-2xl font-black text-foreground tracking-tight">
                                                        {title}
                                                    </DialogPrimitive.Title>
                                                    {subtitle && (
                                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                                            {subtitle}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <DialogPrimitive.Close className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                                                <X size={20} strokeWidth={2.5} />
                                            </DialogPrimitive.Close>
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="p-8 pt-4">
                                        {children}
                                    </div>

                                    {/* Footer Section */}
                                    {footer && (
                                        <div className="p-8 py-6 bg-muted/20 border-t border-border/30 flex items-center justify-end gap-3">
                                            {footer}
                                        </div>
                                    )}

                                    {/* Decorative Background Elements */}
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
                                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
                                </div>
                            </DialogPrimitive.Content>
                        </div>
                    </DialogPrimitive.Portal>
                )}
        </DialogPrimitive.Root>
    );
};

export default Modal;
