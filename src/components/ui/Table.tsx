import React from 'react';
import { clsx } from 'clsx';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={clsx('min-w-full divide-y divide-gray-200 dark:divide-gray-700', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-gray-50 dark:bg-gray-800">
      {children}
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {children}
    </tbody>
  );
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={clsx('hover:bg-gray-50 dark:hover:bg-gray-800', className)}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={clsx(
      'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
      className
    )}>
      {children}
    </th>
  );
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={clsx('px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100', className)}>
      {children}
    </td>
  );
}