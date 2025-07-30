import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 180, height = 80, className = "" }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 180 80" 
      className={className}
      style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}
    >
      {/* HSEQ - centrado */}
      <text x="90" y="35" fontSize="32" fontWeight="bold" letterSpacing="2" textAnchor="middle">
        <tspan fill="#ef4444">H</tspan>
        <tspan fill="#fbbf24" dx="8">S</tspan>
        <tspan fill="#10b981" dx="8">E</tspan>
        <tspan fill="#3b82f6" dx="8">Q</tspan>
      </text>
      {/* Manager - centrado */}
      <text x="90" y="60" fontSize="24" fontWeight="bold" letterSpacing="1" fill="#115e59" textAnchor="middle">Manager</text>
    </svg>
  );
};

export default Logo; 