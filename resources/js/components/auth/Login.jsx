import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Languages, Mail, Lock, Eye, EyeOff, Sparkles, Shield, Zap } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useTheme } from '../../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import CardBox from '../shared/CardBox';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { login, isAuthenticated, loading: authLoading } = useAuth();
    const { isDarkMode, toggleTheme, language, changeLanguage } = useTheme();
    const { t } = useTranslation();
    const { showToast } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const postAuthPath =
        location.state?.from?.pathname &&
        location.state.from.pathname !== '/dashboard/login'
            ? location.state.from.pathname
            : '/dashboard';
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate(postAuthPath, { replace: true });
        }
    }, [authLoading, isAuthenticated, navigate, postAuthPath]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSwitchChange = (checked) => {
        setFormData({ ...formData, remember: checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            if (result.user?.role === 'CLIENT') {
                showToast(t('auth.login.useStorefront') || 'Use the shop login for customer accounts.', 'warning');
                window.location.href = '/login';
                return;
            }
            showToast(t('auth.login.successToast') || 'Success!', 'success');
            navigate(postAuthPath, { replace: true });
        } else {
            if (result.pendingApproval) {
                showToast(t('auth.login.errorPending') || 'Account pending approval', 'warning');
            } else {
                showToast(result.message || t('auth.login.errorInvalid') || 'Invalid credentials', 'error');
            }
        }

        setLoading(false);
    };

    const badges = [
        { icon: Sparkles, text: t('auth.login.badgeAi') },
        { icon: Shield, text: t('auth.login.badgeSecure') },
        { icon: Zap, text: t('auth.login.badgeFast') },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center bg-background text-foreground relative overflow-hidden">
            {/* Static soft background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-90"
                aria-hidden
            >
                <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
                <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
            </div>
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        'url(\'data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h40v40H0V0zm1 1h38v38H1V1z" fill="%23000" fill-opacity=".1" fill-rule="evenodd"/%3E%3C/svg%3E\')',
                }}
                aria-hidden
            />

            <div className="absolute top-6 right-6 z-50 flex items-center gap-3 rounded-full border border-border/50 bg-background/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10">
                            <Languages className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-border bg-popover/95 backdrop-blur-md">
                        <DropdownMenuItem onClick={() => changeLanguage('en')} className={`cursor-pointer ${language === 'en' ? 'bg-primary/10 text-primary' : ''}`}>English</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLanguage('fr')} className={`cursor-pointer ${language === 'fr' ? 'bg-primary/10 text-primary' : ''}`}>Français</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLanguage('ar')} className={`cursor-pointer ${language === 'ar' ? 'bg-primary/10 text-primary' : ''}`}>العربية</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="h-4 w-px bg-border" />
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 rounded-full hover:bg-primary/10">
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
            </div>

            <div className="relative z-10 w-full max-w-[480px] px-6">
                <CardBox className="overflow-hidden rounded-[32px] border-border/60 bg-card/90 p-0 shadow-xl backdrop-blur-sm">
                    <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-400 to-secondary opacity-90" />
                    <div className="p-10">
                        <div className="mb-10 text-center">
                            <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground">
                                Souk AI
                            </h1>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('auth.login.subtitle')}
                            </p>
                        </div>

                        <div className="mb-8 flex flex-wrap justify-center gap-2">
                            {badges.map(({ icon: Icon, text }) => (
                                <div
                                    key={text}
                                    className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5"
                                >
                                    <Icon className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/70">
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group">
                                <Label className="mb-2 flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary">
                                    <Mail className="h-4 w-4" />
                                    {t('auth.login.email')}
                                </Label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                    className="h-12 rounded-2xl border-border/50 bg-muted/30 transition-colors focus:bg-background"
                                />
                            </div>

                            <div className="group">
                                <Label className="mb-2 flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary">
                                    <Lock className="h-4 w-4" />
                                    {t('auth.login.password')}
                                </Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        className="h-12 rounded-2xl border-border/50 bg-muted/30 pr-12 transition-colors focus:bg-background"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <div className="group flex cursor-pointer items-center gap-2">
                                    <Switch
                                        id="remember"
                                        checked={formData.remember}
                                        onCheckedChange={handleSwitchChange}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                    <label htmlFor="remember" className="cursor-pointer text-sm font-semibold text-muted-foreground group-hover:text-foreground">
                                        {t('auth.login.remember')}
                                    </label>
                                </div>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-bold text-primary underline-offset-4 hover:underline"
                                >
                                    {t('auth.login.forgotPassword')}
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-12 w-full rounded-2xl text-base font-bold shadow-md"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        {t('auth.login.submitting')}
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        {t('auth.login.submit')}
                                        <Sparkles className="h-4 w-4 opacity-70" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="mt-10 border-t border-border/50 pt-8 text-center">
                            <p className="flex flex-wrap items-center justify-center gap-1 font-medium text-muted-foreground">
                                {t('auth.login.noAccount')}
                                <Link to="/dashboard/register" className="font-bold text-primary hover:text-primaryemphasis">
                                    {t('auth.login.createAccount')}
                                </Link>
                            </p>
                            <p className="mt-4 text-xs text-muted-foreground">
                                {t('auth.login.customerHint', { defaultValue: 'Shopping as a customer?' })}{' '}
                                <a href="/login" className="font-bold text-primary hover:underline">
                                    {t('auth.login.customerLogin', { defaultValue: 'Customer sign in' })}
                                </a>
                            </p>
                        </div>
                    </div>
                </CardBox>
            </div>
        </div>
    );
};

export default Login;
