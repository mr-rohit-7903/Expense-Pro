import React, { useState } from 'react';
import { Transaction } from '../types';
import { Coffee, Car, Megaphone, Zap, Wallet, ShoppingBag, ArrowRight, Receipt, BookOpen, Film, Activity, ChevronLeft, ChevronRight, Trash2, AlertCircle } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { useCurrency } from '../contexts/CurrencyContext';
import { motion, AnimatePresence } from 'motion/react';

interface ExpenseListProps {
  transactions: Transaction[];
  itemsPerPage?: number;
  onDelete?: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  Food: { icon: Coffee, color: 'text-rose-500', bg: 'bg-rose-50' },
  Travel: { icon: Car, color: 'text-blue-500', bg: 'bg-blue-50' },
  Shopping: { icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-50' },
  Education: { icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  Utilities: { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  Entertainment: { icon: Film, color: 'text-pink-500', bg: 'bg-pink-50' },
  Health: { icon: Activity, color: 'text-teal-500', bg: 'bg-teal-50' },
  Income: { icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  Other: { icon: Megaphone, color: 'text-slate-500', bg: 'bg-slate-50' },
};

const ExpenseList: React.FC<ExpenseListProps> = ({ transactions, itemsPerPage, onDelete }) => {
  const { globalCurrency, convertAmount } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isPaginated = itemsPerPage !== undefined && itemsPerPage > 0;
  const totalPages = isPaginated ? Math.max(1, Math.ceil(transactions.length / itemsPerPage)) : 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const startIndex = isPaginated ? (safeCurrentPage - 1) * itemsPerPage : 0;
  const endIndex = isPaginated ? startIndex + itemsPerPage : transactions.length;
  
  const currentTransactions = transactions.slice(startIndex, endIndex);

  let lastMonth = '';

  const changePage = (newPage: number) => {
    setDirection(newPage > safeCurrentPage ? 1 : -1);
    setCurrentPage(newPage);
  };

  const confirmDelete = () => {
    if (deletingId && onDelete) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-white relative">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={safeCurrentPage}
            custom={direction}
            initial={(d: number) => ({ opacity: 0, x: d > 0 ? 30 : -30 })}
            animate={{ opacity: 1, x: 0 }}
            exit={(d: number) => ({ opacity: 0, x: d > 0 ? -30 : 30 })}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="divide-y divide-slate-50 w-full"
          >
            {currentTransactions.map((t) => {
              const config = CATEGORY_ICONS[t.category] || CATEGORY_ICONS.Other;
              const Icon = config.icon;
              
              const date = new Date(t.date);
              const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
              const showMonthHeader = monthYear !== lastMonth;
              lastMonth = monthYear;

              return (
                <motion.div layout initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} key={t.id}>
                  {showMonthHeader && (
                    <div className="bg-slate-50/80 px-4 md:px-6 py-2 border-b border-t border-slate-100 first:border-t-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{monthYear}</span>
                    </div>
                  )}
                  <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group bg-white">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                      <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0", config.bg, config.color)}>
                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 leading-tight text-sm md:text-base truncate">{t.name}</h4>
                        <p className="text-xs font-medium text-slate-500 mt-0.5 uppercase tracking-wider">
                          {t.category} • {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center justify-end gap-2 md:gap-3 flex-shrink-0 ml-2">
                      <div>
                        <p className={cn(
                          "font-bold text-sm md:text-lg leading-tight",
                          t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                        )}>
                          {t.type === 'income' ? '+' : ''}{formatCurrency(convertAmount(Math.abs(t.amount)), globalCurrency)}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {t.type === 'income' ? 'ACH Transfer' : 'Debit Card'}
                        </p>
                      </div>
                      {onDelete && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDeletingId(t.id); }}
                          className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {transactions.length === 0 && (
              <div className="p-12 text-center bg-white">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No transactions found.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {isPaginated && totalPages > 1 && (
        <div className="px-4 md:px-6 py-3 md:py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 bg-white/50 backdrop-blur-sm sticky bottom-0 z-10 w-full mt-auto">
          <span className="text-xs md:text-sm font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to <span className="font-bold text-slate-900">{Math.min(endIndex, transactions.length)}</span> of <span className="font-bold text-slate-900">{transactions.length}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => changePage(Math.max(1, safeCurrentPage - 1))}
              disabled={safeCurrentPage === 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 hidden sm:flex">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let startPage = Math.max(1, safeCurrentPage - 2);
                let endPage = startPage + 4;
                if (endPage > totalPages) {
                  endPage = totalPages;
                  startPage = Math.max(1, endPage - 4);
                }
                const pageNum = startPage + i;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => changePage(pageNum)}
                    className={cn(
                      "w-9 h-9 rounded-xl text-sm font-bold transition-all relative",
                      safeCurrentPage === pageNum 
                        ? "text-white" 
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    {safeCurrentPage === pageNum && (
                      <motion.div
                        layoutId="activePage"
                        className="absolute inset-0 bg-slate-900 rounded-xl shadow-md shadow-slate-200"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{pageNum}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => changePage(Math.min(totalPages, safeCurrentPage + 1))}
              disabled={safeCurrentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setDeletingId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden relative z-10 border border-slate-100"
            >
              <div className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Transaction?</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">
                  Are you sure you want to delete this expense? This action cannot be undone.
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <button 
                    onClick={() => setDeletingId(null)}
                    className="flex-1 px-5 py-3 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 px-5 py-3 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all shadow-md shadow-rose-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpenseList;
