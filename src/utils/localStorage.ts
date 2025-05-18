import { Transaction, Category } from '../types';

const TRANSACTIONS_KEY = 'expense_tracker_transactions';
const CATEGORIES_KEY = 'expense_tracker_categories';
const THEME_KEY = 'expense_tracker_theme';

// Transaction Functions
export const getTransactions = (): Transaction[] => {
  const transactions = localStorage.getItem(TRANSACTIONS_KEY);
  return transactions ? JSON.parse(transactions) : [];
};

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

// Category Functions
export const getCategories = (): Category[] => {
  const categories = localStorage.getItem(CATEGORIES_KEY);
  if (categories) {
    return JSON.parse(categories);
  }
  
  // Default categories if none exist
  const defaultCategories: Category[] = [
    { id: '1', name: 'Salary', type: 'income', color: '#10B981' },
    { id: '2', name: 'Freelance', type: 'income', color: '#3B82F6' },
    { id: '3', name: 'Investment', type: 'income', color: '#8B5CF6' },
    { id: '4', name: 'Food', type: 'expense', color: '#F59E0B' },
    { id: '5', name: 'Transportation', type: 'expense', color: '#EF4444' },
    { id: '6', name: 'Housing', type: 'expense', color: '#EC4899' },
    { id: '7', name: 'Entertainment', type: 'expense', color: '#6366F1' },
    { id: '8', name: 'Utilities', type: 'expense', color: '#14B8A6' },
    { id: '9', name: 'Healthcare', type: 'expense', color: '#F43F5E' },
    { id: '10', name: 'Education', type: 'expense', color: '#8B5CF6' },
    { id: '11', name: 'Other', type: 'both', color: '#6B7280' },
  ];
  
  saveCategories(defaultCategories);
  return defaultCategories;
};

export const saveCategories = (categories: Category[]): void => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

// Theme Functions
export const getTheme = (): 'light' | 'dark' => {
  const theme = localStorage.getItem(THEME_KEY);
  return theme as 'light' | 'dark' || 'light';
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme);
};