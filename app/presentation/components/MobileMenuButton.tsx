'use client';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

interface MobileMenuButtonProps {
  onToggle: (isOpen: boolean) => void;
}

export default function MobileMenuButton({ onToggle }: MobileMenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className="mobile-menu-btn touch-friendly"
      aria-label="Toggle mobile menu"
    >
      {isOpen ? (
        <FiX className="w-6 h-6" />
      ) : (
        <FiMenu className="w-6 h-6" />
      )}
    </button>
  );
} 