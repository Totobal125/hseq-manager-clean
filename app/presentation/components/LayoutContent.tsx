"use client";
import { useAuth } from "@/app/context/AuthContext";

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { isAuthenticated } = useAuth();

  return (
    <main className={`p-6 min-h-screen transition-all duration-300 ${
      isAuthenticated ? 'ml-72' : 'ml-0'
    }`}>
      {children}
    </main>
  );
}