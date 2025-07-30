"use client";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  isMobileSidebarOpen: boolean;
  isDesktopSidebarOpen: boolean;
  login: () => void;
  logout: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleDesktopSidebar: () => void;
  closeSidebar: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const tokenExists = document.cookie.includes("auth_token=");
        setIsAuthenticated(tokenExists);
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsAuthenticated(false);
    setIsMobileSidebarOpen(false);
    setIsDesktopSidebarOpen(true);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
  };

  const closeSidebar = () => {
    setIsMobileSidebarOpen(false);
    setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      isMobileSidebarOpen,
      isDesktopSidebarOpen,
      login, 
      logout,
      toggleMobileSidebar,
      closeMobileSidebar,
      toggleDesktopSidebar,
      closeSidebar
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
