import React, { useState } from 'react';
import { X, ShoppingCart, Tag, Calendar, Loader2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Category, Transaction } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency, CURRENCIES } from '../contexts/CurrencyContext';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
}

const EXPENSE_CATEGORIES: Category[] = ['Food', 'Travel', 'Shopping', 'Education', 'Utilities', 'Entertainment', 'Health', 'Other'];

const ExpenseForm: React.FC<ExpenseFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Other');
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { globalCurrency } = useCurrency();

  const isIncome = transactionType === 'income';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        amount: isIncome ? Math.abs(parseFloat(amount)) : -Math.abs(parseFloat(amount)),
        category: isIncome ? 'Income' : category,
        date: new Date().toISOString(),
        type: transactionType
      });
      setName('');
      setAmount('');
      setCategory('Other');
      setTransactionType('expense');
      onClose();
    } catch (error) {
      console.error('Failed to add transaction', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className={cn("h-1.5 w-full transition-colors", isIncome ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-blue-600 to-indigo-600")} />
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">New Transaction</h2>
                  <p className="text-slate-500 font-medium mt-1 text-sm">Record an expense or income below.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Expense / Income Toggle */}
              <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setTransactionType('expense')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                    !isIncome ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('income')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                    isIncome ? "bg-emerald-500 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Income
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">{isIncome ? 'Source' : 'Expense Name'}</label>
                  <div className="relative group">
                    <ShoppingCart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isIncome ? "e.g., Freelance Payment" : "e.g., Monthly Cloud Subscription"}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className={cn("grid gap-4", isIncome ? "grid-cols-1" : "grid-cols-2")}>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Amount</label>
                    <div className="relative group">
                      <span className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center font-bold transition-colors", isIncome ? "text-emerald-500" : "text-slate-400 group-focus-within:text-blue-600")}>
                        {CURRENCIES[globalCurrency].symbol}
                      </span>
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className={cn("w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white outline-none transition-all font-bold text-slate-900", isIncome ? "focus:border-emerald-500" : "focus:border-blue-600")}
                      />
                    </div>
                  </div>

                  {!isIncome && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                      <div className="relative group">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as Category)}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                        >
                          {EXPENSE_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className={cn(
                      "w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-white",
                      isIncome 
                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" 
                        : "bg-slate-950 hover:bg-slate-900 shadow-slate-200"
                    )}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <span>{isIncome ? 'Add Income' : 'Add Expense'}</span>
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <PlusCircle className="w-6 h-6" />
                        </motion.div>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const PlusCircle = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export default ExpenseForm;
