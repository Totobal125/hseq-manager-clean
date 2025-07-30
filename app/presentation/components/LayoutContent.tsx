"use client";
import { useAuth } from "@/app/context/AuthContext";

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { isAuthenticated } = useAuth();

  return (
    <main className={`p-4 md:p-6 min-h-screen transition-all duration-300 ${
      isAuthenticated ? 'md:ml-72 ml-0 pt-16 md:pt-6' : 'ml-0'
    }`}>
      {children}
    </main>
  );
}