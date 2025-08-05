"use client";
import { useState, useEffect } from 'react';

interface AnimatedLineProps {
  width: string;
  height: string;
  color: string;
  speed?: number;
  delay?: number;
  fadeOutDelay?: number;
  fadeOutSpeed?: number;
  className?: string;
}

export default function AnimatedLine({ 
  width, 
  height, 
  color, 
  speed = 50, 
  delay = 0,
  fadeOutDelay = 2000,
  fadeOutSpeed = 50,
  className = "" 
}: AnimatedLineProps) {
  const [currentWidth, setCurrentWidth] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Convertir width de Tailwind a píxeles
  const getWidthInPx = (widthClass: string) => {
    const widthMap: { [key: string]: number } = {
      'w-1': 4, 'w-2': 8, 'w-3': 12, 'w-4': 16, 'w-5': 20,
      'w-6': 24, 'w-8': 32, 'w-10': 40, 'w-12': 48, 'w-16': 64,
      'w-20': 80, 'w-24': 96, 'w-32': 128, 'w-40': 160, 'w-48': 192,
      'w-56': 224, 'w-64': 256, 'w-72': 288, 'w-80': 320, 'w-96': 384,
      'w-auto': 200, 'w-full': 400, 'w-screen': 400
    };
    return widthMap[widthClass] || 100;
  };

  const maxWidth = getWidthInPx(width);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;

    if (!isFadingOut && currentWidth < maxWidth) {
      // Dibujando la línea
      const timer = setTimeout(() => {
        setCurrentWidth(prev => Math.min(prev + 2, maxWidth));
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentWidth === maxWidth && !isFadingOut) {
      // Cuando termina de dibujarse, inicia el fade out después del delay
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, fadeOutDelay);

      return () => clearTimeout(fadeOutTimer);
    } else if (isFadingOut && currentWidth > 0) {
      // Desdibujando la línea desde el final
      const timer = setTimeout(() => {
        setCurrentWidth(prev => Math.max(prev - 2, 0));
      }, fadeOutSpeed);

      return () => clearTimeout(timer);
    }
  }, [currentWidth, maxWidth, speed, isStarted, fadeOutDelay, fadeOutSpeed, isFadingOut]);

  return (
    <div 
      className={`${height} ${color} ${className}`}
      style={{ width: `${currentWidth}px` }}
    />
  );
} 