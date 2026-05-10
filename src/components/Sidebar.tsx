import React from 'react';
import { LayoutDashboard, Receipt, Wallet, BarChart3, Settings, PlusCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onAddExpense: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onAddExpense }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'budgets', label: 'Budgets', icon: Wallet },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-20 transition-all duration-300">
      <div className="p-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ExpensePro</h1>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Personal Finance</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group",
              activeView === item.id
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              activeView === item.id ? "text-white" : "text-slate-400 group-hover:text-slate-900"
            )} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <button
          onClick={onAddExpense}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-blue-100"
        >
          <PlusCircle className="w-5 h-5" />
          New Transaction
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
