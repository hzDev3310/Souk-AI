import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, MoveLeft } from 'lucide-react';

const AdminPageLayout = ({ 
    title, 
    subtitle, 
    icon: Icon, 
    onAdd, 
    addLabel,
    children,
    onBack,
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    {onBack && (
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={onBack}
                            className="mt-1 rounded-xl bg-card border border-border/50 hover:bg-muted"
                        >
                            <MoveLeft className="w-5 h-5 rtl:rotate-180" />
                        </Button>
                    )}
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            {Icon && <Icon className="w-6 h-6 text-primary" />}
                            <h1 className="text-3xl font-black text-foreground tracking-tight">
                                {t(title) || title}
                            </h1>
                            <div className="hidden sm:block">
                                <Sparkles className="w-5 h-5 text-primary/40 animate-pulse" />
                            </div>
                        </div>
                        <p className="text-muted-foreground font-medium text-sm">
                            {t(subtitle) || subtitle}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {onAdd && (
                        <Button 
                            onClick={onAdd}
                            className="h-12 px-6 rounded-2xl bg-primary text-white font-bold text-base hover:bg-primaryemphasis transition-all shadow-xl shadow-primary/20 flex items-center gap-2 group"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            {t(addLabel) || addLabel || t('common.actions.add')}
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative">
                {children}
            </div>
        </div>
    );
};

export default AdminPageLayout;
