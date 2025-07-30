'use client';
import { useState, useEffect } from 'react';
import MobileMenuButton from './MobileMenuButton';
import MobileOverlay from './MobileOverlay';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  sidebarComponent: React.ReactNode;
}

export default function ResponsiveWrapper({ children, sidebarComponent }: ResponsiveWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleMobileMenuToggle = (isOpen: boolean) => {
    setIsMobileMenuOpen(isOpen);
  };

  const handleOverlayClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="no-horizontal-scroll">
      {/* Mobile Menu Button */}
      <MobileMenuButton onToggle={handleMobileMenuToggle} />
      
      {/* Mobile Overlay */}
      <MobileOverlay isOpen={isMobileMenuOpen} onClose={handleOverlayClose} />
      
      {/* Sidebar with mobile classes */}
      <div className={`sidebar-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
        {sidebarComponent}
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
} 