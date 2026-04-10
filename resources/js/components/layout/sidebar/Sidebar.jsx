import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import SidebarContent from './SidebarItems';
import * as Icons from 'lucide-react';

const renderSidebarItems = (items, currentPath, isDarkMode, isRTL = false, onClose = () => {}) => {
  return items.map((item, index) => {
    const isSelected = currentPath === item?.url;
    const IconComponent = Icons[item.icon] || Icons.Circle;

    if (item.heading) {
      return (
        <div className="mb-2 mt-6 first:mt-0" key={item.heading}>
          <h3 className={`px-4 text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-darklink' : 'text-muted-foreground'}`}>
            {item.heading}
          </h3>
        </div>
      );
    }

    return (
      <div onClick={onClose} key={index}>
        <Link
          to={item.url || '#'}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg mx-2 mb-1
            transition-all duration-200
            ${isSelected
              ? 'bg-lightprimary text-primary font-medium'
              : isDarkMode
                ? 'text-link hover:bg-lightprimary hover:text-primary'
                : 'text-foreground hover:bg-lightprimary hover:text-primary'
            }
            ${isRTL ? 'flex-row-reverse' : ''}
          `}
        >
          <IconComponent size={20} />
          <span className="truncate flex-1">{item.name}</span>
        </Link>
      </div>
    );
  });
};

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { isDarkMode, language } = useTheme();
  const isRTL = language === 'ar';

  return (
    <aside className={`fixed top-0 z-40 h-screen w-[270px] ${isRTL ? 'right-0 border-l' : 'left-0 border-r'} ${isDarkMode ? 'bg-darkgray border-darkborder' : 'bg-white border-border'}`}>
      {/* Logo */}
      <div className={`flex items-center h-20 px-6 border-b ${isDarkMode ? 'border-darkborder' : 'border-border'}`}>
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-primary">
            Souk AI
          </div>
        </Link>
      </div>

      {/* Sidebar items */}
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="py-4">
          {SidebarContent.map((section, index) => (
            <div key={index}>
              {section.heading && (
                <h3 className={`px-6 text-xs font-bold uppercase tracking-wider mb-2 mt-6 first:mt-0 ${isDarkMode ? 'text-darklink' : 'text-muted-foreground'}`}>
                  {section.heading}
                </h3>
              )}
              <div className="space-y-1">
                {renderSidebarItems(
                  section.children || [],
                  pathname,
                  isDarkMode,
                  isRTL,
                  onClose
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
