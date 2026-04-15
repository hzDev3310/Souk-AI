import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const { isDarkMode, toggleTheme, language, changeLanguage } = useTheme();
    const { t } = useTranslation();
    const { showToast } = useNotification();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [pendingApproval, setPendingApproval] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSwitchChange = (checked) => {
        setFormData({ ...formData, remember: checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPendingApproval(false);
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            showToast(t('auth.login.successToast') || 'Success!', 'success');
            navigate('/dashboard');
        } else {
            if (result.pendingApproval) {
                setPendingApproval(true);
                showToast(t('auth.login.errorPending') || 'Account pending approval', 'warning');
            } else {
                showToast(result.message || t('auth.login.errorInvalid') || 'Invalid credentials', 'error');
            }
        }

        setLoading(false);
    };

    // SAUL text particles/positions
    const saulLetters = [
        { char: 'S', x: 15, y: 25, size: 120, rotation: -5 },
        { char: 'O', x: 40, y: 15, size: 150, rotation: 12 },
        { char: 'U', x: 65, y: 35, size: 130, rotation: -8 },
        { char: 'K', x: 85, y: 20, size: 140, rotation: 15 },
    ];

    // Additional scattered SAUL text instances
    const scatteredSaul = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: 0.6 + Math.random() * 0.8,
        opacity: 0.05 + Math.random() * 0.1,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 20,
    }));

    // Floating particles animation
    const particles = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 20 + Math.random() * 30,
        delay: Math.random() * 10,
        size: 2 + Math.random() * 4,
    }));

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center bg-background text-foreground transition-colors duration-500 relative overflow-hidden">

            {/* Rich Gradient Orbs (More Vibrant) */}
            <motion.div
                className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-gradient-to-br from-primary/30 via-blue-400/20 to-transparent rounded-full blur-[60px] pointer-events-none"
                animate={{
                    scale: [1, 1.15, 1],
                    x: [0, 30, 0],
                    y: [0, 20, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-gradient-to-tr from-secondary/30 via-primary/10 to-transparent rounded-full blur-[60px] pointer-events-none"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, -40, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-1/4 left-1/4 w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Background Texture: Grid & Noise */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h40v40H0V0zm1 1h38v38H1V1z" fill="%23000" fill-opacity=".1" fill-rule="evenodd"/%3E%3C/svg%3E')` }} />

            {/* Large Background Letters (Clearer Visuals) */}
            {saulLetters.map((letter, idx) => (
                <motion.div
                    key={`saul-${idx}`}
                    className="absolute font-black text-primary/10 pointer-events-none select-none"
                    style={{
                        left: `${letter.x}%`,
                        top: `${letter.y}%`,
                        fontSize: `${letter.size}px`,
                        transformOrigin: 'center center',
                    }}
                    animate={{
                        opacity: [0.05, 0.12, 0.05],
                        y: [0, -20, 0],
                        rotate: [letter.rotation, letter.rotation + 5, letter.rotation],
                    }}
                    transition={{
                        duration: 10,
                        delay: idx * 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {letter.char}
                </motion.div>
            ))}

            {/* Scattered SAUL Text */}
            {scatteredSaul.map((item) => (
                <motion.div
                    key={`scattered-${item.id}`}
                    className="absolute font-bold text-primary/15 pointer-events-none select-none"
                    style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        fontSize: `${16 + Math.random() * 24}px`,
                        rotate: `${Math.random() * 360}deg`,
                    }}
                    animate={{
                        opacity: [0.03, 0.1, 0.03],
                        scale: [item.scale, item.scale * 1.15, item.scale],
                    }}
                    transition={{
                        duration: item.duration,
                        delay: item.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    SOUK AI
                </motion.div>
            ))}

            {/* Floating Particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute bg-primary/20 rounded-full blur-[1px]"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -150, 0],
                        x: [0, (Math.random() - 0.5) * 50, 0],
                        opacity: [0, 0.6, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Cursor Follower (Elegant Glow) */}
            <motion.div
                className="fixed w-[250px] h-[250px] bg-primary/10 rounded-full blur-[80px] pointer-events-none z-0"
                animate={{
                    x: mousePosition.x - 125,
                    y: mousePosition.y - 125,
                }}
                transition={{
                    type: "spring",
                    damping: 35,
                    stiffness: 150,
                    mass: 0.4
                }}
            />

            {/* Top Bar Selectors */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="absolute top-6 right-6 flex items-center gap-3 z-50 px-4 py-2 bg-background/20 backdrop-blur-sm rounded-full border border-border/50 shadow-sm"
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 hover:bg-primary/10 transition-colors">
                            <Languages className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover/90 backdrop-blur-md border-border">
                        <DropdownMenuItem onClick={() => changeLanguage('en')} className={`cursor-pointer ${language === 'en' ? 'bg-primary/10 text-primary' : ''}`}>English</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLanguage('fr')} className={`cursor-pointer ${language === 'fr' ? 'bg-primary/10 text-primary' : ''}`}>Français</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLanguage('ar')} className={`cursor-pointer ${language === 'ar' ? 'bg-primary/10 text-primary' : ''}`}>العربية</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="w-[1px] h-4 bg-border" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="rounded-full w-9 h-9 hover:bg-primary/10 transition-colors"
                >
                    <motion.div
                        animate={{ rotate: isDarkMode ? 180 : 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </motion.div>
                </Button>
            </motion.div>

            {/* Login Card */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                className="relative z-10 w-full max-w-[480px] px-6"
            >
                <CardBox className="p-0 backdrop-blur-sm bg-card/75 border-border/60 shadow-2xl overflow-hidden rounded-[32px]">

                    {/* Top Accent Gradient */}
                    <div className="h-2 w-full bg-gradient-to-r from-primary via-blue-400 to-secondary opacity-80" />

                    <div className="p-10">
                        {/* Logo & Header */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-10"
                        >
                            <div className="relative inline-block mb-3">
                                <motion.div
                                    className="absolute -inset-2 bg-primary/20 rounded-full blur-md"
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                <h1 className="relative text-4xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent tracking-tight">
                                    Souk AI
                                </h1>
                            </div>
                            <p className="text-muted-foreground font-medium text-sm">
                                {t('auth.login.subtitle')}
                            </p>
                        </motion.div>

                        {/* Feature Badges (Interactive) */}
                        <div className="flex justify-center gap-3 mb-10">
                            {[
                                { icon: Sparkles, text: "AI Powered" },
                                { icon: Shield, text: "Secure" },
                                { icon: Zap, text: "Fast" }
                            ].map((badge, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -3, scale: 1.05 }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 hover:border-primary/20 transition-all duration-300"
                                >
                                    <badge.icon className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-[11px] font-bold text-foreground/70 uppercase tracking-widest">{badge.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div className="group">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block px-1 flex items-center gap-2 group-focus-within:text-primary transition-colors">
                                    <Mail className="w-4 h-4" />
                                    {t('auth.login.email')}
                                </Label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                    className="h-12 bg-muted/30 border-border/50 focus:bg-background transition-all rounded-2xl"
                                />
                            </div>

                            {/* Password */}
                            <div className="group">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block px-1 flex items-center gap-2 group-focus-within:text-primary transition-colors">
                                    <Lock className="w-4 h-4" />
                                    {t('auth.login.password')}
                                </Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        className="h-12 bg-muted/30 border-border/50 focus:bg-background pr-12 transition-all rounded-2xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2 cursor-pointer group">
                                    <Switch
                                        id="remember"
                                        checked={formData.remember}
                                        onCheckedChange={handleSwitchChange}
                                        className="data-[state=checked]:bg-primary transition-colors"
                                    />
                                    <label htmlFor="remember" className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer">
                                        {t('auth.login.remember')}
                                    </label>
                                </div>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-bold text-primary hover:text-primaryemphasis underline-offset-4 hover:underline transition-all"
                                >
                                    {t('auth.login.forgotPassword')}
                                </Link>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-2xl bg-primary hover:bg-primaryemphasis text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        {t('auth.login.submitting')}
                                    </div>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {t('auth.login.submit')}
                                        <Sparkles className="w-5 h-5 opacity-50 group-hover:scale-125 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        {/* Footer */}
                        <div className="mt-10 pt-8 border-t border-border/50 text-center">
                            <p className="text-muted-foreground font-medium flex items-center justify-center gap-2">
                                {t('auth.login.noAccount')}
                                <Link
                                    to="/register"
                                    className="text-primary font-bold hover:text-primaryemphasis transition-colors"
                                >
                                    {t('auth.login.createAccount')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </CardBox>
            </motion.div>
        </div>
    );
};

export default Login;