import React from 'react';
import { Banknote, TrendingUp, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { BarChart, Bar, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { useCurrency } from '../contexts/CurrencyContext';

interface SummaryPanelProps {
  totalBalance: number;
  thisMonthBalance: number;
  monthlyChange: number;
  data: number[];
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ totalBalance, thisMonthBalance, monthlyChange, data }) => {
  const chartData = data.map((val, i) => ({ value: val, id: i }));
  const { globalCurrency } = useCurrency();

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-start mb-4 md:mb-6 gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 relative group/info cursor-default">
            Total Balance
            <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
            <div className="absolute left-0 bottom-full mb-2 w-48 bg-slate-900 text-white text-[10px] font-medium p-2 rounded-lg opacity-0 group-hover/info:opacity-100 pointer-events-none transition-opacity text-center shadow-xl z-50 normal-case tracking-normal">
              Your overall accumulated balance. This month's balance will be added at the end of the month.
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight truncate" title={formatCurrency(totalBalance, globalCurrency)}>
            {formatCurrency(totalBalance, globalCurrency)}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={cn("px-2 py-0.5 rounded-md text-xs font-bold", thisMonthBalance >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>
              {thisMonthBalance >= 0 ? '+' : ''}{formatCurrency(thisMonthBalance, globalCurrency)}
            </span>
            <span className="text-sm font-medium text-slate-500">This Month</span>
            <div className="flex items-center gap-1 text-slate-400 ml-1">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto h-24 w-full rounded-xl flex items-end overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} style={{ outline: 'none' }}>
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-lg shadow-xl">
                      Saved: {formatCurrency(payload[0].value as number, globalCurrency)}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} style={{ outline: 'none' }} activeBar={false}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === chartData.length - 1 ? '#2563eb' : '#bfdbfe'} 
                  className="transition-all duration-300 hover:fill-blue-400"
                  style={{ outline: 'none' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SummaryPanel;
