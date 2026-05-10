import React, { useState } from 'react';
import { RefreshCw, TrendingUp, Info, ChevronDown, ArrowDownUp } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { useCurrency, CURRENCIES, CurrencyCode } from '../contexts/CurrencyContext';
import { motion } from 'motion/react';

const CurrencyConverter: React.FC = () => {
  const { globalCurrency } = useCurrency();
  const [amount, setAmount] = useState<string>('1000');
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>(globalCurrency);
  const [isLoading, setIsLoading] = useState(false);

  const amountNum = parseFloat(amount) || 0;
  // Convert from 'fromCurrency' to 'USD', then from 'USD' to 'toCurrency'
  const convertedAmount = (amountNum / CURRENCIES[fromCurrency].rate) * CURRENCIES[toCurrency].rate;

  const refreshRate = () => {
    setIsLoading(true);
    fetch('https://api.frankfurter.app/latest?from=USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          Object.keys(CURRENCIES).forEach(key => {
            if (key !== 'USD' && data.rates[key]) {
              CURRENCIES[key as CurrencyCode].rate = data.rates[key];
            }
          });
          // Force re-render
          setAmount(prev => prev);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="bg-white pt-6 px-4 pb-10 md:pt-8 md:px-8 md:pb-14 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6 md:mb-8">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Currency Insights</h3>
          <p className="text-slate-500 font-medium text-xs md:text-sm mt-1">Real-time rates from Frankfurter API.</p>
        </div>
        <button 
          onClick={refreshRate}
          className={cn(
            "p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-95",
            isLoading && "animate-spin text-blue-600"
          )}
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Convert From</label>
          <div className="flex items-center justify-between p-3 md:p-5 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all group/input">
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 pr-2">
              <div className="relative flex-shrink-0">
                <select 
                  value={fromCurrency} 
                  onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                  className="w-[90px] h-12 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm outline-none pl-4 pr-8 cursor-pointer appearance-none transition-colors"
                >
                  {Object.keys(CURRENCIES).map(curr => <option key={curr} value={curr}>{curr}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none" />
              </div>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-2xl md:text-3xl font-black text-slate-900 outline-none w-full min-w-0 tracking-tight placeholder:text-slate-200"
                placeholder="0.00"
              />
            </div>
            <span className="text-lg md:text-xl text-slate-300 font-black px-1 md:px-2 group-focus-within/input:text-blue-200 transition-colors flex-shrink-0">{CURRENCIES[fromCurrency].symbol}</span>
          </div>
        </div>

        <div className="flex justify-center -my-5 relative z-10">
          <button 
            onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }} 
            className="bg-white p-3 rounded-full border border-slate-100 shadow-md shadow-slate-200/50 text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:scale-110 active:scale-95 transition-all"
          >
            <ArrowDownUp className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">To (Estimated)</label>
          <div className="flex items-center justify-between p-3 md:p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl md:rounded-3xl shadow-lg shadow-blue-900/20 border border-blue-500">
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 pr-2">
              <div className="relative flex-shrink-0">
                <select 
                  value={toCurrency} 
                  onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                  className="w-[90px] h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm outline-none pl-4 pr-8 cursor-pointer appearance-none transition-colors backdrop-blur-md"
                >
                  {Object.keys(CURRENCIES).map(curr => <option key={curr} value={curr} className="text-slate-900">{curr}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
              </div>
              <span className="text-2xl md:text-3xl font-black text-white tracking-tight truncate w-full min-w-0">
                {isLoading ? '...' : formatCurrency(convertedAmount, toCurrency).replace(CURRENCIES[toCurrency].symbol, '').trim()}
              </span>
            </div>
            <span className="text-lg md:text-xl text-blue-300 font-black px-1 md:px-2 flex-shrink-0">{CURRENCIES[toCurrency].symbol}</span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-50">
          <div className="flex items-center gap-2 text-emerald-600 mb-3">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Exchange Rates: 1 {fromCurrency}</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(CURRENCIES)
              .filter(([code]) => code !== fromCurrency)
              .map(([code, curr]) => {
                const rate = ((1 / CURRENCIES[fromCurrency].rate) * curr.rate);
                return (
                  <div 
                    key={code} 
                    className={cn(
                      "p-3 rounded-xl border transition-all",
                      code === toCurrency
                        ? "bg-blue-50 border-blue-200"
                        : "bg-slate-50 border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base font-black text-slate-400 w-12 text-center flex-shrink-0">{curr.symbol}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{code}</p>
                          <p className="text-[9px] text-slate-400 font-medium truncate">{curr.name}</p>
                        </div>
                      </div>
                      <span className={cn("text-sm font-bold tabular-nums flex-shrink-0 ml-1", code === toCurrency ? "text-blue-600" : "text-slate-700")}>
                        {rate < 10 ? rate.toFixed(4) : rate < 1000 ? rate.toFixed(2) : rate.toFixed(0)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
