'use client';
import { useResponsive } from '../../hooks/useResponsive';

interface ResponsiveUtilsProps {
  children: React.ReactNode;
  mobileClass?: string;
  tabletClass?: string;
  desktopClass?: string;
}

export function ResponsiveContainer({ 
  children, 
  mobileClass = '', 
  tabletClass = '', 
  desktopClass = '' 
}: ResponsiveUtilsProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getResponsiveClass = () => {
    if (isMobile) return mobileClass;
    if (isTablet) return tabletClass;
    if (isDesktop) return desktopClass;
    return '';
  };

  return (
    <div className={`responsive-container ${getResponsiveClass()}`}>
      {children}
    </div>
  );
}

export function MobileOnly({ children }: { children: React.ReactNode }) {
  const { isMobile } = useResponsive();
  return isMobile ? <>{children}</> : null;
}

export function DesktopOnly({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useResponsive();
  return isDesktop ? <>{children}</> : null;
}

export function TabletAndUp({ children }: { children: React.ReactNode }) {
  const { isTablet, isDesktop } = useResponsive();
  return (isTablet || isDesktop) ? <>{children}</> : null;
} 