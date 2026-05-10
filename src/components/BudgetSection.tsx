import React, { useState, useMemo } from 'react';
import { useCurrency, CURRENCIES } from '../contexts/CurrencyContext';
import { Transaction, Category } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Coffee, Car, ShoppingBag, BookOpen, Zap, Film, Activity, Megaphone } from 'lucide-react';

interface BudgetSectionProps {
  transactions: Transaction[];
}

const CATEGORY_ICONS: Record<string, any> = {
  Food: { icon: Coffee, color: 'text-rose-500', bg: 'bg-rose-50' },
  Travel: { icon: Car, color: 'text-blue-500', bg: 'bg-blue-50' },
  Shopping: { icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-50' },
  Education: { icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  Utilities: { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  Entertainment: { icon: Film, color: 'text-pink-500', bg: 'bg-pink-50' },
  Health: { icon: Activity, color: 'text-teal-500', bg: 'bg-teal-50' },
  Other: { icon: Megaphone, color: 'text-slate-500', bg: 'bg-slate-50' },
};

const CATEGORIES: Category[] = ['Food', 'Travel', 'Shopping', 'Education', 'Utilities', 'Entertainment', 'Health', 'Other'];

const BudgetSection: React.FC<BudgetSectionProps> = ({ transactions }) => {
  const { globalCurrency, convertAmount } = useCurrency();
  const [isBudgetCreated, setIsBudgetCreated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [budgets, setBudgets] = useState<Record<string, string>>({
    Food: '',
    Travel: '',
    Shopping: '',
    Education: '',
    Utilities: '',
    Entertainment: '',
    Health: '',
    Other: ''
  });

  const categoryTotals = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    return expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);
  }, [transactions]);

  const handleBudgetChange = (cat: string, value: string) => {
    setBudgets(prev => ({ ...prev, [cat]: value }));
  };

  const saveBudget = () => {
    setIsBudgetCreated(true);
    setIsEditing(false);
  };

  const totalBudget = Object.values(budgets).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  const totalSpent = Object.keys(CATEGORY_ICONS).reduce((acc, cat) => acc + convertAmount(categoryTotals[cat] || 0), 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (!isBudgetCreated && !isEditing) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 w-full max-w-4xl mx-auto text-center">
        <div className="w-20 h-20 bg-slate-50 border-2 border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-2">No Budget Allocated</h2>
        <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
          You haven't set up a monthly budget yet. Allocate funds to different categories to track your spending.
        </p>
        <button 
          onClick={() => setIsEditing(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-xl shadow-slate-200"
        >
          Allocate Budget
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Allocate Budget</h2>
        <p className="text-slate-500 font-medium mb-8">Assign limits to each category for this month.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {CATEGORIES.map(cat => {
            const config = CATEGORY_ICONS[cat];
            const Icon = config.icon;
            return (
              <div key={cat} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", config.bg, config.color)}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-bold text-slate-700 block mb-1">{cat}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{CURRENCIES[globalCurrency].symbol}</span>
                    <input
                      type="number"
                      min="0"
                      value={budgets[cat]}
                      onChange={(e) => handleBudgetChange(cat, e.target.value)}
                      placeholder="0"
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-4 border-t border-slate-100 pt-6">
          {isBudgetCreated && (
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={saveBudget}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-xl shadow-blue-200"
          >
            Save Budget
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Monthly Budget Allocations</h2>
          <p className="text-slate-500 font-medium">Tracking your spending against your set limits.</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-colors"
        >
          Edit Budget
        </button>
      </div>
      
      {/* Overall Budget */}
      <div className="p-6 bg-slate-900 rounded-2xl text-white mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Total Budget Usage</span>
            <h3 className="text-2xl md:text-3xl font-bold mt-1">
              {formatCurrency(totalSpent, globalCurrency)} <span className="text-slate-400 text-xl font-medium">/ {formatCurrency(totalBudget, globalCurrency)}</span>
            </h3>
          </div>
          <div className="text-right">
            <span className={cn("px-3 py-1 rounded-full text-xs font-bold", overallPercentage > 90 ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300")}>
              {overallPercentage.toFixed(1)}% Used
            </span>
          </div>
        </div>
        <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all", overallPercentage > 90 ? "bg-rose-500" : "bg-blue-500")} 
            style={{ width: `${Math.min(overallPercentage, 100)}%` }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map(cat => {
          const config = CATEGORY_ICONS[cat];
          const Icon = config.icon;
          const spent = convertAmount(categoryTotals[cat] || 0);
          const limit = parseFloat(budgets[cat]) || 0;
          const percentage = limit > 0 ? (spent / limit) * 100 : (spent > 0 ? 100 : 0);
          const isOverBudget = percentage > 100;

          return (
            <div key={cat} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.bg, config.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{cat}</h4>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{percentage.toFixed(0)}% Used</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900">{formatCurrency(limit, globalCurrency)}</span>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Limit</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm text-slate-600">Spent: {formatCurrency(spent, globalCurrency)}</span>
                <span className="font-semibold text-sm text-slate-600">Left: {formatCurrency(Math.max(limit - spent, 0), globalCurrency)}</span>
              </div>
              
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all", isOverBudget ? "bg-rose-500" : percentage > 85 ? "bg-amber-400" : "bg-emerald-500")} 
                  style={{ width: `${Math.min(percentage, 100)}%` }} 
                />
              </div>
              {isOverBudget && (
                <p className="text-xs font-bold text-rose-500 mt-2">Over budget by {formatCurrency(spent - limit, globalCurrency)}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetSection;
