import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MoreVertical } from 'lucide-react';
import { SpendingData } from '../types';

interface SpendingDonutProps {
  data: SpendingData[];
}

const SpendingDonut: React.FC<SpendingDonutProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Spending Breakdown</h3>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center gap-6 md:gap-8 min-h-[200px]">
        <div className="w-full sm:w-1/2 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart style={{ outline: 'none' }}>
              <Pie
                data={data}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                style={{ outline: 'none' }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" style={{ outline: 'none' }} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', outline: 'none' }}
                itemStyle={{ fontWeight: 'bold' }}
                formatter={(value: number, name: string) => [`${value}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 w-full space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingDonut;
