import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Welcome = () => {
    const { t, i18n } = useTranslation();
    const { isDarkMode, toggleTheme } = useTheme();
    const { isAuthenticated } = useAuth();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        // Also update the session/cookie via our Laravel route if we want persistence across pages
        // For now, React-only change is enough for this example
    };

    const containerStyle = {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: isDarkMode 
            ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)' 
            : 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        color: isDarkMode ? '#f7fafc' : '#1a202c',
        textAlign: 'center',
        transition: 'all 0.3s ease'
    };

    const buttonStyle = {
        padding: '0.8rem 1.5rem',
        margin: '0.5rem',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        backgroundColor: isDarkMode ? '#4a5568' : '#e2e8f0',
        color: isDarkMode ? '#f7fafc' : '#1a202c',
        transition: 'transform 0.1s ease',
    };

    return (
        <div style={containerStyle} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div style={{ position: 'absolute', top: '2rem', right: i18n.language === 'ar' ? 'auto' : '2rem', left: i18n.language === 'ar' ? '2rem' : 'auto' }}>
                <button 
                    onClick={toggleTheme} 
                    style={buttonStyle}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                </button>
            </div>

            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>Souk AI</h1>
            <p style={{ fontSize: '1.5rem', opacity: 0.9, maxWidth: '600px', marginBottom: '2rem' }}>
                {t('welcome_message', 'The project has been reset. Start building your amazing application!')}
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => changeLanguage('en')} style={{...buttonStyle, opacity: i18n.language === 'en' ? 1 : 0.6}}>English</button>
                <button onClick={() => changeLanguage('fr')} style={{...buttonStyle, opacity: i18n.language === 'fr' ? 1 : 0.6}}>Français</button>
                <button onClick={() => changeLanguage('ar')} style={{...buttonStyle, opacity: i18n.language === 'ar' ? 1 : 0.6}}>العربية</button>
            </div>

            {!isAuthenticated && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <Link to="/login" style={{...buttonStyle, backgroundColor: isDarkMode ? '#3182ce' : '#4299e1', color: 'white', textDecoration: 'none'}}>
                        Login
                    </Link>
                    <Link to="/register" style={{...buttonStyle, backgroundColor: isDarkMode ? '#38a169' : '#48bb78', color: 'white', textDecoration: 'none'}}>
                        Register
                    </Link>
                </div>
            )}

            <div style={{ 
                padding: '1rem', 
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
                borderRadius: '12px' 
            }}>
                <code style={{ fontSize: '1.2rem' }}>resources/js/components/Welcome.jsx</code>
            </div>
        </div>
    );
};

export default Welcome;
