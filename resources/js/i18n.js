import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations directly
import en from '../lang/en.json';
import fr from '../lang/fr.json';
import ar from '../lang/ar.json';

const resources = {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
};

// Get locale from URL or HTML lang attribute
const locale = document.documentElement.lang || 'en';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: locale,
        fallbackLng: 'en',
        debug: false,
        keySeparator: false,
        nsSeparator: false,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
