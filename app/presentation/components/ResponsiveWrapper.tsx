'use client';
import { useAuth } from '@/app/context/AuthContext';
import MobileMenuButton from './MobileMenuButton';
import MobileOverlay from './MobileOverlay';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  sidebarComponent: React.ReactNode;
}

export default function ResponsiveWrapper({ children, sidebarComponent }: ResponsiveWrapperProps) {
  const { isAuthenticated, isMobileSidebarOpen, toggleMobileSidebar, closeMobileSidebar } = useAuth();

  return (
    <div className="no-horizontal-scroll">
      {/* Mobile Menu Button - Solo visible cuando está autenticado */}
      {isAuthenticated && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-[1001] md:hidden bg-slate-900 text-white p-3 rounded-lg shadow-lg hover:bg-slate-800 transition-all duration-200"
          aria-label={isMobileSidebarOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMobileSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
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