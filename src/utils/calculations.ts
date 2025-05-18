import { Transaction, TransactionType, FilterOptions } from '../types';
import { parseISO, isAfter, isBefore, isEqual } from 'date-fns';

export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((balance, transaction) => {
    if (transaction.type === 'income') {
      return balance + transaction.amount;
    } else {
      return balance - transaction.amount;
    }
  }, 0);
};

export const calculateTotalByType = (
  transactions: Transaction[],
  type: TransactionType
): number => {
  return transactions
    .filter((t) => t.type === type)
    .reduce((total, t) => total + t.amount, 0);
};

export const filterTransactions = (
  transactions: Transaction[],
  filters: FilterOptions
): Transaction[] => {
  return transactions.filter((transaction) => {
    // Filter by type
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }

    // Filter by category
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }

    // Filter by date range
    if (filters.startDate || filters.endDate) {
      const transactionDate = parseISO(transaction.date);
      
      if (filters.startDate) {
        const startDate = parseISO(filters.startDate);
        if (isBefore(transactionDate, startDate) && !isEqual(transactionDate, startDate)) {
          return false;
        }
      }
      
      if (filters.endDate) {
        const endDate = parseISO(filters.endDate);
        if (isAfter(transactionDate, endDate) && !isEqual(transactionDate, endDate)) {
          return false;
        }
      }
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        transaction.description?.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query)
      );
    }

    return true;
  });
};

export const groupTransactionsByCategory = (
  transactions: Transaction[],
  type: TransactionType
): { [category: string]: number } => {
  return transactions
    .filter((t) => t.type === type)
    .reduce((groups, transaction) => {
      const { category, amount } = transaction;
      if (!groups[category]) {
        groups[category] = 0;
      }
      groups[category] += amount;
      return groups;
    }, {} as { [category: string]: number });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};