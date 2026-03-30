import { createContext, useContext, useEffect, useState } from 'react';
import en from '../Locales/en.json';
import ar from '../Locales/ar.json';
import fr from '../Locales/fr.json';

const translations = { en, ar, fr };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('lang') || 'en';
        }
        return 'en';
    });

    const [dir, setDir] = useState(lang === 'ar' ? 'rtl' : 'ltr');

    useEffect(() => {
        const root = window.document.documentElement;
        const currentDir = lang === 'ar' ? 'rtl' : 'ltr';
        setDir(currentDir);
        root.setAttribute('lang', lang);
        root.setAttribute('dir', currentDir);
        localStorage.setItem('lang', lang);
    }, [lang]);

    /**
     * Translation helper: usage t('auth.login.title')
     */
    const t = (path) => {
        const keys = path.split('.');
        let result = translations[lang] || translations.en;
        
        for (const key of keys) {
            if (result[key]) {
                result = result[key];
            } else {
                // Fallback to English
                let fallback = translations.en;
                for (const fk of keys) {
                    fallback = fallback?.[fk];
                }
                return fallback || path;
            }
        }
        return result;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, dir, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
