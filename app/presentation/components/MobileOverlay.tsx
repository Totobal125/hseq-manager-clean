'use client';

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileOverlay({ isOpen, onClose }: MobileOverlayProps) {
  return (
    <div 
      className={`fixed inset-0 bg-black/50 z-[998] transition-all duration-300 md:hidden ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={onClose}
    />
  );
} 