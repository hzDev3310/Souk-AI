import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Globe,
} from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { isDarkMode, toggleTheme, language, changeLanguage } = useTheme();
  const { user, logout } = useAuth();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isSticky
          ? isDarkMode ? 'bg-dark shadow-md' : 'bg-white shadow-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="flex items-center justify-between h-20 px-6">
        {/* Left side - Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="xl:hidden p-2 rounded-lg hover:bg-lightprimary text-link hover:text-primary transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-lightprimary text-link hover:text-primary transition-colors">
                <Globe size={18} />
                <span className="text-sm font-medium uppercase">{language}</span>
                <ChevronDown size={14} className="text-darklink" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-32 border-darkborder ${isDarkMode ? 'bg-dark' : 'bg-white'}`}>
              <DropdownMenuItem
                onClick={() => changeLanguage('en')}
                className={`cursor-pointer ${language === 'en' ? 'text-primary bg-lightprimary' : isDarkMode ? 'text-link hover:bg-lightprimary' : 'text-foreground hover:bg-lightprimary'}`}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => changeLanguage('fr')}
                className={`cursor-pointer ${language === 'fr' ? 'text-primary bg-lightprimary' : isDarkMode ? 'text-link hover:bg-lightprimary' : 'text-foreground hover:bg-lightprimary'}`}
              >
                Français
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => changeLanguage('ar')}
                className={`cursor-pointer ${language === 'ar' ? 'text-primary bg-lightprimary' : isDarkMode ? 'text-link hover:bg-lightprimary' : 'text-foreground hover:bg-lightprimary'}`}
              >
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-lightprimary text-link hover:text-primary transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-lightprimary text-link hover:text-primary transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-lightprimary text-link hover:text-primary transition-colors ml-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-link">{user?.name || 'User'}</p>
                  <p className="text-xs text-darklink">{user?.role || 'Admin'}</p>
                </div>
                <ChevronDown size={16} className="text-darklink" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-56 border-darkborder ${isDarkMode ? 'bg-dark' : 'bg-white'}`}>
              <DropdownMenuLabel className={isDarkMode ? 'text-link' : 'text-foreground'}>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-darkborder" />
              <DropdownMenuItem className={`cursor-pointer ${isDarkMode ? 'text-link hover:text-primary hover:bg-lightprimary' : 'text-foreground hover:text-primary hover:bg-lightprimary'}`}>
                <User size={16} className="mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className={`cursor-pointer ${isDarkMode ? 'text-link hover:text-primary hover:bg-lightprimary' : 'text-foreground hover:text-primary hover:bg-lightprimary'}`}>
                <Settings size={16} className="mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-darkborder" />
              <DropdownMenuItem
                onClick={handleLogout}
                className={`cursor-pointer ${isDarkMode ? 'text-link hover:text-error hover:bg-lighterror' : 'text-foreground hover:text-error hover:bg-lighterror'}`}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export default Header;
