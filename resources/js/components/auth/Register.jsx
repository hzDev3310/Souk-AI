import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Languages, Building } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CardBox from '../shared/CardBox';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_LOGIN_PATH = '/dashboard/login';

const Register = () => {
    const { register, isAuthenticated, loading: authLoading } = useAuth();
    const { isDarkMode, toggleTheme, language, changeLanguage } = useTheme();
    const { t } = useTranslation();
    const { showToast } = useNotification();
    const navigate = useNavigate();
    
    const [role] = useState('STORE');
    const [formData, setFormData] = useState({
        name: '',
        family_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        store_name_fr: '',
        store_name_ar: '',
        store_name_en: '',
        matricule_fiscale: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [authLoading, isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        const data = { ...formData, role };
        const result = await register(data);

        if (result.success) {
            setSuccess(true);
            showToast(t('auth.register.successToast') || 'Registration successful!', 'success');
        } else {
            if (result.errors) {
                setErrors(result.errors);
            } else {
                setErrors({ general: result.message });
            }
        }
        setLoading(false);
    };

    // Background Elements (Same as Login)
    const saulLetters = [
        { char: 'S', x: 10, y: 30, size: 100, rotation: -10 },
        { char: 'O', x: 35, y: 10, size: 130, rotation: 15 },
        { char: 'U', x: 60, y: 40, size: 110, rotation: -5 },
        { char: 'K', x: 90, y: 15, size: 120, rotation: 20 },
    ];

    const particles = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 25 + Math.random() * 35,
        delay: Math.random() * 10,
        size: 2 + Math.random() * 3,
    }));

    const renderCommonFields = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t('auth.register.firstName')}</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} required placeholder="John" className="bg-muted/30 border-border/50 rounded-xl" />
                    {errors.name && <p className="text-error text-[10px] px-1 font-bold">{errors.name[0]}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t('auth.register.lastName')}</Label>
                    <Input name="family_name" value={formData.family_name} onChange={handleChange} required placeholder="Doe" className="bg-muted/30 border-border/50 rounded-xl" />
                    {errors.family_name && <p className="text-error text-[10px] px-1 font-bold">{errors.family_name[0]}</p>}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t('auth.register.email')}</Label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="bg-muted/30 border-border/50 rounded-xl" />
                {errors.email && <p className="text-error text-[10px] px-1 font-bold">{errors.email[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t('auth.register.password')}</Label>
                    <Input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="bg-muted/30 border-border/50 rounded-xl" />
                    {errors.password && <p className="text-error text-[10px] px-1 font-bold">{errors.password[0]}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t('auth.register.confirmPassword')}</Label>
                    <Input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required placeholder="••••••••" className="bg-muted/30 border-border/50 rounded-xl" />
                </div>
            </div>
        </div>
    );

    const renderStoreFields = () => (
        <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t('auth.register.storeNameFr') || 'Store Name (FR)'}</Label>
                <Input name="store_name_fr" value={formData.store_name_fr} onChange={handleChange} required placeholder="Mon Magasin" className="bg-muted/30 border-border/50 rounded-xl" />
                {errors.store_name_fr && <p className="text-error text-[10px] px-1 font-bold">{errors.store_name_fr[0]}</p>}
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t('auth.register.matriculeFiscale') || 'Tax ID (Matricule Fiscale)'}</Label>
                <Input name="matricule_fiscale" value={formData.matricule_fiscale} onChange={handleChange} required placeholder="1234567890" className="bg-muted/30 border-border/50 rounded-xl" />
                {errors.matricule_fiscale && <p className="text-error text-[10px] px-1 font-bold">{errors.matricule_fiscale[0]}</p>}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center bg-background text-foreground transition-colors duration-500 relative overflow-hidden py-12">
            
            {/* Background (Same as Login) */}
            <motion.div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-gradient-to-br from-primary/30 via-blue-400/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
            <motion.div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-gradient-to-tr from-secondary/30 via-primary/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
            
            {saulLetters.map((letter, idx) => (
                <motion.div
                    key={`saul-${idx}`}
                    className="absolute font-black text-primary/10 pointer-events-none select-none"
                    style={{ left: `${letter.x}%`, top: `${letter.y}%`, fontSize: `${letter.size}px` }}
                    animate={{ opacity: [0.05, 0.12, 0.05], y: [0, -20, 0], rotate: [letter.rotation, letter.rotation + 5, letter.rotation] }}
                    transition={{ duration: 10, delay: idx * 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    {letter.char}
                </motion.div>
            ))}

            {/* Top Bar */}
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute top-6 right-6 flex items-center gap-3 z-50 px-4 py-2 bg-background/40 backdrop-blur-md rounded-full border border-border/50 shadow-sm">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 hover:bg-primary/10 transition-colors"><Languages className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover/90 backdrop-blur-lg border-border">
                        <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLanguage('fr')}>Français</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLanguage('ar')}>العربية</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="w-[1px] h-4 bg-border" />
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full w-9 h-9 hover:bg-primary/10 transition-colors">
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
            </motion.div>

            {/* Register Card */}
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative z-10 w-full max-w-[550px] px-6">
                <CardBox className="p-0 backdrop-blur-2xl bg-card/75 border-border/60 shadow-2xl overflow-hidden rounded-[32px]">
                    <div className="h-2 w-full bg-gradient-to-r from-primary via-blue-400 to-secondary opacity-80" />
                    
                    <div className="p-10">
                        {success ? (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                                </div>
                                <h2 className="text-3xl font-black text-foreground mb-4">{t('auth.register.successTitle')}</h2>
                                <p className="text-muted-foreground mb-8 text-lg">{t('auth.register.successOther')}</p>
                                <Button asChild className="w-full h-14 rounded-2xl bg-primary hover:bg-primaryemphasis text-lg font-bold shadow-xl shadow-primary/20">
                                    <Link to={ADMIN_LOGIN_PATH}>{t('auth.register.goToLogin')}</Link>
                                </Button>
                            </motion.div>
                        ) : (
                            <>
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Building className="w-8 h-8 text-primary" />
                                    </div>
                                    <h1 className="text-3xl font-black text-foreground mb-2">{t('auth.register.storeTitle') || 'Store Registration'}</h1>
                                    <p className="text-muted-foreground font-medium text-sm">{t('auth.register.storeSubtitle') || 'Create your store account to start selling'}</p>
                                </div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {renderCommonFields()}
                                        {renderStoreFields()}
                                        
                                        {errors.general && <div className="p-4 bg-error/10 text-error rounded-xl text-sm font-bold border border-error/20">{errors.general}</div>}

                                        <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-primary hover:bg-primaryemphasis text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                            {loading ? t('auth.register.submitting') : t('auth.register.submit')}
                                        </Button>
                                    </form>
                                </motion.div>

                                <div className="mt-10 pt-8 border-t border-border/50 text-center space-y-3">
                                    <p className="text-muted-foreground font-medium">
                                        {t('auth.register.haveAccount')} <Link to={ADMIN_LOGIN_PATH} className="text-primary font-bold hover:text-primaryemphasis ml-1">{t('auth.register.signIn')}</Link>
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {t('auth.register.customerHint', { defaultValue: 'Customer account?' })}{' '}
                                        <a href="/register" className="text-primary font-bold hover:underline">{t('auth.register.customerSignup', { defaultValue: 'Sign up on the shop' })}</a>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </CardBox>
            </motion.div>
        </div>
    );
};

export default Register;
