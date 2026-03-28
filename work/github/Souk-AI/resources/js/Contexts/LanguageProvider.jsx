import { createContext, useContext, useEffect, useState } from 'react';

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

    return (
        <LanguageContext.Provider value={{ lang, setLang, dir }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
