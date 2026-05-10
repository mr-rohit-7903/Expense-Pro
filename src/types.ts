export type Category = 'Food' | 'Travel' | 'Shopping' | 'Education' | 'Utilities' | 'Entertainment' | 'Health' | 'Other' | 'Income';

export interface Transaction {
  id: string;
  name: string;
  category: Category;
  amount: number;
  date: string;
  type: 'expense' | 'income';
}

export interface SpendingData {
  name: string;
  value: number;
  color: string;
}
