import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useCreateTransfer } from '../hooks/useTransfers';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'amount' | 'confirm' | 'processing' | 'success' | 'error';

export function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [description, setDescription] = useState('');
  const [transferType, setTransferType] = useState<'internal' | 'external'>('internal');
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const createTransfer = useCreateTransfer();

  const handleSubmit = async () => {
    setStep('processing');
    
    try {
      await createTransfer.mutateAsync({
        amount: parseFloat(amount),
        recipientAccount: transferType === 'external' ? recipientAccount : undefined,
        type: transferType,
        description,
        idempotencyKey,
      });
      setStep('success');
    } catch (error) {
      setStep('error');
    }
  };

  const handleClose = () => {
    setStep('amount');
    setAmount('');
    setRecipientAccount('');
    setDescription('');
    onClose();
  };

  const fee = transferType === 'external' ? parseFloat(amount || '0') * 0.01 : 0;
  const totalAmount = parseFloat(amount || '0') + fee;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Transfer Money
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center space-x-2 mb-6">
              {(['amount', 'confirm', 'processing'] as const).map((stepName, index) => (
                <div
                  key={stepName}
                  className={`flex-1 h-2 rounded-full ${
                    index <= (['amount', 'confirm', 'processing', 'success', 'error'].indexOf(step))
                      ? 'bg-brand-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 'amount' && (
                <motion.div
                  key="amount"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Transfer Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setTransferType('internal')}
                        className={`p-3 text-sm rounded-lg border ${
                          transferType === 'internal'
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Internal Transfer
                      </button>
                      <button
                        onClick={() => setTransferType('external')}
                        className={`p-3 text-sm rounded-lg border ${
                          transferType === 'external'
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        External Transfer
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount (₦)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="Enter amount"
                    />
                  </div>

                  {transferType === 'external' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Recipient Account
                      </label>
                      <input
                        type="text"
                        value={recipientAccount}
                        onChange={(e) => setRecipientAccount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        placeholder="Enter account number"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="What's this for?"
                    />
                  </div>

                  <Button
                    onClick={() => setStep('confirm')}
                    disabled={!amount || (transferType === 'external' && !recipientAccount)}
                    className="w-full"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount</span>
                      <span className="font-medium text-gray-900 dark:text-white">₦{amount}</span>
                    </div>
                    {fee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Fee</span>
                        <span className="font-medium text-gray-900 dark:text-white">₦{fee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                      <span className="font-medium text-gray-900 dark:text-white">Total</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₦{totalAmount.toFixed(2)}</span>
                    </div>
                    {transferType === 'external' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">To Account</span>
                        <span className="font-medium text-gray-900 dark:text-white">{recipientAccount}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Do not press submit twice. An idempotency key prevents duplicate processing.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => setStep('amount')} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1">
                      Confirm Transfer
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Processing your transfer...</p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Transfer Successful!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your transfer of ₦{amount} has been processed.
                  </p>
                  <Button onClick={handleClose} className="w-full">
                    Done
                  </Button>
                </motion.div>
              )}

              {step === 'error' && (
                <motion.div
                  key="error"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Transfer Failed
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Unable to process your transfer. Please try again.
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={handleClose} className="flex-1">
                      Close
                    </Button>
                    <Button onClick={() => setStep('amount')} className="flex-1">
                      Try Again
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}