import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, language } = useTheme();
  const isRTL = language === 'ar';
  const location = useLocation();

  useEffect(() => {
    // Set RTL direction on document
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [isRTL]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex w-full min-h-screen bg-background transition-colors duration-500">
        {/* Desktop Sidebar */}
        <div className={`hidden xl:block ${isRTL ? 'order-2' : 'order-1'} transition-all`}>
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${isRTL ? 'xl:mr-[280px] order-1' : 'xl:ml-[280px] order-2'}`}>
          {/* Header */}
          <Header
            onMenuClick={() => setMobileMenuOpen(true)}
          />

          {/* Page Content with Transitions */}
          <main className="p-4 md:p-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="rounded-[40px] min-h-[calc(100vh-140px)] p-4 md:p-8 border bg-card/40 backdrop-blur-md border-border/60 shadow-inner relative overflow-hidden"
                >
                    {/* Glassmorphism Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="relative z-10">
                        <Outlet />
                    </div>
                </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? 'right' : 'left'} className="w-[280px] p-0 bg-card border-border">
          <Sidebar onClose={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DashboardLayout;
