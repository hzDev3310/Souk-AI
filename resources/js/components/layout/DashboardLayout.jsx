import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, language } = useTheme();
  const isRTL = language === 'ar';

  useEffect(() => {
    // Set RTL direction on document
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [isRTL]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className={`flex w-full min-h-screen ${isDarkMode ? 'bg-darkgray' : 'bg-lightgray'}`}>
        {/* Desktop Sidebar - Left for LTR, Right for RTL */}
        <div className={`hidden xl:block ${isRTL ? 'order-2' : 'order-1'}`}>
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 ${isRTL ? 'xl:mr-[270px] order-1' : 'xl:ml-[270px] order-2'}`}>
          {/* Header */}
          <Header
            onMenuClick={() => setMobileMenuOpen(true)}
          />

          {/* Page Content */}
          <main className="p-6">
            <div className={`rounded-3xl min-h-[calc(100vh-140px)] p-6 border ${isDarkMode ? 'bg-dark border-darkborder' : 'bg-white border-border'}`}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar - Left for LTR, Right for RTL */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? 'right' : 'left'} className={`w-[270px] p-0 ${isDarkMode ? 'bg-dark border-darkborder' : 'bg-white border-border'}`}>
          <Sidebar onClose={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DashboardLayout;
