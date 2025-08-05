// Responsive Classes Configuration
// These classes can be added to existing components without modifying their structure

export const responsiveClasses = {
  // Layout classes
  layout: {
    mainContent: 'main-content',
    sidebarMobile: 'sidebar-mobile',
    sidebarOverlay: 'sidebar-overlay',
    mobileMenuBtn: 'mobile-menu-btn',
    responsiveContainer: 'responsive-container',
    noHorizontalScroll: 'no-horizontal-scroll',
    safeArea: 'safe-area',
    touchFriendly: 'touch-friendly'
  },

  // Typography classes
  typography: {
    mobileTextXl: 'mobile-text-xl',
    mobileText2xl: 'mobile-text-2xl',
    mobileText3xl: 'mobile-text-3xl',
    mobileText4xl: 'mobile-text-4xl'
  },

  // Grid classes
  grid: {
    mobileGrid1: 'mobile-grid-1',
    mobileGrid2: 'mobile-grid-2'
  },

  // Spacing classes
  spacing: {
    mobileP4: 'mobile-p-4',
    mobileP6: 'mobile-p-6',
    mobileMb4: 'mobile-mb-4',
    mobileMb6: 'mobile-mb-6',
    mobileMb8: 'mobile-mb-8',
    mobileGap4: 'mobile-gap-4',
    mobileGap6: 'mobile-gap-6'
  },

  // Component specific classes
  components: {
    loginContainer: 'login-container',
    loginCard: 'login-card',
    loginLeftPanel: 'login-left-panel',
    loginRightPanel: 'login-right-panel',
    mobileLogo: 'mobile-logo',
    mobileChartHeight: 'mobile-chart-height',
    mobileFormSpace: 'mobile-form-space',
    mobileHide: 'mobile-hide',
    mobileShow: 'mobile-show'
  }
};

// Utility function to combine responsive classes
export function combineResponsiveClasses(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

// Predefined responsive class combinations
export const responsiveCombinations = {
  // Card responsive
  card: combineResponsiveClasses(
    responsiveClasses.spacing.mobileP4,
    responsiveClasses.spacing.mobileMb6
  ),

  // Form responsive
  form: combineResponsiveClasses(
    responsiveClasses.components.mobileFormSpace,
    responsiveClasses.spacing.mobileP4
  ),

  // Chart responsive
  chart: combineResponsiveClasses(
    responsiveClasses.components.mobileChartHeight,
    responsiveClasses.spacing.mobileP4
  ),

  // Logo responsive
  logo: combineResponsiveClasses(
    responsiveClasses.components.mobileLogo
  ),

  // Grid responsive
  grid: combineResponsiveClasses(
    responsiveClasses.grid.mobileGrid1,
    responsiveClasses.spacing.mobileGap4
  )
}; 