import { Transaction } from '../types';
import appData from '../data.json';

// Simple in-memory store for the current session to allow additions
let transactions = [...appData.transactions] as Transaction[];

export async function getTransactions(): Promise<Transaction[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [...transactions];
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newTx = {
    ...transaction,
    id: Math.random().toString(36).substr(2, 9),
  };
  transactions = [newTx, ...transactions];
  return newTx;
}

export async function getMonthlyData() {
  await new Promise(resolve => setTimeout(resolve, 800));
  return appData.monthlyData;
}

export async function deleteTransaction(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  transactions = transactions.filter(t => t.id !== id);
}
