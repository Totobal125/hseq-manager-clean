'use client';
import { useAuth } from '@/app/context/AuthContext';
import MobileMenuButton from './MobileMenuButton';
import MobileOverlay from './MobileOverlay';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  sidebarComponent: React.ReactNode;
}

export default function ResponsiveWrapper({ children, sidebarComponent }: ResponsiveWrapperProps) {
  const { isAuthenticated, isMobileSidebarOpen, isDesktopSidebarOpen, toggleMobileSidebar, closeMobileSidebar, toggleDesktopSidebar } = useAuth();

  return (
    <div className="no-horizontal-scroll">
      {/* Mobile Menu Button - Solo visible en móvil cuando está autenticado Y el sidebar está cerrado */}
      {isAuthenticated && !isMobileSidebarOpen && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-[1000] md:hidden bg-slate-900 text-white p-3 rounded-lg shadow-lg hover:bg-slate-800 transition-all duration-200"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Desktop Menu Button - Solo visible en desktop cuando el sidebar está cerrado */}
      {isAuthenticated && !isDesktopSidebarOpen && (
        <button
          onClick={toggleDesktopSidebar}
          className="fixed top-4 left-4 z-[1000] hidden md:block bg-slate-900 text-white p-3 rounded-lg shadow-lg hover:bg-slate-800 transition-all duration-200"
          aria-label="Abrir sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      
      {/* Mobile Overlay */}
      {isAuthenticated && (
        <MobileOverlay isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />
      )}
      
      {/* Sidebar */}
      {sidebarComponent}
      
      {/* Main Content */}
      {children}
    </div>
  );
} 