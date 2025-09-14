import React from 'react';
import { motion } from 'framer-motion';

interface RingProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export function RingProgress({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  className = '',
  children 
}: RingProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
          }}
          animate={{
            strokeDashoffset: strokeDashoffset,
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#00BFA6" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}