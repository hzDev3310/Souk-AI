import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
    Moon, Sun, Languages, Mail, Lock, Eye, EyeOff, Sparkles, Shield, Zap, 
    User, Smartphone, CreditCard, Building, MapPin, ChevronLeft, ArrowRight
} from 'lucide-react';
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

const Register = () => {
    const { register } = useAuth();
    const { isDarkMode, toggleTheme, language, changeLanguage } = useTheme();
    const { t } = useTranslation();
    const { showToast } = useNotification();
    const navigate = useNavigate();
    
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        family_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        address: '',
        city: '',
        code_postal: '',
        referral_code: '',
        phone: '',
        cin: '',
        store_name_fr: '',
        store_name_ar: '',
        store_name_en: '',
        matricule_fiscale: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const selectRole = (selectedRole) => {
        setRole(selectedRole);
        setStep(2);
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

    const renderRoleSelection = () => (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-foreground mb-2">
                    {t('auth.register.selectRoleTitle') || 'Choose Your Path'}
                </h3>
                <p className="text-muted-foreground text-sm">
                    {t('auth.register.selectRoleSubtitle') || 'Select the account type that best fits your needs.'}
                </p>
            </div>

            <div className="grid gap-4">
                {[
                    { id: 'CLIENT', icon: User, label: t('auth.register.client'), desc: t('auth.register.clientDesc'), color: 'bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary' },
                    { id: 'INFLUENCER', icon: Sparkles, label: t('auth.register.influencer'), desc: t('auth.register.influencerDesc'), color: 'bg-secondary/5 border-secondary/20 hover:bg-secondary/10 hover:border-secondary' },
                    { id: 'STORE', icon: Building, label: t('auth.register.store'), desc: t('auth.register.storeDesc'), color: 'bg-success/5 border-success/20 hover:bg-success/10 hover:border-success' }
                ].map((item) => (
                    <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectRole(item.id)}
                        className={`w-full p-5 flex items-center gap-4 text-left border-2 rounded-2xl transition-all duration-300 ${item.color}`}
                    >
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-muted/30 flex items-center justify-center shadow-sm">
                            <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <div className="font-bold text-foreground">{item.label}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                        </div>
                        <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground opacity-50" />
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );

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

    const renderRoleSpecificFields = () => {
        switch (role) {
            case 'CLIENT':
                return (
                    <div className="space-y-4 pt-4 border-t border-border/50">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t('auth.register.address')}</Label>
                            <Input name="address" value={formData.address} onChange={handleChange} placeholder="123 Street..." className="bg-muted/30 border-border/50 rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t('auth.register.city')}</Label>
                                <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="bg-muted/30 border-border/50 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t('auth.register.postalCode')}</Label>
                                <Input name="code_postal" value={formData.code_postal} onChange={handleChange} placeholder="0000" className="bg-muted/30 border-border/50 rounded-xl" />
                            </div>
                        </div>
                    </div>
                );
            case 'INFLUENCER':
                return (
                    <div className="space-y-4 pt-4 border-t border-border/50">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t('auth.register.phone')}</Label>
                                <Input name="phone" value={formData.phone} onChange={handleChange} required placeholder="+216..." className="bg-muted/30 border-border/50 rounded-xl" />
                                {errors.phone && <p className="text-error text-[10px] px-1 font-bold">{errors.phone[0]}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t('auth.register.cin')}</Label>
                                <Input name="cin" value={formData.cin} onChange={handleChange} required placeholder="ID Number" className="bg-muted/30 border-border/50 rounded-xl" />
                                {errors.cin && <p className="text-error text-[10px] px-1 font-bold">{errors.cin[0]}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t('auth.register.referralCode')}</Label>
                            <Input name="referral_code" value={formData.referral_code} onChange={handleChange} required placeholder="CODE123" className="bg-muted/30 border-border/50 rounded-xl" />
                            {errors.referral_code && <p className="text-error text-[10px] px-1 font-bold">{errors.referral_code[0]}</p>}
                        </div>
                    </div>
                );
            case 'STORE':
                return (
                    <div className="space-y-4 pt-4 border-t border-border/50">
                        <p className="text-sm text-muted-foreground">
                            {t('auth.register.storeInfoMessage') || 'Your store details will be set up in your profile after registration.'}
                        </p>
                    </div>
                );
            default: return null;
        }
    };

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
                                <p className="text-muted-foreground mb-8 text-lg">{role === 'CLIENT' ? t('auth.register.successClient') : t('auth.register.successOther')}</p>
                                <Button asChild className="w-full h-14 rounded-2xl bg-primary hover:bg-primaryemphasis text-lg font-bold shadow-xl shadow-primary/20">
                                    <Link to="/login">{t('auth.register.goToLogin')}</Link>
                                </Button>
                            </motion.div>
                        ) : (
                            <>
                                <div className="text-center mb-10">
                                    <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">Souk AI</h1>
                                    <p className="text-muted-foreground font-medium text-sm">{t('auth.register.subtitle')}</p>
                                </div>

                                <AnimatePresence mode="wait">
                                    {step === 1 ? renderRoleSelection() : (
                                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                            <button onClick={() => setStep(1)} className="mb-6 flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                                                <ChevronLeft className="w-5 h-5" /> {t('auth.register.back')}
                                            </button>
                                            
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                {renderCommonFields()}
                                                {renderRoleSpecificFields()}
                                                
                                                {errors.general && <div className="p-4 bg-error/10 text-error rounded-xl text-sm font-bold border border-error/20">{errors.general}</div>}

                                                <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-primary hover:bg-primaryemphasis text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                                    {loading ? t('auth.register.submitting') : t('auth.register.submit')}
                                                </Button>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="mt-10 pt-8 border-t border-border/50 text-center">
                                    <p className="text-muted-foreground font-medium">
                                        {t('auth.register.haveAccount')} <Link to="/login" className="text-primary font-bold hover:text-primaryemphasis ml-1">{t('auth.register.signIn')}</Link>
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
