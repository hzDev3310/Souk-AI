import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Get locale from URL or HTML lang attribute
const locale = document.documentElement.lang || 'en';

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: locale,
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: `/translations/{{lng}}`,
        },
    });

export default i18n;
