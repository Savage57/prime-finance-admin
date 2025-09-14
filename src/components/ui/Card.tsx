import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      whileHover={hover ? { y: -2 } : undefined}
      onClick={onClick}
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
        hover && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('px-6 py-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={clsx('text-lg font-semibold text-gray-900 dark:text-white', className)}>
      {children}
    </h3>
  );
}