/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import SummaryPanel from './components/SummaryPanel';
import SpendingDonut from './components/SpendingDonut';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import CurrencyConverter from './components/CurrencyConverter';
import BudgetSection from './components/BudgetSection';
import { Transaction, SpendingData } from './types';
import { getTransactions, addTransaction, getMonthlyData, deleteTransaction } from './services/expenseService';
import { useCurrency, CURRENCIES, CurrencyCode } from './contexts/CurrencyContext';
import { cn } from './lib/utils';
import { Search, Bell, ChevronDown, AlertCircle, Loader2, Menu, ArrowRight } from 'lucide-react';
import { LayoutDashboard, Receipt, Wallet, BarChart3, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { globalCurrency, setGlobalCurrency, convertAmount } = useCurrency();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTransactions();
      const mData = await getMonthlyData();
      setTransactions(data);
      setMonthlyData(mData);
    } catch (err) {
      setError('Could not load transactions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (newTransaction: Omit<Transaction, 'id'>) => {
    try {
      const saved = await addTransaction(newTransaction);
      setTransactions(prev => [saved, ...prev]);
    } catch (err) {
      console.error('Failed to add transaction', err);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete transaction', err);
    }
  };

  // Derived data
  const baseBalance = monthlyData?.chartData.reduce((acc: number, val: number) => acc + val, 0) || 15100; // Past accumulated balance
  const totalBalance = convertAmount(baseBalance); 
  
  // Current month balance based on live transactions
  const thisMonthIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const thisMonthExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const thisMonthBalance = convertAmount(thisMonthIncome - thisMonthExpense);
  
  const monthlyChange = monthlyData?.monthlyChange || 0;
  const chartData = monthlyData?.chartData.map((d: number) => convertAmount(d)) || [30, 45, 40, 60, 55, 80, 70, 95];
  
  const spendingBreakdown: SpendingData[] = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const total = expenses.reduce((acc, t) => acc + Math.abs(t.amount), 0);
    if (total === 0) return [];
    
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

    const colors: Record<string, string> = {
      Food: '#f43f5e',
      Travel: '#3b82f6',
      Shopping: '#a855f7',
      Education: '#6366f1',
      Utilities: '#f59e0b',
      Entertainment: '#ec4899',
      Health: '#14b8a6',
      Other: '#64748b'
    };

    return Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      value: Math.round((amount / total) * 100),
      color: colors[name] || colors.Other
    }));
  }, [transactions]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="hidden lg:block">
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView} 
          onAddExpense={() => setIsFormOpen(true)}
        />
      </div>

      <main className="lg:pl-64 min-h-screen">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-3 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 lg:hidden">
            <h1 className="text-lg md:text-xl font-bold tracking-tight">ExpensePro</h1>
          </div>

          <div className="flex-1 max-w-md hidden sm:block">
            {/* Search bar removed */}
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="relative group/currency hidden lg:block">
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none font-bold w-8 flex justify-center text-sm">
                {CURRENCIES[globalCurrency].symbol}
              </div>
              <select
                value={globalCurrency}
                onChange={(e) => setGlobalCurrency(e.target.value as CurrencyCode)}
                className="appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl py-2 pl-11 pr-10 text-sm font-bold text-slate-700 outline-none cursor-pointer focus:outline-none transition-all shadow-sm"
              >
                {Object.keys(CURRENCIES).map(curr => (
                  <option key={curr} value={curr} className="font-bold">{curr} - {CURRENCIES[curr as CurrencyCode].name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover/currency:text-blue-500 transition-colors">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden lg:block" />
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-600">Alex Chen</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"></p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-blue-100 transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-3 md:p-8 pb-28 lg:pb-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-3 font-medium shadow-sm"
            >
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
              <button onClick={fetchData} className="ml-auto text-sm font-bold underline">Retry</button>
            </motion.div>
          )}

          {activeView === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-stretch">
              {/* Left Column: Summary and Donut */}
              <div className="lg:col-span-8 flex flex-col gap-5 md:gap-8">
                <div className="flex flex-col gap-5 md:gap-8">
                  <div>
                    <SummaryPanel 
                      totalBalance={totalBalance} 
                      thisMonthBalance={thisMonthBalance}
                      monthlyChange={monthlyChange} 
                      data={chartData} 
                    />
                  </div>
                  <div>
                    <SpendingDonut data={spendingBreakdown} />
                  </div>
                </div>
                
                <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Transactions</h3>
                    <button 
                      onClick={() => setActiveView('transactions')}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 transition-all group"
                    >
                      View All
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                  <ExpenseList transactions={transactions.slice(0, 5)} onDelete={handleDeleteExpense} />
                </div>
              </div>

              {/* Right Column: Currency Converter */}
              <div className="lg:col-span-4">
                <CurrencyConverter />
              </div>
            </div>
          )}

          {activeView === 'transactions' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900">All Transactions</h2>
              </div>
              <ExpenseList transactions={transactions} itemsPerPage={10} onDelete={handleDeleteExpense} />
            </div>
          )}

          {activeView === 'budgets' && (
            <div className="w-full">
              <BudgetSection transactions={transactions} />
            </div>
          )}

          {activeView === 'reports' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-6">Reports</h2>
              <SpendingDonut data={spendingBreakdown} />
            </div>
          )}

          {activeView === 'settings' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Global Currency</label>
                  <div className="relative group/currency w-full max-w-sm">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none font-bold w-8 flex justify-center text-lg">
                      {CURRENCIES[globalCurrency].symbol}
                    </div>
                    <select
                      value={globalCurrency}
                      onChange={(e) => setGlobalCurrency(e.target.value as CurrencyCode)}
                      className="appearance-none w-full bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl py-3 pl-14 pr-10 text-base font-bold text-slate-700 outline-none cursor-pointer focus:border-blue-500 transition-all shadow-sm"
                    >
                      {Object.keys(CURRENCIES).map(curr => (
                        <option key={curr} value={curr} className="font-bold">{curr} - {CURRENCIES[curr as CurrencyCode].name}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover/currency:text-blue-500 transition-colors">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && transactions.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center"
            >
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-600 font-bold tracking-tight text-lg">Preparing your finances...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 sm:px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-end justify-around z-40 lg:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'transactions', label: 'Logs', icon: Receipt },
          { id: 'budgets', label: 'Budget', icon: Wallet },
          { id: 'reports', label: 'Charts', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].filter(item => item.id !== activeView).slice(0, 2).map(item => (
          <button key={item.id} onClick={() => setActiveView(item.id)} className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors min-w-0 text-slate-500 hover:text-blue-600">
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-bold leading-tight">{item.label}</span>
          </button>
        ))}
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-12 h-12 bg-slate-950 text-white rounded-full flex items-center justify-center -mt-7 shadow-xl border-4 border-white transition-transform active:scale-95 flex-shrink-0"
        >
          <span className="text-xl font-bold">+</span>
        </button>
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'transactions', label: 'Logs', icon: Receipt },
          { id: 'budgets', label: 'Budget', icon: Wallet },
          { id: 'reports', label: 'Charts', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].filter(item => item.id !== activeView).slice(2, 4).map(item => (
          <button key={item.id} onClick={() => setActiveView(item.id)} className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors min-w-0 text-slate-500 hover:text-blue-600">
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-bold leading-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <ExpenseForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleAddExpense} 
      />
    </div>
  );
}

