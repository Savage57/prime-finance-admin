import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, TrendingUp } from 'lucide-react';
import type { Loan } from '../api/endpoints';

interface LoanCardProps {
  loan: Loan;
  onClick?: () => void;
}

export function LoanCard({ loan, onClick }: LoanCardProps) {
  const progress = (loan.repaidAmount / loan.amount) * 100;
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    defaulted: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-glass dark:shadow-glass-dark border border-gray-100 dark:border-gray-800 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
            <CreditCard className="h-6 w-6 text-brand-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Personal Loan
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Loan #{loan.id.slice(0, 8)}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[loan.status]}`}>
          {loan.status}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-gray-900 dark:text-white font-medium">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-2 bg-gradient-to-r from-brand-500 to-accent-teal rounded-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loan Amount</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ₦{loan.amount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              ₦{loan.remainingAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Next: {new Date(loan.nextPaymentDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-brand-600" />
            <span className="text-sm font-medium text-brand-600">
              ₦{loan.monthlyPayment.toLocaleString()}/mo
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}