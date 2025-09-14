import React, { useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Button } from './Button';

interface LoanCalculatorProps {
  onApply?: (amount: number, term: number) => void;
}

export function LoanCalculator({ onApply }: LoanCalculatorProps) {
  const [amount, setAmount] = useState(50000);
  const [term, setTerm] = useState(12);

  const springAmount = useSpring(amount, { stiffness: 100, damping: 30 });
  const displayAmount = useTransform(springAmount, (value) => 
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(value)
  );

  const interestRate = 0.18; // 18% annual
  const monthlyRate = interestRate / 12;
  const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
    (Math.pow(1 + monthlyRate, term) - 1);

  const quickAmounts = [10000, 50000, 100000, 200000, 500000];

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
  };

  const handleApply = () => {
    onApply?.(amount, term);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-glass dark:shadow-glass-dark border border-gray-100 dark:border-gray-800"
    >
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Loan Calculator</h3>
      
      {/* Amount Display */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Loan Amount
        </label>
        <motion.div className="text-4xl font-bold text-brand-600 mb-4">
          {displayAmount}
        </motion.div>
        
        {/* Amount Slider */}
        <div className="relative">
          <input
            type="range"
            min="10000"
            max="1000000"
            step="10000"
            value={amount}
            onChange={(e) => handleAmountChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-brand-500 to-accent-teal rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        
        {/* Quick Select Chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => handleAmountChange(quickAmount)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                amount === quickAmount
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              ₦{(quickAmount / 1000).toFixed(0)}k
            </button>
          ))}
        </div>
      </div>

      {/* Term Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Repayment Term (months)
        </label>
        <select
          value={term}
          onChange={(e) => setTerm(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        >
          <option value={6}>6 months</option>
          <option value={12}>12 months</option>
          <option value={18}>18 months</option>
          <option value={24}>24 months</option>
          <option value={36}>36 months</option>
        </select>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Payment</span>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            ₦{monthlyPayment.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Interest Rate</span>
          <span className="text-sm text-gray-900 dark:text-white">{(interestRate * 100).toFixed(0)}% per annum</span>
        </div>
      </div>

      <Button onClick={handleApply} className="w-full" size="lg">
        Apply for Loan
      </Button>
    </motion.div>
  );
}