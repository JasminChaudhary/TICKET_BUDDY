import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Chatbot from './Chatbot';
import Footer from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const Layout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10 lg:py-12 max-w-[95%] sm:max-w-[90%] md:max-w-7xl overflow-hidden">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* Fixed position chatbot button */}
      {!isMobile && <Chatbot />}
    </div>
  );
};

export default Layout;
